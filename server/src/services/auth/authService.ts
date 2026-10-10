import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../db/prisma';
import { generateToken } from '../../utils/jwt';
import { logger } from '../../utils/logger';

export class AuthService {
  static async register(data: {
    email: string;
    password?: string;
    name: string;
    displayName?: string;
  }) {
    const emailNormalized = data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { emailNormalized },
    });

    if (existing) {
      throw { statusCode: 409, message: 'An account with this email address already exists.' };
    }

    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;
    const displayName = data.displayName || data.name.split(' ')[0] || data.name;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        displayName,
        email: data.email,
        emailNormalized,
        passwordHash,
        preferredLanguage: 'en',
      },
    });

    // Create verification token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    logger.info(`[Auth] Verification token generated for ${user.email}: ${rawToken}`);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        emailVerified: !!user.emailVerifiedAt,
      },
      token,
      verificationToken: rawToken, // Provided for easy development / verification flow
    };
  }

  static async login(data: { email: string; password: string }) {
    const emailNormalized = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { emailNormalized },
      include: { preferences: true },
    });

    if (!user || !user.passwordHash) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        emailVerified: !!user.emailVerifiedAt,
        preferences: user.preferences,
      },
      token,
    };
  }

  static async googleAuth(data: { email: string; name: string; googleId: string; picture?: string }) {
    const emailNormalized = data.email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
      where: { emailNormalized },
      include: { oauthAccounts: true, preferences: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          displayName: data.name.split(' ')[0] || data.name,
          email: data.email,
          emailNormalized,
          emailVerifiedAt: new Date(),
          oauthAccounts: {
            create: {
              provider: 'google',
              providerAccountId: data.googleId,
            },
          },
        },
        include: { oauthAccounts: true, preferences: true },
      });
    } else {
      const hasOAuth = user.oauthAccounts.some((acc) => acc.provider === 'google');
      if (!hasOAuth) {
        await prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: 'google',
            providerAccountId: data.googleId,
          },
        });
      }
      if (!user.emailVerifiedAt) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerifiedAt: new Date() },
        });
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        emailVerified: true,
        preferences: user.preferences,
      },
      token,
    };
  }

  static async verifyEmail(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await prisma.emailVerificationToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw { statusCode: 400, message: 'Invalid or expired email verification token.' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { verified: true };
  }

  static async forgotPassword(email: string) {
    const emailNormalized = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { emailNormalized } });

    if (!user) {
      // Return success to avoid email enumeration
      return { success: true };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    logger.info(`[Auth] Password reset token for ${user.email}: ${rawToken}`);
    return { success: true, resetToken: rawToken };
  }

  static async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw { statusCode: 400, message: 'Invalid or expired password reset token.' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { reset: true };
  }

  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        role: true,
        preferredLanguage: true,
        emailVerifiedAt: true,
        createdAt: true,
        preferences: true,
      },
    });
    if (!user) throw { statusCode: 404, message: 'User not found' };
    return user;
  }

  static async updatePreferences(userId: string, data: any) {
    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        interests: typeof data.interests === 'string' ? data.interests : JSON.stringify(data.interests || []),
        travelStyle: data.travelStyle || 'balanced',
        budgetRange: data.budgetRange || 'moderate',
        preferredLanguages: typeof data.preferredLanguages === 'string' ? data.preferredLanguages : JSON.stringify(data.preferredLanguages || ['en']),
        travelType: data.travelType || 'family',
        accessibilityPreferences: data.accessibilityPreferences,
      },
      create: {
        userId,
        interests: typeof data.interests === 'string' ? data.interests : JSON.stringify(data.interests || []),
        travelStyle: data.travelStyle || 'balanced',
        budgetRange: data.budgetRange || 'moderate',
        preferredLanguages: typeof data.preferredLanguages === 'string' ? data.preferredLanguages : JSON.stringify(data.preferredLanguages || ['en']),
        travelType: data.travelType || 'family',
        accessibilityPreferences: data.accessibilityPreferences,
      },
    });
    return preferences;
  }
}
