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
    STR: { score: 10, mod: 0, base: 10, modifiers: [{ source: "Base", value: 10 }] },
    DEX: { score: 18, mod: 4, base: 15, modifiers: [{ source: "Base", value: 15 }, { source: "Half-Elf Racial", value: 1 }, { source: "ASI (Level 4)", value: 2 }] },
    CON: { score: 12, mod: 1, base: 12, modifiers: [{ source: "Base", value: 12 }] },
    INT: { score: 14, mod: 2, base: 13, modifiers: [{ source: "Base", value: 13 }, { source: "Half-Elf Racial", value: 1 }] },
    WIS: { score: 13, mod: 1, base: 13, modifiers: [{ source: "Base", value: 13 }] },
    CHA: { score: 16, mod: 3, base: 14, modifiers: [{ source: "Base", value: 14 }, { source: "Half-Elf Racial", value: 2 }] },
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
  abilities: [
    { name: "Sneak Attack", source: "Rogue 1", description: "Deal an extra 3d6 damage to one creature you hit with an attack if you have advantage.", uses: null },
    { name: "Cunning Action", source: "Rogue 2", description: "Dash, Disengage, or Hide as a bonus action on each turn.", uses: null },
    { name: "Uncanny Dodge", source: "Rogue 5", description: "When hit by an attack, use reaction to halve the damage.", uses: null },
    { name: "Evasion", source: "Rogue 7", description: "On a successful DEX save, take no damage instead of half.", uses: null },
    { name: "Amulet of the Veil", source: "Item", description: "Become invisible for 1 minute.", uses: { current: 1, max: 1, recharge: "Long Rest" } },
  ],
  statusEffects: [
    { name: "Cloak of Elvenkind", type: "buff" as const, description: "Advantage on Stealth checks. Others have disadvantage on Perception to spot you.", duration: "Passive (while worn)", icon: "eye-off" },
    { name: "Darkvision", type: "buff" as const, description: "See in dim light within 60 feet as if it were bright light.", duration: "Passive (racial)", icon: "eye" },
  ],
};

export const inventory: {
  id: string; name: string; type: string; equipped: boolean; quantity: number; rarity: string;
  slots: string[]; description: string; image: string; effects: string[];
  attributes: Record<string, string>;
}[] = [
  {
    id: "inv-001", name: "Rapier +1", type: "weapon", equipped: true, quantity: 1, rarity: "uncommon",
    slots: ["Main Hand", "Off Hand"],
    description: "A finely crafted blade with a faint magical shimmer. The hilt is wrapped in dark leather with a silver crossguard etched with elven script.",
    image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=600&q=80",
    effects: ["+1 to attack and damage rolls", "Finesse — use DEX modifier"],
    attributes: { damage: "1d8+1 piercing", weight: "2 lb", properties: "Finesse, Light" },
  },
  {
    id: "inv-002", name: "Leather Armor", type: "armor", equipped: true, quantity: 1, rarity: "common",
    slots: ["Armor"],
    description: "Supple dark leather, well-maintained and oiled. Dyed black with subtle reinforcement at the shoulders and chest.",
    image: "https://images.unsplash.com/photo-1531746790095-e5995edb1b5b?w=600&q=80",
    effects: ["AC = 11 + DEX modifier"],
    attributes: { ac: "11 + DEX", weight: "10 lb", properties: "Light armor" },
  },
  {
    id: "inv-003", name: "Thieves' Tools", type: "tool", equipped: false, quantity: 1, rarity: "common",
    slots: [],
    description: "A small leather case containing a set of lockpicks, a small mirror on a metal handle, narrow-bladed scissors, and a pair of pliers.",
    image: "https://images.unsplash.com/photo-1567361672830-b1b4e8261598?w=600&q=80",
    effects: ["Required for picking locks", "Add proficiency bonus to checks"],
    attributes: { weight: "1 lb", proficiency: "Yes" },
  },
  {
    id: "inv-004", name: "Healing Potion", type: "consumable", equipped: false, quantity: 3, rarity: "common",
    slots: [],
    description: "A small vial of shimmering red liquid that glimmers when agitated. It smells faintly of herbs and berries.",
    image: "https://images.unsplash.com/photo-1587854680352-936b22b91030?w=600&q=80",
    effects: ["Restores 2d4+2 HP", "Consumed on use"],
    attributes: { healing: "2d4+2", action: "Bonus action to drink", weight: "0.5 lb" },
  },
  {
    id: "inv-005", name: "Cloak of Elvenkind", type: "wondrous", equipped: true, quantity: 1, rarity: "uncommon",
    slots: ["Cloak"],
    description: "A flowing cloak of deep forest green that seems to shift and blend with its surroundings. The fabric is impossibly light and warm.",
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&q=80",
    effects: ["Advantage on Stealth checks", "Disadvantage on Perception checks to spot you"],
    attributes: { weight: "1 lb", attunement: "Yes" },
  },
  {
    id: "inv-006", name: "Rations", type: "consumable", equipped: false, quantity: 8, rarity: "common",
    slots: [],
    description: "Dried meat, hardtack biscuits, and a handful of nuts wrapped in oiled cloth. Enough sustenance for one day.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    effects: ["Sustains one person for one day"],
    attributes: { weight: "2 lb each", duration: "1 day" },
  },
  {
    id: "inv-007", name: "Rope (50 ft)", type: "gear", equipped: false, quantity: 1, rarity: "common",
    slots: [],
    description: "Fifty feet of sturdy hempen rope, coiled and tied. Useful for climbing, binding, and countless other purposes.",
    image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?w=600&q=80",
    effects: ["Can be used to restrain, climb, or secure objects", "HP: 2, AC: 10, Break DC: 17"],
    attributes: { length: "50 ft", weight: "10 lb", "break DC": "17" },
  },
  {
    id: "inv-008", name: "Amulet of the Veil", type: "wondrous", equipped: true, quantity: 1, rarity: "rare",
    slots: ["Amulet"],
    description: "A dark obsidian amulet on a silver chain. A faint violet glow pulses within its depths, like a heartbeat. When activated, reality seems to bend around the wearer.",
    image: "https://images.unsplash.com/photo-1515562141589-67f0d934d1b0?w=600&q=80",
    effects: ["Once per day, become invisible for 1 minute", "Invisibility breaks on attack or spell cast"],
    attributes: { charges: "1/day", duration: "1 minute", attunement: "Yes" },
  },
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
  time: "Late Evening",
  date: "14th of October, 1247",
  location: "The Gilded Rat Tavern — Trade District",
  weather: "Overcast, light fog",
};

