/**
 * Shared Pest Icon Utility
 * Maps 132 Indian pest species (Pestopia dataset) to emoji icons
 * using keyword-based category matching.
 */

const CATEGORY_ICONS = [
  { keywords: ['beetle', 'weevil', 'chafer', 'Chrysomphalus', 'Deporaus', 'Potosiabre', 'Rhytidodera', 'Xylotrechus', 'Sternochetus', 'oides decempunctata', 'flea beetle', 'blister beetle', 'legume blister beetle', 'leaf beetle', 'lytta polita'], icon: '🪲' },
  { keywords: ['moth', 'Limacodidae', 'meadow moth', 'white margined moth', 'Ampelophaga', 'Prodenia', 'Spilosoma', 'fruit piercing moth', 'parathrene'], icon: '🦋' },
  { keywords: ['butterfly', 'Papilio', 'Pieris'], icon: '🦋' },
  { keywords: ['fly', 'maggot', 'Bactrocera', 'Dacus', 'Beet spot flies', 'cerodonta', 'gall fly', 'Rice Stemfly', 'paddy stem maggot', 'wheat blossom midge', 'rice gall midge', 'Gall fly', 'Dasineura'], icon: '🪰' },
  { keywords: ['aphid', 'Aphis', 'Toxoptera', 'bird cherry-oat', 'english grain aphid', 'Jute aphid', 'green bug', 'alfalfa plant bug', 'tarnished plant bug', 'Apolygus', 'Miridae'], icon: '🐛' },
  { keywords: ['mite', 'spider', 'Colomerus', 'Phyllocoptes', 'Panonchus', 'Brevipoalpus', 'longlegged spider mite', 'penthaleus', 'red spider', 'Yellow Mite', 'Jute red mite'], icon: '🕷️' },
  { keywords: ['cricket', 'grasshopper', 'locust', 'Locustoidea', 'mole cricket', 'Field Cricket'], icon: '🦗' },
  { keywords: ['caterpillar', 'worm', 'borer', 'roller', 'looper', 'Indigo caterpillar', 'army worm', 'cutworm', 'corn borer', 'stem borer', 'rice leaf caterpillar', 'rice leaf roller', 'bollworm', 'corn earworm', 'fall armyworm', 'cabbage army worm', 'flax budworm', 'Pod borer', 'asiatic rice borer', 'grub', 'Jute semilooper', 'Jute hairy', 'Black hairy', 'Chlumetia', 'Phyllocnistis', 'Adristyrannus', 'rice shell pest'], icon: '🐛' },
  { keywords: ['hopper', 'leafhopper', 'Cicadella', 'Cicadellidae', 'Erythroneura', 'brown plant hopper', 'small brown plant hopper', 'white backed plant hopper', 'rice leafhopper', 'Mango flat beak leafhopper', 'Lawana', 'Lycorma', 'Salurnis'], icon: '🦟' },
  { keywords: ['thrips', 'Thrips', 'Scirtothrips', 'odontothrips', 'grain spreader thrips', 'wheat phloeothrips'], icon: '🦟' },
  { keywords: ['whitefly', 'Trialeurodes', 'Aleurocanthus', 'white fly'], icon: '🪰' },
  { keywords: ['scale', 'Ceroplastes', 'Icerya', 'Unaspis', 'Parlatoria', 'Mealybug', 'Nipaecoccus', 'Pseudococcus', 'Polyphagotars'], icon: '🐚' },
  { keywords: ['snail', 'slug'], icon: '🐌' },
  { keywords: ['termite', 'Termite'], icon: '🐜' },
  { keywords: ['sawfly', 'Jute stick insect'], icon: '🐝' },
  { keywords: ['Viteus', 'Tetradacus'], icon: '🐛' },
  { keywords: ['wireworm'], icon: '🪱' },
  { keywords: ['rice water weevil'], icon: '🪲' },
]

/**
 * Get an emoji icon for a pest name using keyword matching.
 * @param {string} name - The pest species name
 * @returns {string} An emoji icon
 */
export function getPestIcon(name) {
  if (!name) return '🐛'
  const lower = name.toLowerCase()
  for (const category of CATEGORY_ICONS) {
    for (const keyword of category.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return category.icon
      }
    }
  }
  return '🐛' // Default fallback
}

export default getPestIcon
