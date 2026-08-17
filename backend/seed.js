const mongoose = require('mongoose');
const Pest = require('./models/Pest');
const Technology = require('./models/Technology');
require('dotenv').config();

const pestData = [
  {
    "name": "Adristyrannus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Aleurocanthus spiniferus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Ampelophaga",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Aphis citricola Vander Goot",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Apolygus lucorum",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Bactrocera tsuneonis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Beet spot flies",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Black hairy",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Brevipoalpus lewisi McGregor",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Ceroplastes rubens",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Chlumetia transversa",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Chrysomphalus aonidum",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Cicadella viridis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Cicadellidae",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Colomerus vitis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Dacus dorsalis(Hendel)",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Dasineura sp",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Deporaus marginatus Pascoe",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Erythroneura apicalis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Field Cricket",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Fruit piercing moth",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "Gall fly",
    "description": "These insects lay eggs in or on plants, and their larvae (maggots) feed on the internal tissues, rotting fruits and stems.",
    "solution": "Use fruit fly traps with methyl eugenol. Apply Spinosad for organic control of maggots in affected crops."
  },
  {
    "name": "Icerya purchasi Maskell",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Indigo caterpillar",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "Jute Stem Weevil",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "Jute aphid",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "Jute hairy",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Jute red mite",
    "description": "Microscopic pests that cause stippling on leaves and can cover plants in fine webbing, thriving in dry conditions.",
    "solution": "Spray wettable sulphur or proper miticides like Spiromesifen. Maintain field humidity to naturally deter mite populations."
  },
  {
    "name": "Jute semilooper",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Jute stem girdler",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Jute stick insect",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Lawana imitata Melichar",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Leaf beetle",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "Limacodidae",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Locust",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Locustoidea",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Lycorma delicatula",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Mango flat beak leafhopper",
    "description": "Plant hoppers extract sap and often act as vectors for various plant viruses, especially in rice crops.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "Mealybug",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "Miridae",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Nipaecoccus vastalor",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Panonchus citri McGregor",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Papilio xuthus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Parlatoria zizyphus Lucus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Phyllocnistis citrella Stainton",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Phyllocoptes oleiverus ashmead",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Pieris canidia",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Pod borer",
    "description": "Borer insects tunnel into plant stems and stalks, severely weakening the crop and reducing yield.",
    "solution": "Use pheromone traps for adult monitoring. Apply Bacillus thuringiensis (Bt) or systemic insecticides like Cartap hydrochloride."
  },
  {
    "name": "Polyphagotars onemus latus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Potosiabre vitarsis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Prodenia litura",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Pseudococcus comstocki Kuwana",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Rhytidodera bowrinii white",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Rice Stemfly",
    "description": "These insects lay eggs in or on plants, and their larvae (maggots) feed on the internal tissues, rotting fruits and stems.",
    "solution": "Use fruit fly traps with methyl eugenol. Apply Spinosad for organic control of maggots in affected crops."
  },
  {
    "name": "Salurnis marginella Guerr",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Scirtothrips dorsalis Hood",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Spilosoma Obliqua",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Sternochetus frigidus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Termite",
    "description": "Microscopic pests that cause stippling on leaves and can cover plants in fine webbing, thriving in dry conditions.",
    "solution": "Spray wettable sulphur or proper miticides like Spiromesifen. Maintain field humidity to naturally deter mite populations."
  },
  {
    "name": "Termite odontotermes (Rambur)",
    "description": "Microscopic pests that cause stippling on leaves and can cover plants in fine webbing, thriving in dry conditions.",
    "solution": "Spray wettable sulphur or proper miticides like Spiromesifen. Maintain field humidity to naturally deter mite populations."
  },
  {
    "name": "Tetradacus c Bactrocera minax",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Thrips",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Toxoptera aurantii",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Toxoptera citricidus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Trialeurodes vaporariorum",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Unaspis yanonensis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Viteus vitifoliae",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Xylotrechus",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "Yellow Mite",
    "description": "Microscopic pests that cause stippling on leaves and can cover plants in fine webbing, thriving in dry conditions.",
    "solution": "Spray wettable sulphur or proper miticides like Spiromesifen. Maintain field humidity to naturally deter mite populations."
  },
  {
    "name": "alfalfa plant bug",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "alfalfa seed chalcid",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "alfalfa weevil",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "aphids",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "army worm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "asiatic rice borer",
    "description": "Borer insects tunnel into plant stems and stalks, severely weakening the crop and reducing yield.",
    "solution": "Use pheromone traps for adult monitoring. Apply Bacillus thuringiensis (Bt) or systemic insecticides like Cartap hydrochloride."
  },
  {
    "name": "beet army worm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "beet fly",
    "description": "These insects lay eggs in or on plants, and their larvae (maggots) feed on the internal tissues, rotting fruits and stems.",
    "solution": "Use fruit fly traps with methyl eugenol. Apply Spinosad for organic control of maggots in affected crops."
  },
  {
    "name": "beet weevil",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "beetle",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "bird cherry-oataphid",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "black cutworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "blister beetle",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "bollworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "brown plant hopper",
    "description": "Plant hoppers extract sap and often act as vectors for various plant viruses, especially in rice crops.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "cabbage army worm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "cerodonta denticornis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "corn borer",
    "description": "Borer insects tunnel into plant stems and stalks, severely weakening the crop and reducing yield.",
    "solution": "Use pheromone traps for adult monitoring. Apply Bacillus thuringiensis (Bt) or systemic insecticides like Cartap hydrochloride."
  },
  {
    "name": "corn earworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "cutworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "english grain aphid",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "fall armyworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "flax budworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "flea beetle",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "grain spreader thrips",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "grasshopper",
    "description": "Plant hoppers extract sap and often act as vectors for various plant viruses, especially in rice crops.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "green bug",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "grub",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "large cutworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "legume blister beetle",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "longlegged spider mite",
    "description": "Microscopic pests that cause stippling on leaves and can cover plants in fine webbing, thriving in dry conditions.",
    "solution": "Spray wettable sulphur or proper miticides like Spiromesifen. Maintain field humidity to naturally deter mite populations."
  },
  {
    "name": "lytta polita",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "meadow moth",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "mites",
    "description": "Microscopic pests that cause stippling on leaves and can cover plants in fine webbing, thriving in dry conditions.",
    "solution": "Spray wettable sulphur or proper miticides like Spiromesifen. Maintain field humidity to naturally deter mite populations."
  },
  {
    "name": "mole cricket",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "odontothrips loti",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "oides decempunctata",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "paddy stem maggot",
    "description": "These insects lay eggs in or on plants, and their larvae (maggots) feed on the internal tissues, rotting fruits and stems.",
    "solution": "Use fruit fly traps with methyl eugenol. Apply Spinosad for organic control of maggots in affected crops."
  },
  {
    "name": "parathrene regalis",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "peach borer",
    "description": "Borer insects tunnel into plant stems and stalks, severely weakening the crop and reducing yield.",
    "solution": "Use pheromone traps for adult monitoring. Apply Bacillus thuringiensis (Bt) or systemic insecticides like Cartap hydrochloride."
  },
  {
    "name": "penthaleus major",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "red spider",
    "description": "Microscopic pests that cause stippling on leaves and can cover plants in fine webbing, thriving in dry conditions.",
    "solution": "Spray wettable sulphur or proper miticides like Spiromesifen. Maintain field humidity to naturally deter mite populations."
  },
  {
    "name": "rice gall midge",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "rice leaf caterpillar",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "rice leaf roller",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "rice leafhopper",
    "description": "Plant hoppers extract sap and often act as vectors for various plant viruses, especially in rice crops.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "rice shell pest",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "rice water weevil",
    "description": "These pests feed on leaves, flowers, and sometimes roots, causing widespread structural damage to the plant.",
    "solution": "Handpick in small farms. Apply entomopathogenic nematodes in soil for grubs, or use Chlorpyrifos for adult control."
  },
  {
    "name": "sawfly",
    "description": "These insects lay eggs in or on plants, and their larvae (maggots) feed on the internal tissues, rotting fruits and stems.",
    "solution": "Use fruit fly traps with methyl eugenol. Apply Spinosad for organic control of maggots in affected crops."
  },
  {
    "name": "sericaorient alismots chulsky",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "small brown plant hopper",
    "description": "Plant hoppers extract sap and often act as vectors for various plant viruses, especially in rice crops.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "stem borer",
    "description": "Borer insects tunnel into plant stems and stalks, severely weakening the crop and reducing yield.",
    "solution": "Use pheromone traps for adult monitoring. Apply Bacillus thuringiensis (Bt) or systemic insecticides like Cartap hydrochloride."
  },
  {
    "name": "tarnished plant bug",
    "description": "Sap-sucking insects that stunt plant growth and transmit viral diseases across fields.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "therioaphis maculata Buckton",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "wheat blossom midge",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "wheat phloeothrips",
    "description": "A common agricultural pest affecting various crops in India, requiring proper pest management strategies.",
    "solution": "Implement Integrated Pest Management (IPM). Use Neem-based bio-pesticides or consult local KVK for crop-specific chemical control."
  },
  {
    "name": "wheat sawfly",
    "description": "These insects lay eggs in or on plants, and their larvae (maggots) feed on the internal tissues, rotting fruits and stems.",
    "solution": "Use fruit fly traps with methyl eugenol. Apply Spinosad for organic control of maggots in affected crops."
  },
  {
    "name": "white backed plant hopper",
    "description": "Plant hoppers extract sap and often act as vectors for various plant viruses, especially in rice crops.",
    "solution": "Spray Neem oil (10000 ppm) at 2-3ml/L. For severe infestations, use Imidacloprid or Thiamethoxam as per CIBRC guidelines."
  },
  {
    "name": "white margined moth",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "whitefly",
    "description": "These insects lay eggs in or on plants, and their larvae (maggots) feed on the internal tissues, rotting fruits and stems.",
    "solution": "Use fruit fly traps with methyl eugenol. Apply Spinosad for organic control of maggots in affected crops."
  },
  {
    "name": "wireworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "yellow cutworm",
    "description": "Larval stages of these pests voraciously consume foliage, causing rapid defoliation of crops.",
    "solution": "Install light traps. Use bio-pesticides like Spodoptera litura NPV, or spray Emamectin benzoate for effective control."
  },
  {
    "name": "yellow rice borer",
    "description": "Borer insects tunnel into plant stems and stalks, severely weakening the crop and reducing yield.",
    "solution": "Use pheromone traps for adult monitoring. Apply Bacillus thuringiensis (Bt) or systemic insecticides like Cartap hydrochloride."
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
