// ═══════════════════════════════════════════════════
// PLACEHOLDER DATA — Phase 1
// All data loaded from here. Will migrate to JSON files in Phase 2.
// ═══════════════════════════════════════════════════

export const playerCharacter = {
  name: "Aelindra Voss",
  class: "Rogue",
  level: 5,
  race: "Half-Elf",
  xp: { current: 6500, next: 14000 },
  hp: { current: 33, max: 38 },
  ac: 15,
  initiative: 3,
  speed: 30,
  proficiencyBonus: 3,
  stats: {
    STR: { score: 10, mod: 0 },
    DEX: { score: 18, mod: 4 },
    CON: { score: 12, mod: 1 },
    INT: { score: 14, mod: 2 },
    WIS: { score: 13, mod: 1 },
    CHA: { score: 16, mod: 3 },
  },
  skills: [
    { name: "Acrobatics", ability: "DEX", proficient: true, expertise: false, mod: 7 },
    { name: "Deception", ability: "CHA", proficient: true, expertise: true, mod: 9 },
    { name: "Insight", ability: "WIS", proficient: false, expertise: false, mod: 1 },
    { name: "Investigation", ability: "INT", proficient: true, expertise: false, mod: 5 },
    { name: "Perception", ability: "WIS", proficient: true, expertise: false, mod: 4 },
    { name: "Persuasion", ability: "CHA", proficient: true, expertise: false, mod: 6 },
    { name: "Sleight of Hand", ability: "DEX", proficient: true, expertise: true, mod: 10 },
    { name: "Stealth", ability: "DEX", proficient: true, expertise: true, mod: 10 },
  ],
  appearance: {
    face: "Sharp features, violet eyes, faint scar across left cheekbone",
    hair: "Silver-white, shoulder length, usually braided",
    body: "Lithe and athletic, pale skin",
    notable: "A glowing violet rune on the back of her right hand",
  },
  savingThrows: {
    DEX: { proficient: true, mod: 7 },
    INT: { proficient: true, mod: 5 },
  },
};

export const inventory = [
  { id: "inv-001", name: "Rapier +1", type: "weapon", equipped: true, quantity: 1, rarity: "uncommon", description: "A finely crafted blade with a faint magical shimmer" },
  { id: "inv-002", name: "Leather Armor", type: "armor", equipped: true, quantity: 1, rarity: "common", description: "Supple dark leather, well-maintained" },
  { id: "inv-003", name: "Thieves' Tools", type: "tool", equipped: false, quantity: 1, rarity: "common", description: "A set of lockpicks and probes" },
  { id: "inv-004", name: "Healing Potion", type: "consumable", equipped: false, quantity: 3, rarity: "common", description: "Restores 2d4+2 HP" },
  { id: "inv-005", name: "Cloak of Elvenkind", type: "wondrous", equipped: true, quantity: 1, rarity: "uncommon", description: "Advantage on Stealth checks" },
  { id: "inv-006", name: "Rations", type: "consumable", equipped: false, quantity: 8, rarity: "common", description: "One day's worth of food" },
  { id: "inv-007", name: "Rope (50 ft)", type: "gear", equipped: false, quantity: 1, rarity: "common", description: "Hempen rope" },
  { id: "inv-008", name: "Amulet of the Veil", type: "wondrous", equipped: true, quantity: 1, rarity: "rare", description: "Once per day, become invisible for 1 minute" },
];

export const gear = [
  { slot: "Main Hand", item: "Rapier +1", icon: "Sword" },
  { slot: "Off Hand", item: "—", icon: "Shield" },
  { slot: "Armor", item: "Leather Armor", icon: "Shirt" },
  { slot: "Cloak", item: "Cloak of Elvenkind", icon: "Scroll" },
  { slot: "Amulet", item: "Amulet of the Veil", icon: "Gem" },
  { slot: "Ring 1", item: "—", icon: "CircleDot" },
  { slot: "Ring 2", item: "—", icon: "CircleDot" },
  { slot: "Boots", item: "—", icon: "Footprints" },
];

export const currentNpc = {
  id: "npc-001",
  name: "Marcus Vale",
  disposition: 65,
  dispositionLabel: "Cautious Trust",
  faction: "Merchants Guild",
  factionRank: "Associate",
  appearance: {
    face: "Angular features, dark stubble",
    hair: "Short brown, receding",
    body: "Lean, average height",
    notable: "Missing left ring finger",
  },
  traits: ["Cautious", "Analytical", "Pragmatic"],
  status: "alive",
};

