const mongoose = require('mongoose');
const Pest = require('./models/Pest');
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

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/pestDB';
    await mongoose.connect(connStr);
    console.log("Connected to MongoDB for seeding...");
    
    await Pest.deleteMany({});
    await Pest.insertMany(pestData);
    
    console.log("Database Seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
