const mongoose = require('mongoose');
const Pest = require('./models/Pest');
const Technology = require('./models/Technology');
require('dotenv').config();

const pestData = [
  {
    name: "ants",
    description: "Small social insects that can invade homes and gardens. While some help aerate soil, others protect aphids which harm plants.",
    solution: "Spray a 50/50 mix of white vinegar and water or peppermint oil around entry points. Use food-grade Diatomaceous Earth (DE) around plants to dehydrate them."
  },
  {
    name: "bees",
    description: "Vital pollinators for the ecosystem. Generally non-aggressive unless their nest is threatened.",
    solution: "Vital pollinators—avoid killing! If they are in an inconvenient spot, use peppermint oil or citronella to gently deter them. Consider calling a local beekeeper for safe relocation."
  },
  {
    name: "beetle",
    description: "Includes various species like Japanese beetles or cucumber beetles that eat leaves and flowers.",
    solution: "Handpick them in the early morning and drop into soapy water. Apply Neem Oil to disrupt their feeding cycles, or use Kaolin clay spray as a deterrent."
  },
  {
    name: "catterpillar",
    description: "Larvae of moths or butterflies. Many species can quickly defoliate plants.",
    solution: "Use Bacillus thuringiensis (Bt), a natural bacteria spray safe for humans. Fine mesh netting (row covers) can prevent moths from laying eggs on plants."
  },
  {
    name: "earthworms",
    description: "Invertebrates that live in the soil. They are highly beneficial for soil health.",
    solution: "Extremely beneficial! They aerate soil and provide nutrient-rich castings. No control needed; encourage their presence for a healthy garden."
  },
  {
    name: "earwig",
    description: "Nocturnal insects with pincers. They feed on decaying matter but can also damage seedlings and flowers.",
    solution: "Place rolled-up damp newspapers or cardboard tubes overnight, then dispose of them. Oil traps (soy sauce + vegetable oil) buried at soil level are also effective."
  },
  {
    name: "grasshopper",
    description: "Strong-jumping insects that can consume large amounts of vegetation quickly.",
    solution: "Spray a homemade garlic-chili blend as a repellent. For large infestations, Nosema locustae is a natural fungus that targets them specifically."
  },
  {
    name: "moth",
    description: "Adult stage of caterpillars. Some species are significant agricultural pests.",
    solution: "Use pheromone traps to disrupt breeding. Plant companion herbs like rosemary, sage, or thyme to mask the scent of host plants."
  },
  {
    name: "slug",
    description: "Shell-less mollusks that thrive in damp conditions and eat holes in leaves.",
    solution: "Set up beer traps (shallow dishes of beer at soil level). Place copper tape around pots, or use pet-safe Iron Phosphate (Sluggo) pellets."
  },
  {
    name: "snail",
    description: "Mollusks with shells that feed on a wide variety of plants in moist environments.",
    solution: "Handpick them at night or in the early morning. Beer traps and copper barriers are effective. Encourage natural predators like birds and frogs."
  },
  {
    name: "wasp",
    description: "Predatory insects that help control other pests but can be aggressive.",
    solution: "Most are beneficial predators. To deter them from building nests, hang a decoy nest. Use essential oils like clove, geranium, or lemongrass as repellents."
  },
  {
    name: "weevil",
    description: "Types of beetles with long snouts. Larvae often feed on roots, while adults eat leaves.",
    solution: "Apply beneficial nematodes to the soil to kill larvae. Use sticky barriers on trunks or pots to catch adults. For grain weevils, use dried bay leaves as a repellent."
  }
];

const technologyData = [
  {
    icon: '📍',
    title: 'Precision Agriculture & GPS',
    tagline: 'Farm with centimeter-level accuracy',
    description: 'Precision agriculture uses GPS guidance systems, satellite imagery, and variable-rate technology to optimize field-level management. Farmers can precisely control seeding, fertilization, and pesticide application rates across different zones of a field, reducing waste by up to 15-20% while maximizing yield.',
    benefits: ['Reduced input costs by targeting specific zones', 'Lower environmental impact through precise application', 'Data-driven decisions using field mapping and analytics'],
  },
  {
    icon: '🛸',
    title: 'Drone Crop Monitoring',
    tagline: 'Eyes in the sky for your fields',
    description: 'Agricultural drones equipped with multispectral and thermal cameras provide real-time aerial views of crop health. NDVI mapping helps detect stress, disease, and nutrient deficiencies weeks before they become visible to the human eye, enabling early intervention.',
    benefits: ['Rapid field scouting covering 100+ acres per flight', 'Early detection of crop stress and disease outbreaks', 'Precision spraying with up to 90% less chemical usage'],
  },
  {
    icon: '📡',
    title: 'IoT Soil Sensors',
    tagline: 'Real-time soil intelligence',
    description: 'Internet of Things (IoT) sensors embedded in the soil continuously monitor moisture levels, temperature, pH, and nutrient content. This data is transmitted wirelessly to dashboards and mobile apps, allowing farmers to make informed irrigation and fertilization decisions in real-time.',
    benefits: ['Continuous 24/7 soil condition monitoring', 'Automated alerts when conditions go out of range', 'Historical data analysis for long-term soil health trends'],
  },
  {
    icon: '🧠',
    title: 'AI & Machine Learning',
    tagline: 'Intelligent farming decisions',
    description: 'Machine learning models trained on vast agricultural datasets can predict crop yields, detect diseases from images, forecast weather impacts, and optimize planting schedules. Computer vision systems — like FieldFlow\'s own pest detection — can identify plant diseases and pests from a single smartphone photo.',
    benefits: ['Automated pest and disease identification from photos', 'Yield prediction models for harvest planning', 'Smart recommendations personalized to local conditions'],
  },
  {
    icon: '🏢',
    title: 'Vertical Farming & Hydroponics',
    tagline: 'Growing upward, not outward',
    description: 'Vertical farms use stacked growing layers in controlled indoor environments, consuming up to 95% less water than traditional farming. Hydroponic and aeroponic systems deliver nutrients directly to plant roots without soil, enabling year-round production regardless of climate or season.',
    benefits: ['95% less water usage compared to traditional farming', 'Year-round crop production in any climate', 'No pesticides needed in controlled environments'],
  },
  {
    icon: '💧',
    title: 'Automated Irrigation',
    tagline: 'Every drop counts',
    description: 'Smart irrigation systems use weather data, soil moisture sensors, and evapotranspiration calculations to automatically deliver the exact amount of water each zone needs. Drip irrigation combined with AI scheduling can reduce water consumption by 30-50% while improving crop quality.',
    benefits: ['Automated scheduling based on real-time weather data', '30-50% reduction in water consumption', 'Zone-based control for fields with varying soil types'],
  },
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/pestDB';
    await mongoose.connect(connStr);
    console.log("Connected to MongoDB for seeding...");
    
    // Seed Pests
    await Pest.deleteMany({});
    await Pest.insertMany(pestData);
    console.log("Pests Seeded!");

    // Seed Technologies
    await Technology.deleteMany({});
    await Technology.insertMany(technologyData);
    console.log("Technologies Seeded!");
    
    console.log("Database Seeding Completed Successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
};

seedDB();
