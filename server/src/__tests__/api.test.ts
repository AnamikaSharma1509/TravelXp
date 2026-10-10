import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('TravelXP API Suite', () => {
  it('GET /api/v1/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/v1/destinations should return seeded destinations', async () => {
    const res = await request(app).get('/api/v1/destinations');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/destinations/map should return markers with color classifications', async () => {
    const res = await request(app).get('/api/v1/destinations/map');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const marker = res.body.data[0];
    expect(marker).toHaveProperty('markerColor');
    expect(marker).toHaveProperty('markerBadge');
    expect(marker).toHaveProperty('latitude');
    expect(marker).toHaveProperty('longitude');
  });

  it('POST /api/v1/bookings/flights/search should return cached provider results with deep links', async () => {
    const res = await request(app)
      .post('/api/v1/bookings/flights/search')
      .send({
        from: 'Delhi',
        to: 'Varanasi',
        departureDate: '2026-11-15',
        tripType: 'one-way',
        passengers: 2,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('deepLink');
  });

  it('POST /api/v1/trips/generate should produce realistic day-by-day time plan and budget breakdown', async () => {
    const res = await request(app)
      .post('/api/v1/trips/generate')
      .send({
        destinationSlug: 'varanasi',
        startDate: '2026-11-20',
        endDate: '2026-11-23',
        travelerCount: 2,
        budget: 30000,
        travelStyle: 'balanced',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const trip = res.body.data;
    expect(trip).toHaveProperty('days');
    expect(trip.days.length).toBe(4);
    expect(trip.budget).toHaveProperty('transportIntercity');
    expect(trip.budget).toHaveProperty('accommodation');
    expect(trip.days[0].activities.length).toBeGreaterThan(2);
  });

  it('GET /api/v1/stories should return multilingual community stories', async () => {
    const res = await request(app).get('/api/v1/stories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stories.length).toBeGreaterThan(0);
  });
});