export const questLog = [
  {
    id: "quest-001",
    title: "The Stolen Artifact",
    status: "active",
    description: "Marcus Vale has asked you to recover a stolen artifact from the underground market in the Old Quarter.",
    objectives: [
      { text: "Find the entrance to the underground market", completed: true },
      { text: "Locate the artifact dealer known as 'The Crow'", completed: false },
      { text: "Recover the Orb of Shadows", completed: false },
    ],
    rewards: { xp: 500, gold: 200, items: ["Ring of Whispers"] },
  },
  {
    id: "quest-002",
    title: "Whispers in the Dark",
    status: "active",
    description: "Strange whispers have been reported in the warehouse district at night. Investigate the source.",
    objectives: [
      { text: "Visit the warehouse district after midnight", completed: false },
      { text: "Investigate the source of the whispers", completed: false },
    ],
    rewards: { xp: 300, gold: 100, items: [] },
  },
  {
    id: "quest-003",
    title: "A Merchant's Debt",
    status: "completed",
    description: "Help Marcus settle his debt with the Syndicate.",
    objectives: [
      { text: "Negotiate with Syndicate representative", completed: true },
      { text: "Deliver payment of 3000 gold", completed: true },
    ],
    rewards: { xp: 400, gold: 150, items: ["Thieves' Cant Phrasebook"] },
  },
];

export const factions = [
  { name: "Merchants Guild", reputation: 45, tier: "Friendly", color: "#daa520" },
  { name: "The Syndicate", reputation: -15, tier: "Unfriendly", color: "#ef4444" },
  { name: "City Watch", reputation: 20, tier: "Neutral", color: "#60a5fa" },
  { name: "The Veil Walkers", reputation: 60, tier: "Allied", color: "#a78bfa" },
  { name: "Temple of Dawn", reputation: 5, tier: "Neutral", color: "#22c55e" },
];

export const worldState = {
  time: "22:47",
  date: "Day 14, Autumn",
  location: "The Gilded Rat Tavern — Trade District",
  weather: "Overcast, light fog",
};

export const resources = {
  gold: 847,
  silver: 23,
  copper: 156,
};

export const clocks = [
  { name: "Syndicate Retaliation", segments: 6, filled: 2, visible: true },
  { name: "Festival of Masks", segments: 4, filled: 3, visible: true },
];

export const narrativeHistory = [
  {
    type: "narration" as const,
    text: "The Gilded Rat is quieter than usual tonight. Rain drums against the leaded windows, and the hearth casts long shadows across the worn floorboards. A handful of patrons nurse their drinks in the corners — dock workers, mostly, their faces weathered and closed.",
  },
  {
    type: "npc" as const,
    speaker: "Marcus Vale",
    text: "\"You're late.\" Marcus doesn't look up from the coin he's turning between his fingers. His voice is flat, measured — the voice of a man who's learned not to waste words. \"I've got something. But it'll cost you more than gold this time.\"",
  },
  {
    type: "player" as const,
    text: "I slide into the seat across from him, keeping my hands visible on the table. \"Everything costs something, Marcus. What do you need?\"",
  },
  {
    type: "npc" as const,
    speaker: "Marcus Vale",
    text: "He finally looks up. His eyes are harder than usual — something's rattled him. \"The Crow has the Orb. Underground market, Old Quarter. But the Syndicate's watching every entrance.\" He slides a folded paper across the table. \"There's a way in through the catacombs. Unmarked. I need you to go tonight.\"",
  },
  {
    type: "system" as const,
    text: "[Insight Check — DC 14] You notice Marcus's hand trembling slightly. He's more frightened than he's letting on.",
  },
];

export const diceResult = {
  type: "Insight",
  roll: 16,
  modifier: 1,
  total: 17,
  dc: 14,
  outcome: "success" as const,
  natural: false,
};

export const relationships = [
  { id: "player", name: "You", x: 50, y: 50 },
  { id: "npc-001", name: "Marcus", x: 25, y: 30, relationToPlayer: "cautious trust" },
  { id: "npc-002", name: "The Crow", x: 75, y: 25, relationToPlayer: "unknown" },
  { id: "npc-003", name: "Lira Vex", x: 30, y: 75, relationToPlayer: "friendly" },
  { id: "npc-004", name: "Captain Holt", x: 70, y: 70, relationToPlayer: "neutral" },
];
