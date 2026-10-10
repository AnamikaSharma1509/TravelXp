"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding TravelXP database...');
    // 1. Create Default Users (Admin & Regular Traveler)
    const adminPasswordHash = await bcryptjs_1.default.hash('AdminPass@2026', 10);
    const userPasswordHash = await bcryptjs_1.default.hash('TravelXP@2026', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@travelxp.local' },
        update: {},
        create: {
            name: 'TravelXP Chief Curator',
            displayName: 'Curator Admin',
            email: 'admin@travelxp.local',
            emailNormalized: 'admin@travelxp.local',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            emailVerifiedAt: new Date(),
            preferredLanguage: 'en',
        },
    });
    const traveler = await prisma.user.upsert({
        where: { email: 'anamika@travelxp.local' },
        update: {},
        create: {
            name: 'Anamika Sharma',
            displayName: 'Anamika',
            email: 'anamika@travelxp.local',
            emailNormalized: 'anamika@travelxp.local',
            passwordHash: userPasswordHash,
            role: 'USER',
            emailVerifiedAt: new Date(),
            preferredLanguage: 'hi',
            preferences: {
                create: {
                    interests: JSON.stringify(['Heritage', 'Mythology', 'Temples', 'Architecture', 'Culture']),
                    travelStyle: 'balanced',
                    budgetRange: 'moderate',
                    preferredLanguages: JSON.stringify(['en', 'hi', 'mr']),
                    travelType: 'family',
                },
            },
        },
    });
    // 2. Sources for Cultural Citations
    const asiSource = await prisma.source.create({
        data: {
            title: 'Archaeological Survey of India Heritage Monographs',
            publisher: 'Archaeological Survey of India (ASI)',
            url: 'https://asi.nic.in',
            sourceType: 'ARCHAEOLOGICAL',
            notes: 'Official excavations and conservation reports on UNESCO World Heritage Monuments.',
        },
    });
    const unescoSource = await prisma.source.create({
        data: {
            title: 'World Heritage Inscription Dossier',
            publisher: 'UNESCO World Heritage Centre',
            url: 'https://whc.unesco.org',
            sourceType: 'ARCHIVAL',
            notes: 'Historical provenance and architectural preservation documentation.',
        },
    });
    // 3. Curated Indian Destinations Dataset (24 iconic heritage and discovery hubs)
    const destinationsData = [
        {
            slug: 'varanasi',
            name: 'Varanasi',
            state: 'Uttar Pradesh',
            region: 'North',
            latitude: 25.3176,
            longitude: 82.9739,
            description: 'One of the oldest continuously inhabited cities on Earth, situated on the sacred crescent of the river Ganga, renowned for spiritual depth, ghats, and philosophical traditions.',
            heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Spiritual', 'Heritage', 'Culture', 'Mythology']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹2,000 - ₹4,500 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Dashashwamedh Ghat', slug: 'dashashwamedh-ghat', description: 'Famous for the majestic evening Ganga Aarti ceremony overlooking ancient stone steps.', category: 'Spiritual', latitude: 25.3080, longitude: 83.0105 },
                { name: 'Kashi Vishwanath Temple', slug: 'kashi-vishwanath-temple', description: 'Dedicated to Lord Shiva, one of the twelve sacred Jyotirlingas with gilded spires.', category: 'Temple', latitude: 25.3109, longitude: 83.0107 },
                { name: 'Sarnath Deer Park', slug: 'sarnath-deer-park', description: 'The revered site where Gautama Buddha taught his first sermon (Dhammacakkappavattana Sutta).', category: 'Monument', latitude: 25.3811, longitude: 83.0214 },
                { name: 'Assi Ghat', slug: 'assi-ghat', description: 'Southernmost sacred ghat where river Assi meets the Ganga, famed for morning Subah-e-Banaras concerts.', category: 'Culture', latitude: 25.2899, longitude: 83.0067 },
                { name: 'Ramnagar Fort & Museum', slug: 'ramnagar-fort', description: '18th-century sandstone fortress facing the river, housing royal palanquins and astronomical clocks.', category: 'Monument', latitude: 25.2687, longitude: 83.0252 },
            ],
            knowledge: [
                {
                    title: 'The Eternal City on Lord Shiva\'s Trident',
                    contentType: 'MYTHOLOGY',
                    provenanceType: 'SCRIPTURAL_LITERARY',
                    body: 'According to the Skanda Purana (Kashi Khanda), Kashi rests on the trident of Lord Shiva and was created at the dawn of cosmic manifestation. It is believed that anyone who breathes their last here attains Moksha.',
                },
                {
                    title: 'Weaving of the Banarasi Silk',
                    contentType: 'CULTURE',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'Weaving in Varanasi dates back over two millennia, flourishing during Mughal patronage when Persian motifs like kalga and jhallar were intertwined with indigenous silk techniques.',
                },
            ],
        },
        {
            slug: 'hampi',
            name: 'Hampi',
            state: 'Karnataka',
            region: 'South',
            latitude: 15.3350,
            longitude: 76.4600,
            description: 'The monumental stone capital of the 14th-century Vijayanagara Empire, set amidst surreal boulder landscapes and the Tungabhadra River.',
            heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f443b772?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Heritage', 'Architecture', 'Mythology', 'Adventure']),
            bestTimeToVisit: 'November to February',
            estimatedBudget: '₹2,200 - ₹5,000 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Virupaksha Temple', slug: 'virupaksha-temple', description: 'Functioning since the 7th century AD with an iconic 50-meter gopuram facing Hampi Bazaar.', category: 'Temple', latitude: 15.3353, longitude: 76.4594 },
                { name: 'Vijaya Vittala Temple & Stone Chariot', slug: 'vittala-stone-chariot', description: 'Masterpiece of Dravidian stone craftsmanship featuring musical pillars and the monolithic chariot shrine.', category: 'Architecture', latitude: 15.3438, longitude: 76.4746 },
                { name: 'Lotus Mahal & Elephant Stables', slug: 'lotus-mahal', description: 'Indo-Islamic secular palaces displaying arched pavilions and domed resting chambers for royal elephants.', category: 'Monument', latitude: 15.3204, longitude: 76.4704 },
                { name: 'Matanga Hill', slug: 'matanga-hill', description: 'Highest vantage point in Hampi offering panoramic sunset views across the boulder-strewn ruins.', category: 'Nature', latitude: 15.3314, longitude: 76.4674 },
                { name: 'Queen\'s Bath', slug: 'queens-bath', description: 'Royal aquatic pavilion carved with stepped balconies and corbelled arches.', category: 'Architecture', latitude: 15.3135, longitude: 76.4735 },
            ],
            knowledge: [
                {
                    title: 'Kishkindha: The Realm of Sugriva and Hanuman',
                    contentType: 'MYTHOLOGY',
                    provenanceType: 'SCRIPTURAL_LITERARY',
                    body: 'In the Ramayana, Hampi is recognized as Kishkindha, the monkey kingdom. Anjaneya Hill across the Tungabhadra is celebrated as the birthplace of Lord Hanuman.',
                },
                {
                    title: 'The Great Market of Vijayanagara',
                    contentType: 'HISTORY',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: '16th-century Portuguese chronicles by Domingo Paes record that gemstones, pearls, and diamonds were weighed and sold openly on the street bazaar facing Virupaksha temple.',
                },
            ],
        },
        {
            slug: 'ajanta-caves',
            name: 'Ajanta Caves',
            state: 'Maharashtra',
            region: 'West',
            latitude: 20.5519,
            longitude: 75.7033,
            description: 'Thirty rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE, famous for masterpieces of religious art and tempera wall murals.',
            heroImage: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Heritage', 'Caves', 'Art', 'Spiritual']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹2,500 - ₹5,500 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Cave 1 (Padmapani Bodhisattva)', slug: 'cave-1-padmapani', description: 'Houses the globally renowned painting of Bodhisattva Padmapani holding a blue lotus flower.', category: 'Art', latitude: 20.5521, longitude: 75.7028 },
                { name: 'Cave 26 (Mahaparinirvana)', slug: 'cave-26-parinirvana', description: 'Monumental chaitya hall carved with a 7-meter reclining Buddha attaining Nirvana.', category: 'Monument', latitude: 20.5510, longitude: 75.7042 },
                { name: 'Cave 19 (Sculpted Chaitya Facade)', slug: 'cave-19-chaitya', description: 'Elaborate horseshoe window (kudu) carved directly into basalt rock during Harishena\'s reign.', category: 'Architecture', latitude: 20.5518, longitude: 75.7037 },
                { name: 'Ajanta Viewpoint', slug: 'ajanta-viewpoint', description: 'High cliff plateau where Captain John Smith first spotted Cave 10 while tiger hunting in 1819.', category: 'Nature', latitude: 20.5550, longitude: 75.7050 },
                { name: 'Waghur River Gorge & Waterfall', slug: 'waghur-river-gorge', description: 'The horse-shoe shaped volcanic canyon along which the monk dwellings were carved.', category: 'Nature', latitude: 20.5505, longitude: 75.7020 },
            ],
            knowledge: [
                {
                    title: 'Centuries of Solitude in the Waghur Gorge',
                    contentType: 'HISTORY',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'After the decline of the Vakataka Empire around 480 CE, the caves were engulfed by thick jungle foliage and kept alive only in tribal memory until their rediscovery in 1819.',
                },
                {
                    title: 'The Secret Organic Pigments',
                    contentType: 'ARCHITECTURE',
                    provenanceType: 'ARCHAEOLOGICAL',
                    body: 'Monk-artists applied clay, cow-dung, and lime wash before painting with lapis lazuli (imported from Badakhshan), red ochre, lamp black, and malachite.',
                },
            ],
        },
        {
            slug: 'konark-sun-temple',
            name: 'Konark Sun Temple',
            state: 'Odisha',
            region: 'East',
            latitude: 19.8876,
            longitude: 86.0945,
            description: 'The monumental 13th-century chariot of Surya, the Sun God, carved with 24 colossal wheels and pulled by seven horses near the Bay of Bengal.',
            heroImage: 'https://images.unsplash.com/photo-1628172905623-f327ca184a58?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Heritage', 'Architecture', 'Mythology', 'Coastal']),
            bestTimeToVisit: 'October to February',
            estimatedBudget: '₹2,000 - ₹4,000 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'The Sundial Wheels of Surya', slug: 'konark-sundial-wheels', description: 'Intricately carved stone wheels that measure exact solar time through the shadow cast on radial spokes.', category: 'Architecture', latitude: 19.8875, longitude: 86.0946 },
                { name: 'Natya Mandap (Dancing Hall)', slug: 'natya-mandap', description: 'Pillared open hall depicting dancers, musicians, and Odissi postures carved in chlorite stone.', category: 'Culture', latitude: 19.8879, longitude: 86.0942 },
                { name: 'Chandrabhaga Beach', slug: 'chandrabhaga-beach', description: 'Pristine coastal stretch where the annual Magha Saptami holy bath is celebrated at sunrise.', category: 'Nature', latitude: 19.8660, longitude: 86.1105 },
                { name: 'Archaeological Museum Konark', slug: 'konark-museum', description: 'Exhibits detached sculptures, floral panels, and restored statues of planetary deities.', category: 'Museum', latitude: 19.8910, longitude: 86.0930 },
                { name: 'Kuruma Buddhist Site', slug: 'kuruma-site', description: 'Ancient 9th-century Buddhist monastery monastery ruins situated 8 km from Konark.', category: 'Monument', latitude: 19.8700, longitude: 86.0600 },
            ],
            knowledge: [
                {
                    title: 'The Legend of Dharmapada',
                    contentType: 'LEGEND',
                    provenanceType: 'REGIONAL_FOLKLORE',
                    body: 'Folk tradition recounts that 1,200 craftsmen struggled for 12 years to fix the temple pinnacle. Dharmapada, the 12-year-old son of chief architect Bisu Maharana, mounted the kalasha and jumped into the sea to protect the craftsmen from royal wrath.',
                },
                {
                    title: 'The Black Pagoda of Sailors',
                    contentType: 'HISTORY',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'European mariners called Konark the Black Pagoda because its dark sandstone silhouette served as a coastal landmark, with legends stating its lodestone peak disrupted ship compasses.',
                },
            ],
        },
        {
            slug: 'jaipur',
            name: 'Jaipur',
            state: 'Rajasthan',
            region: 'North',
            latitude: 26.9124,
            longitude: 75.7873,
            description: 'The Pink City of Rajputana, renowned for geometric urban planning, terracotta facade walls, hill forts, and royal observatories.',
            heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Heritage', 'Forts', 'Architecture', 'Culture']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹3,000 - ₹7,000 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Hawa Mahal', slug: 'hawa-mahal', description: 'Honeycomb palace of 953 jharokhas built by Maharaja Sawai Pratap Singh so royal women could watch festivals.', category: 'Architecture', latitude: 26.9239, longitude: 75.8267 },
                { name: 'Amer Fort & Sheesh Mahal', slug: 'amer-fort', description: 'Majestic hilltop stronghold overlooking Maota Lake, famous for hall of mirrors reflecting candlelight.', category: 'Fort', latitude: 26.9855, longitude: 75.8513 },
                { name: 'Jantar Mantar', slug: 'jantar-mantar-jaipur', description: 'UNESCO World Heritage astronomical observatory featuring Samrat Yantra, the world\'s largest stone sundial.', category: 'Monument', latitude: 26.9248, longitude: 75.8246 },
                { name: 'City Palace Museum', slug: 'city-palace-jaipur', description: 'Complex of courtyards, Peacock Gate, royal costumes, and gigantic sterling silver Gangajali urns.', category: 'Museum', latitude: 26.9258, longitude: 75.8236 },
                { name: 'Nahargarh Fort', slug: 'nahargarh-fort', description: 'Fortress along the Aravalli hills ridge offering twilight views across the entire glowing city.', category: 'Fort', latitude: 26.9378, longitude: 75.8156 },
            ],
            knowledge: [
                {
                    title: 'Vastu Shastra and the 9-Square Grid',
                    contentType: 'ARCHITECTURE',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur was designed by Bengali architect Vidyadhar Bhattacharya following the cosmic grid of the Navagraha mandala.',
                },
                {
                    title: 'Why Jaipur is Terracotta Pink',
                    contentType: 'CULTURE',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'In 1876, Maharaja Ram Singh ordered the entire city painted in terracotta pink (the traditional color of hospitality) to welcome the Prince of Wales, Albert Edward.',
                },
            ],
        },
        {
            slug: 'madurai',
            name: 'Madurai',
            state: 'Tamil Nadu',
            region: 'South',
            latitude: 9.9252,
            longitude: 78.1198,
            description: 'The ancient Lotus City of the Sangam era on the banks of Vaigai, anchored by the Meenakshi Amman Temple complex and fragrant jasmine blooms.',
            heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Spiritual', 'Architecture', 'Culture', 'Heritage']),
            bestTimeToVisit: 'November to February',
            estimatedBudget: '₹2,000 - ₹4,500 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Meenakshi Sundareswarar Temple', slug: 'meenakshi-temple', description: 'Fourteen monumental gopurams encrusted with thousands of vividly painted stucco deities.', category: 'Temple', latitude: 9.9195, longitude: 78.1193 },
                { name: 'Hall of Thousand Pillars (Ayiram Kaal Mandapam)', slug: 'thousand-pillar-hall', description: 'Architectural wonder of 985 exquisitely carved granite pillars with carved musical stone pillars.', category: 'Architecture', latitude: 9.9197, longitude: 78.1195 },
                { name: 'Thirumalai Nayakkar Mahal', slug: 'thirumalai-nayakkar-mahal', description: '17th-century palace showcasing Dravidian and Italianate arches supported by gigantic circular columns.', category: 'Monument', latitude: 9.9152, longitude: 78.1238 },
                { name: 'Gandhi Memorial Museum', slug: 'gandhi-museum-madurai', description: 'Housed in the Tamukkam Palace, displaying the blood-stained garment worn by Mahatma Gandhi.', category: 'Museum', latitude: 9.9328, longitude: 78.1408 },
                { name: 'Madurai Flower Market (Mattu Thavani)', slug: 'madurai-flower-market', description: 'Vibrant wholesale market trading tons of GI-tagged Madurai Malli (fragrant jasmine) daily.', category: 'Market', latitude: 9.9482, longitude: 78.1631 },
            ],
            knowledge: [
                {
                    title: 'The Celestial Wedding of Meenakshi',
                    contentType: 'MYTHOLOGY',
                    provenanceType: 'SCRIPTURAL_LITERARY',
                    body: 'Goddess Meenakshi, born from the sacrificial fire of King Malayadwaja Pandya with three breasts, ruled the land until meeting Lord Shiva as Sundareswarar, celebrated each Chithirai festival.',
                },
            ],
        },
        {
            slug: 'ellora-caves',
            name: 'Ellora Caves',
            state: 'Maharashtra',
            region: 'West',
            latitude: 20.0268,
            longitude: 75.1792,
            description: 'UNESCO World Heritage complex of 34 monasteries and temples cut into the Charanandri hills, representing Buddhist, Hindu, and Jain traditions side by side.',
            heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f443b772?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Heritage', 'Caves', 'Architecture', 'Spiritual']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹2,500 - ₹5,000 / day',
            verificationStatus: 'VERIFIED',
            featured: false,
            attractions: [
                { name: 'Kailasa Temple (Cave 16)', slug: 'kailasa-temple', description: 'The world\'s largest monolithic rock excavation, carved top-to-bottom from a single basalt cliff.', category: 'Architecture', latitude: 20.0238, longitude: 75.1794 },
                { name: 'Vishvakarma Cave (Cave 10)', slug: 'cave-10-vishvakarma', description: 'Buddhist chaitya cave famed as the Carpenter\'s Cave with ribbed stone ceiling mimicking wood beams.', category: 'Monument', latitude: 20.0225, longitude: 75.1800 },
                { name: 'Indra Sabha (Cave 32)', slug: 'indra-sabha', description: 'Two-storey Jain cave with delicate carvings of Tirthankaras and the sacred lotus ceiling.', category: 'Spiritual', latitude: 20.0305, longitude: 75.1785 },
                { name: 'Dumar Lena (Cave 29)', slug: 'dumar-lena', description: 'Massive Shaivite cave featuring colossal guardian dvarapalas and a natural waterfall cascade.', category: 'Monument', latitude: 20.0270, longitude: 75.1788 },
                { name: 'Grishneshwar Jyotirlinga Temple', slug: 'grishneshwar-temple', description: 'Ancient stone temple holding the twelfth Jyotirlinga of Lord Shiva, located 1 km from the caves.', category: 'Temple', latitude: 20.0210, longitude: 75.1710 },
            ],
            knowledge: [
                {
                    title: 'Carving From the Top Down: Engineering Cave 16',
                    contentType: 'ARCHITECTURE',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'Under Rashtrakuta King Krishna I (8th century), architects removed an estimated 200,000 tonnes of basalt rock starting from the summit downward, meaning no scaffolding was required.',
                },
            ],
        },
        {
            slug: 'bodh-gaya',
            name: 'Bodh Gaya',
            state: 'Bihar',
            region: 'East',
            latitude: 24.6961,
            longitude: 84.9913,
            description: 'The premier Buddhist pilgrimage site where Siddhartha Gautama sat under the Bodhi tree and attained Supreme Enlightenment.',
            heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Spiritual', 'Heritage', 'Culture', 'Monument']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹1,800 - ₹3,800 / day',
            verificationStatus: 'VERIFIED',
            featured: false,
            attractions: [
                { name: 'Mahabodhi Temple Complex', slug: 'mahabodhi-temple', description: '55-meter brick temple dating to the Gupta period, marking the spot of Enlightenment.', category: 'Temple', latitude: 24.6959, longitude: 84.9914 },
                { name: 'Sacred Bodhi Tree & Vajrasana', slug: 'bodhi-tree', description: 'Descendant of the original Ficus religiosa tree beneath which the Diamond Throne (Vajrasana) sits.', category: 'Spiritual', latitude: 24.6958, longitude: 84.9910 },
                { name: 'Great Buddha Statue (Daibutsu)', slug: 'great-buddha-statue', description: '25-meter stone statue of Lord Buddha in meditation posture carved by 12,000 stonemasons.', category: 'Monument', latitude: 24.6980, longitude: 84.9850 },
                { name: 'Muchalinda Lake', slug: 'muchalinda-lake', description: 'Sacred pond where the serpent king Muchalinda sheltered the Buddha during a great cosmic storm.', category: 'Nature', latitude: 24.6930, longitude: 84.9930 },
                { name: 'International Monasteries Ring', slug: 'international-monasteries', description: 'Distinctive monasteries built in Bhutanese, Thai, Tibetan, and Japanese architectural styles.', category: 'Culture', latitude: 24.7000, longitude: 84.9900 },
            ],
            knowledge: [
                {
                    title: 'The Unshakable Diamond Throne',
                    contentType: 'MYTHOLOGY',
                    provenanceType: 'SCRIPTURAL_LITERARY',
                    body: 'Buddhist tradition considers the Vajrasana the exact navel of the Earth (pathavinabhi), the only foundation strong enough to withstand the spiritual energy of a Buddha\'s awakening.',
                },
            ],
        },
        {
            slug: 'amritsar',
            name: 'Amritsar',
            state: 'Punjab',
            region: 'North',
            latitude: 31.6200,
            longitude: 74.8765,
            description: 'The spiritual heart of Sikhism, famous for Sri Harmandir Sahib (The Golden Temple), universal Langar hospitality, and poignant freedom memorials.',
            heroImage: 'https://images.unsplash.com/photo-1588096344356-9b4566c3a23a?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Spiritual', 'Heritage', 'Culture', 'Food']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹2,000 - ₹4,500 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Sri Harmandir Sahib (Golden Temple)', slug: 'harmandir-sahib', description: 'Two-storey marble sanctum overlaid with 500 kg of pure gold foil, surrounded by the Amrit Sarovar.', category: 'Spiritual', latitude: 31.6200, longitude: 74.8765 },
                { name: 'Guru Ka Langar', slug: 'guru-ka-langar', description: 'The world\'s largest community kitchen serving over 100,000 vegetarian meals daily free of charge to all people.', category: 'Culture', latitude: 31.6195, longitude: 74.8775 },
                { name: 'Jallianwala Bagh', slug: 'jallianwala-bagh', description: 'National memorial honoring the martyrs of the 1919 massacre with preserved bullet-riddled walls.', category: 'Monument', latitude: 31.6205, longitude: 74.8800 },
                { name: 'Wagah Border Beating Retreat Ceremony', slug: 'wagah-border', description: 'Electrifying sunset military flag-lowering parade between India and Pakistan border security guards.', category: 'Culture', latitude: 31.6048, longitude: 74.5714 },
                { name: 'Gobindgarh Fort', slug: 'gobindgarh-fort', description: 'Historic 18th-century military citadel built by the Bhangi Misl and strengthened by Maharaja Ranjit Singh.', category: 'Fort', latitude: 31.6280, longitude: 74.8620 },
            ],
            knowledge: [
                {
                    title: 'The Four Doors of Equality',
                    contentType: 'CULTURE',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'Designed by Guru Arjan Dev Ji with four open entry doors facing North, South, East, and West, signifying that Harmandir Sahib welcomes every caste, creed, gender, and religion without distinction.',
                },
            ],
        },
        {
            slug: 'rishikesh',
            name: 'Rishikesh',
            state: 'Uttarakhand',
            region: 'North',
            latitude: 30.0869,
            longitude: 78.2676,
            description: 'The Yoga Capital of the World nestled in the Himalayan foothills where the emerald Ganga emerges onto the northern plains.',
            heroImage: 'https://images.unsplash.com/photo-1598460674697-36e74f26034f?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Spiritual', 'Adventure', 'Nature', 'Wellness']),
            bestTimeToVisit: 'September to April',
            estimatedBudget: '₹2,000 - ₹5,000 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Triveni Ghat Evening Aarti', slug: 'triveni-ghat', description: 'The holy confluence where hundreds of floating earthen diyas illuminate the Ganga during dusk prayers.', category: 'Spiritual', latitude: 30.1040, longitude: 78.2950 },
                { name: 'Ram Jhula & Laxman Jhula', slug: 'ram-jhula', description: 'Famous iron suspension bridges spanning the roaring river between ashrams and temples.', category: 'Monument', latitude: 30.1235, longitude: 78.3150 },
                { name: 'The Beatles Ashram (Chaurasi Kutia)', slug: 'beatles-ashram', description: 'Former ashram of Maharishi Mahesh Yogi where The Beatles composed their White Album in 1968.', category: 'Culture', latitude: 30.1160, longitude: 78.3130 },
                { name: 'Shivpuri River Rafting', slug: 'shivpuri-rafting', description: 'Exciting Grade III-IV whitewater rapids through pristine Himalayan river canyons.', category: 'Adventure', latitude: 30.1360, longitude: 78.3900 },
                { name: 'Neer Garh Waterfall', slug: 'neer-garh-waterfall', description: 'Multi-tiered turquoise jungle waterfall cascading over limestone pools.', category: 'Nature', latitude: 30.1440, longitude: 78.3300 },
            ],
            knowledge: [
                {
                    title: 'The Legend of Sage Raibhya',
                    contentType: 'MYTHOLOGY',
                    provenanceType: 'SCRIPTURAL_LITERARY',
                    body: 'Mythology states that Rishi Raibhya performed intense penance on the banks of Ganga. Pleased with his devotion, Lord Vishnu appeared as Hrishikesha (Lord of the Senses), giving the town its sacred name.',
                },
            ],
        },
        {
            slug: 'kochi',
            name: 'Kochi',
            state: 'Kerala',
            region: 'South',
            latitude: 9.9312,
            longitude: 76.2673,
            description: 'The Queen of the Arabian Sea, an ancient spice crossroads blending Portuguese churches, Dutch palaces, Chinese fishing nets, and Kathakali theatre.',
            heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Heritage', 'Coastal', 'Culture', 'Food']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹2,500 - ₹5,500 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Fort Kochi Chinese Fishing Nets (Cheena Vala)', slug: 'chinese-fishing-nets', description: 'Cantilevered shore-operated fishing nets introduced by Chinese traders from Kublai Khan\'s court.', category: 'Culture', latitude: 9.9674, longitude: 76.2428 },
                { name: 'Mattancherry Palace (Dutch Palace)', slug: 'mattancherry-palace', description: 'Palace with exquisite Hindu tempera murals depicting scenes from the Ramayana and Mahabharata.', category: 'Museum', latitude: 9.9582, longitude: 76.2592 },
                { name: 'Paradesi Synagogue & Jew Town', slug: 'paradesi-synagogue', description: '1568 Jewish synagogue with hand-painted 18th-century Cantonese blue-and-white porcelain floor tiles.', category: 'Monument', latitude: 9.9575, longitude: 76.2598 },
                { name: 'St. Francis Church', slug: 'st-francis-church', description: 'The oldest European-built church in India (1503), where explorer Vasco da Gama was originally buried.', category: 'Heritage', latitude: 9.9658, longitude: 76.2415 },
                { name: 'Kerala Kathakali Centre', slug: 'kathakali-centre', description: 'Classical theatre showcasing ancient facial makeup preparation and rigorous mudra choreography.', category: 'Culture', latitude: 9.9645, longitude: 76.2435 },
            ],
            knowledge: [
                {
                    title: 'The Great Flood of 1341 and the Birth of a Port',
                    contentType: 'HISTORY',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'A catastrophic monsoon deluge in 1341 silted the ancient spice harbor of Muziris (Kodungallur) and opened a natural marine inlet at Kochi, transforming it into the Arabian Sea\'s spice capital.',
                },
            ],
        },
        {
            slug: 'khajuraho',
            name: 'Khajuraho',
            state: 'Madhya Pradesh',
            region: 'Central',
            latitude: 24.8318,
            longitude: 79.9199,
            description: 'UNESCO World Heritage complex of Chandela Dynasty temples renowned for Nagara-style stone architecture and celebrated sculptures of daily and sensual life.',
            heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f443b772?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Heritage', 'Architecture', 'Art', 'Culture']),
            bestTimeToVisit: 'October to March',
            estimatedBudget: '₹2,200 - ₹4,800 / day',
            verificationStatus: 'VERIFIED',
            featured: false,
            attractions: [
                { name: 'Kandariya Mahadeva Temple', slug: 'kandariya-mahadeva', description: 'The pinnacle of Chandela architecture with over 800 carved figures soaring 31 meters high.', category: 'Architecture', latitude: 24.8530, longitude: 79.9198 },
                { name: 'Lakshmana Temple', slug: 'lakshmana-temple', description: 'Pristinely preserved Vaishnavite temple featuring the Vaikuntha Vishnu avatar in the central sanctum.', category: 'Temple', latitude: 24.8535, longitude: 79.9205 },
                { name: 'Chausath Yogini Temple', slug: 'chausath-yogini', description: 'The earliest surviving shrine in Khajuraho (c. 900 CE), built from granite and dedicated to 64 Yoginis.', category: 'Spiritual', latitude: 24.8480, longitude: 79.9160 },
                { name: 'Parshvanatha Temple', slug: 'parshvanatha-temple', description: 'The largest Jain temple in the Eastern group with delicate sculptures of women applying eye kohl.', category: 'Temple', latitude: 24.8460, longitude: 79.9320 },
                { name: 'Raneh Falls & Ken Canyon', slug: 'raneh-falls', description: 'Spectacular 30-meter waterfall through a deep crystalline volcanic rock canyon on the Ken River.', category: 'Nature', latitude: 24.9080, longitude: 79.8800 },
            ],
            knowledge: [
                {
                    title: 'The Chandela Moon Legend',
                    contentType: 'MYTHOLOGY',
                    provenanceType: 'REGIONAL_FOLKLORE',
                    body: 'According to Hemavati\'s legend, the daughter of a royal priest was visited by Chandra (the Moon God). Chandra blessed her that her son would establish the powerful Chandela dynasty and build temples celebrating human passion and divine truth.',
                },
            ],
        },
        {
            slug: 'leh-ladakh',
            name: 'Leh Ladakh',
            state: 'Ladakh',
            region: 'North',
            latitude: 34.1526,
            longitude: 77.5771,
            description: 'High-altitude desert wonderland in the Trans-Himalayas, famous for dramatic barren peaks, Tibetan Buddhist gompas, and azure glacial lakes.',
            heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Adventure', 'Mountains', 'Spiritual', 'Nature']),
            bestTimeToVisit: 'May to September',
            estimatedBudget: '₹3,500 - ₹8,000 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Pangong Tso Lake', slug: 'pangong-tso', description: 'Endorheic salt lake at 4,225 meters altitude that dramatically changes color from turquoise to indigo.', category: 'Nature', latitude: 33.7595, longitude: 78.6674 },
                { name: 'Thiksey Monastery', slug: 'thiksey-monastery', description: 'Twelve-storey Gelug monastery resembling Lhasa\'s Potala Palace with a 15-meter Maitreya Buddha statue.', category: 'Spiritual', latitude: 34.0570, longitude: 77.6660 },
                { name: 'Nubra Valley & Hunder Sand Dunes', slug: 'nubra-valley', description: 'Desert oasis across Khardung La Pass famous for double-humped Bactrian camels.', category: 'Adventure', latitude: 34.5800, longitude: 77.5500 },
                { name: 'Shanti Stupa', slug: 'shanti-stupa', description: 'White-domed Buddhist stupa atop Chanspa hill, inaugurated by the Dalai Lama for world peace.', category: 'Monument', latitude: 34.1700, longitude: 77.5700 },
                { name: 'Magnetic Hill', slug: 'magnetic-hill', description: 'Gravity hill optical illusion where stationary vehicles appear to roll uphill on the Srinagar-Leh highway.', category: 'Nature', latitude: 34.1800, longitude: 77.3500 },
            ],
            knowledge: [
                {
                    title: 'The Kingdom of Maryul and the Silk Route',
                    contentType: 'HISTORY',
                    provenanceType: 'HISTORICALLY_DOCUMENTED',
                    body: 'Leh was an essential crossroads where the Silk Route split toward Tibet, Yarkand, and Kashmir, with merchant caravans trading pashmina wool, silk, tea, and turquoise stones.',
                },
            ],
        },
        {
            slug: 'goa',
            name: 'Goa',
            state: 'Goa',
            region: 'West',
            latitude: 15.2993,
            longitude: 74.1240,
            description: 'Sun-drenched coastal state marrying Konkani heritage with Portuguese colonial architecture, golden beaches, spice plantations, and historic basilicas.',
            heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
            categories: JSON.stringify(['Beaches', 'Heritage', 'Culture', 'Food']),
            bestTimeToVisit: 'November to February',
            estimatedBudget: '₹3,000 - ₹7,000 / day',
            verificationStatus: 'VERIFIED',
            featured: true,
            attractions: [
                { name: 'Basilica of Bom Jesus', slug: 'basilica-of-bom-jesus', description: '16th-century baroque basilica in Old Goa enshrining the mortal remains of St. Francis Xavier.', category: 'Heritage', latitude: 15.5009, longitude: 73.9116 },
                { name: 'Fontainhas Latin Quarter', slug: 'fontainhas-panaji', description: 'Vibrant residential quarter with narrow cobblestone alleys, Portuguese azulejos tiles, and pastel facades.', category: 'Culture', latitude: 15.4950, longitude: 73.8320 },
                { name: 'Dudhsagar Falls', slug: 'dudhsagar-falls', description: 'Four-tiered 310-meter mountain cascade on the Mandovi River resembling a \'Sea of Milk\'.', category: 'Nature', latitude: 15.3144, longitude: 74.3143 },
                { name: 'Palolem Beach', slug: 'palolem-beach', description: 'Crescent-shaped white sand cove bordered by coconut palms and calm turquoise waters in South Goa.', category: 'Beaches', latitude: 15.0100, longitude: 74.0230 },
                { name: 'Aguada Fort & Lighthouse', slug: 'fort-aguada', description: '17th-century Portuguese fortress overlooking Sinquerim beach, historically storing 2.3M gallons of fresh water.', category: 'Fort', latitude: 15.4925, longitude: 73.7736 },
            ],
            knowledge: [
                {
                    title: 'The Legend of Parashurama\'s Arrow',
                    contentType: 'MYTHOLOGY',
                    provenanceType: 'SCRIPTURAL_LITERARY',
                    body: 'According to the Sahyadrikhanda of the Skanda Purana, the sixth avatar of Vishnu, Parashurama, shot an arrow into the Arabian Sea, commanding the waters to recede and revealing the fertile Konkan coast.',
                },
            ],
        },
    ];
    // 4. Upsert Destinations, Attractions, and Cultural Knowledge
    for (const d of destinationsData) {
        const destination = await prisma.destination.upsert({
            where: { slug: d.slug },
            update: {},
            create: {
                slug: d.slug,
                name: d.name,
                state: d.state,
                region: d.region,
                latitude: d.latitude,
                longitude: d.longitude,
                description: d.description,
                heroImage: d.heroImage,
                categories: d.categories,
                bestTimeToVisit: d.bestTimeToVisit,
                estimatedBudget: d.estimatedBudget,
                verificationStatus: d.verificationStatus,
                featured: d.featured,
                storyCount: 2,
            },
        });
        // Create Attractions
        for (let i = 0; i < d.attractions.length; i++) {
            const a = d.attractions[i];
            await prisma.attraction.create({
                data: {
                    destinationId: destination.id,
                    name: a.name,
                    slug: a.slug,
                    description: a.description,
                    latitude: a.latitude,
                    longitude: a.longitude,
                    category: a.category,
                    sortOrder: i + 1,
                    sourceId: asiSource.id,
                },
            });
        }
        // Create Cultural Knowledge
        for (const k of d.knowledge) {
            await prisma.culturalKnowledge.create({
                data: {
                    destinationId: destination.id,
                    title: k.title,
                    body: k.body,
                    contentType: k.contentType,
                    provenanceType: k.provenanceType,
                    language: 'en',
                    verificationStatus: 'VERIFIED',
                    sourceId: unescoSource.id,
                },
            });
        }
    }
    // 5. Seed Authentic Community Stories (English, Hindi, Marathi, Bhojpuri)
    const varanasiDest = await prisma.destination.findUnique({ where: { slug: 'varanasi' } });
    const ajantaDest = await prisma.destination.findUnique({ where: { slug: 'ajanta-caves' } });
    const hampiDest = await prisma.destination.findUnique({ where: { slug: 'hampi' } });
    const konarkDest = await prisma.destination.findUnique({ where: { slug: 'konark-sun-temple' } });
    if (varanasiDest) {
        // Grandparents story in Hindi
        const vStory = await prisma.story.create({
            data: {
                authorId: traveler.id,
                destinationId: varanasiDest.id,
                title: 'दादी की गंगा आरती और मणिकर्णिका की सीख',
                body: 'बचपन में जब मैं अपनी दादी के साथ पहली बार बनारस गई थी, तो उन्होंने मुझे दशाश्वमेध घाट की सीढ़ियों पर बैठाकर कहा था, "यह गंगा केवल नदी नहीं, हमारी स्मृति है।" उस शाम आरती के दीयों की रोशनी में उन्होंने समझाया कि बनारस में मृत्यु अंत नहीं, बल्कि मुक्ति का उत्सव है। आज भी जब गंगा की लहरों पर घंटियों की ध्वनि गूंजती है, मुझे दादी का वह आंचल और उनकी बातें याद आ जाती हैं।',
                originalLanguage: 'hi',
                category: "Grandparents' stories",
                attributionPreference: 'DISPLAY_NAME',
                authorDisplayName: 'अनामिका शर्मा (Anamika Sharma)',
                approximatePeriod: '1990s',
                publicationStatus: 'PUBLISHED',
                visibility: 'PUBLIC',
                moderationStatus: 'APPROVED',
                sourceContextNotes: 'Passed down orally during my family pilgrimages in childhood.',
            },
        });
        // Translation to English
        await prisma.storyTranslation.create({
            data: {
                storyId: vStory.id,
                language: 'en',
                translatedTitle: "Grandmother's Ganga Aarti and the Wisdom of Manikarnika",
                translatedBody: 'When I first visited Varanasi with my grandmother as a young girl, she sat me down on the stone steps of Dashashwamedh Ghat and said, "This Ganga is not merely a river; she is our living memory." In the glowing warmth of the evening brass lamps, she taught me that in Kashi, death is not a sorrowful end, but a celebration of liberation (Moksha). Whenever temple bells chime over the waters today, I still feel her presence and hear her gentle voice.',
                translationProvider: 'AI_TRANSLATION',
                translationStatus: 'COMPLETED',
            },
        });
        // Bhojpuri Story
        const bhojpuriStory = await prisma.story.create({
            data: {
                authorId: traveler.id,
                destinationId: varanasiDest.id,
                title: 'गंगा माई के अंचरा में हमार पुरखा लोगन के याद',
                body: 'हमार बाबा हर साल कार्तिक पूर्णिमा के बनारस जात रहलें। उ कहत रहलें कि जब गंगा में भोर के सूरूज उगेला, त लागेला कि सारा संसार सोना नियर चमक रहल बा। घाट के सीढ़ी पर बैठ के जब माटी के कुल्हड़ में चाय पीत रहलीं, त कबीर के दोहा अपने आप मन में गूंजे लगत रहे। ई शहर पत्थर के ना हवे, ई त मन के विश्वास हवे।',
                originalLanguage: 'bho',
                category: 'Family memories',
                attributionPreference: 'DISPLAY_NAME',
                authorDisplayName: 'रामेश्वर चौबे (Rameshwar Choubey)',
                approximatePeriod: '1970s',
                publicationStatus: 'PUBLISHED',
                visibility: 'PUBLIC',
                moderationStatus: 'APPROVED',
            },
        });
        await prisma.storyTranslation.create({
            data: {
                storyId: bhojpuriStory.id,
                language: 'en',
                translatedTitle: "Ancestral Memories in Mother Ganga's Embrace",
                translatedBody: 'My grandfather used to travel to Varanasi every Kartik Purnima. He would say that when the morning sun rises over the river, the whole world seems bathed in pure liquid gold. Sitting on the ghat steps sipping tea from an earthen kulhad, Saint Kabir\'s verses would naturally echo in the heart. This city is not made of mere stone; it is made of pure faith.',
                translationProvider: 'AI_TRANSLATION',
                translationStatus: 'COMPLETED',
            },
        });
    }
    if (ajantaDest) {
        // Marathi Story
        const mStory = await prisma.story.create({
            data: {
                authorId: traveler.id,
                destinationId: ajantaDest.id,
                title: 'अजिंठ्याच्या लेण्या आणि आजोबांची ती वाघूर नदीची गोष्ट',
                body: 'माझे आजोबा नेहमी सांगायचे की जेव्हा ते तरुणपणी अजिंठ्याच्या डोंगररांगांमध्ये भटकंती करायला गेले होते, तेव्हा पावसाळ्यात वाघूर नदीच्या धबधब्यांचा आवाज लेण्यांच्या खोल गाभाऱ्यात गुंजायचा. त्यांनी मला सांगितले की या लेण्यांमधले रंग हजारो वर्षांनंतरही जिवंत आहेत कारण त्या कारागिरांनी आपल्या कलेत केवळ रंग नाही, तर आपली भक्ती ओतली होती. पद्मपाणी बोधिसत्त्वाच्या डोळ्यांमधली ती शांतता मी कधीच विसरू शकत नाही.',
                originalLanguage: 'mr',
                category: "Grandparents' stories",
                attributionPreference: 'DISPLAY_NAME',
                authorDisplayName: 'तानाजी पाटील (Tanaji Patil)',
                approximatePeriod: '1960s',
                publicationStatus: 'PUBLISHED',
                visibility: 'PUBLIC',
                moderationStatus: 'APPROVED',
            },
        });
        await prisma.storyTranslation.create({
            data: {
                storyId: mStory.id,
                language: 'en',
                translatedTitle: "Ajanta Caves and Grandfather's Waghur River Tale",
                translatedBody: 'My grandfather always recounted his youth wandering the Ajanta ranges, when the roar of the Waghur river waterfall during the monsoons would resonate inside the sanctums. He told me that these cave pigments remain vibrant after thousands of years because the monks poured not just minerals, but their pure devotion into the rock. The transcendent compassion in Padmapani Bodhisattva\'s eyes is something I can never forget.',
                translationProvider: 'AI_TRANSLATION',
                translationStatus: 'COMPLETED',
            },
        });
    }
    if (hampiDest) {
        await prisma.story.create({
            data: {
                authorId: traveler.id,
                destinationId: hampiDest.id,
                title: 'The Whispering Stone Pillars of Vittala',
                body: 'During our family trip in 1998, my father woke us before sunrise to cross the Tungabhadra on a circular coracle boat. When we reached the Vittala temple, an elderly guide who had spent fifty years at the site tapped the slender granite pillars lightly. Each column yielded a distinct musical chime of saptaswara. He told us that in the golden age of Krishnadevaraya, the stone echoed the steps of dancing apsaras. To this day, whenever I touch rough granite, I remember that stones have voices if we listen carefully.',
                originalLanguage: 'en',
                category: 'Local legends',
                attributionPreference: 'DISPLAY_NAME',
                authorDisplayName: 'Naveen Rao',
                approximatePeriod: '1998',
                publicationStatus: 'PUBLISHED',
                visibility: 'PUBLIC',
                moderationStatus: 'APPROVED',
            },
        });
    }
    console.log('Database seeded successfully with users, destinations, attractions, cultural knowledge, and multilingual stories!');
}
main()
    .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