export const resources = {
  gold: 847,
  silver: 23,
  copper: 156,
};

export const clocks = [
  { name: "Syndicate Retaliation", segments: 6, filled: 2, visible: true, type: "threat" as const, description: "The Syndicate grows more hostile. When full, they strike." },
  { name: "Festival of Masks", segments: 4, filled: 3, visible: true, type: "event" as const, description: "The annual Festival of Masks approaches. New opportunities await." },
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

// ── Relationship Graph ──

export type RelationshipNode = {
  id: string;
  name: string;
  faction: string;
  factionColor: string;
  disposition: number; // -100 to 100 (toward player)
  status: "alive" | "dead" | "missing" | "unknown";
  portrait: string | null;
  known: boolean; // has the player met them?
  description: string;
};

export type RelationshipLink = {
  source: string;
  target: string;
  type: string;
  strength: number; // 0-1, affects spring distance
  known: boolean; // does the player know about this link?
};

export const relationshipNodes: RelationshipNode[] = [
  {
    id: "player",
    name: "Aelindra Voss",
    faction: "Unaffiliated",
    factionColor: "#ffb4dc",
    disposition: 0,
    status: "alive",
    portrait: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    known: true,
    description: "You. A Level 5 Half-Elf Rogue with a talent for trouble.",
  },
  {
    id: "npc-001",
    name: "Marcus Vale",
    faction: "Merchants Guild",
    factionColor: "#daa520",
    disposition: 65,
    status: "alive",
    portrait: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    known: true,
    description: "A cautious information broker who works the warehouse district. Owes a debt to the Syndicate.",
  },
  {
    id: "npc-002",
    name: "The Crow",
    faction: "The Syndicate",
    factionColor: "#ef4444",
    disposition: 0,
    status: "alive",
    portrait: null,
    known: false,
    description: "A mysterious fence operating out of the underground market. No one knows their real face.",
  },
  {
    id: "npc-003",
    name: "Lira Vex",
    faction: "The Veil Walkers",
    factionColor: "#a78bfa",
    disposition: 72,
    status: "alive",
    portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    known: true,
    description: "An arcane researcher with ties to the Veil Walkers. Helped you identify the rune on your hand.",
  },
  {
    id: "npc-004",
    name: "Captain Holt",
    faction: "City Watch",
    factionColor: "#60a5fa",
    disposition: 20,
    status: "alive",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    known: true,
    description: "Watch captain for the Trade District. By-the-book, but not unreasonable.",
  },
  {
    id: "npc-005",
    name: "Veyra Sindal",
    faction: "Temple of Dawn",
    factionColor: "#22c55e",
    disposition: 40,
    status: "alive",
    portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    known: true,
    description: "A healer at the Temple of Dawn. Treated your injuries after the dock ambush. Knows more than she lets on.",
  },
  {
    id: "npc-006",
    name: "???",
    faction: "The Syndicate",
    factionColor: "#ef4444",
    disposition: 0,
    status: "unknown",
    portrait: null,
    known: false,
    description: "Someone Marcus mentioned — a Syndicate enforcer. You've never met them.",
  },
];

export const relationshipLinks: RelationshipLink[] = [
  // Player connections
  { source: "player", target: "npc-001", type: "Cautious Trust", strength: 0.65, known: true },
  { source: "player", target: "npc-003", type: "Friendly", strength: 0.72, known: true },
  { source: "player", target: "npc-004", type: "Neutral", strength: 0.2, known: true },
  { source: "player", target: "npc-005", type: "Warm", strength: 0.4, known: true },

  // NPC-to-NPC connections
  { source: "npc-001", target: "npc-002", type: "Rival", strength: 0.8, known: true },
  { source: "npc-001", target: "npc-006", type: "Debtor", strength: 0.9, known: true },
  { source: "npc-002", target: "npc-006", type: "Associates", strength: 0.7, known: false },
  { source: "npc-003", target: "npc-005", type: "Old Friends", strength: 0.5, known: true },
  { source: "npc-004", target: "npc-001", type: "Suspicious Of", strength: 0.3, known: true },
  { source: "npc-004", target: "npc-006", type: "Investigating", strength: 0.6, known: false },
];
