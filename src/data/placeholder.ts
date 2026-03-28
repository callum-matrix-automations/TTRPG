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

// ── NPC Tier System ──
// Tiers only promote upward: Background → Passive → Active → Companion
// Stats are generated by AI on promotion and never downgraded.

export type NpcTier = "companion" | "active" | "passive" | "background";

// Base fields shared by all tiers
interface NpcBase {
  id: string;
  name: string;
  tier: NpcTier;
  faction: string;
  factionRank: string;
  factionColor: string;
  portrait: string | null;
  status: "alive" | "dead" | "missing" | "unknown";
}

// Background — set dressing, no stats, can promote to Passive
export interface BackgroundNpc extends NpcBase {
  tier: "background";
  description: string;
}

// Passive — social detail + basic stats for AI to reference if promoted
export interface PassiveNpc extends NpcBase {
  tier: "passive";
  disposition: number;
  dispositionLabel: string;
  traits: string[];
  appearance: Record<string, string>;
  // Basic stats — enough for AI to generate full sheet on promotion
  race: string;
  level: number;
  hp: { current: number; max: number };
  xp: number;
}

// Active — full stats generated by AI, mechanically participates
export interface ActiveNpc extends NpcBase {
  tier: "active";
  disposition: number;
  dispositionLabel: string;
  traits: string[];
  appearance: Record<string, string>;
  race: string;
  class: string;
  level: number;
  hp: { current: number; max: number };
  xp: number;
  stats: Record<string, { score: number; mod: number }>;
  skills: { name: string; ability: string; proficient: boolean; mod: number }[];
  abilities: { name: string; description: string }[];
  statusEffects: { name: string; type: "buff" | "debuff"; description: string }[];
  // What the player observes (not raw numbers)
  observedCapabilities: string[];
  threatImpression: string;
  visibleStatus: string[];
}

// Companion — full stats, player manages, left sidebar Party tab
export interface CompanionNpc extends NpcBase {
  tier: "companion";
  disposition: number;
  dispositionLabel: string;
  traits: string[];
  appearance: Record<string, string>;
  race: string;
  class: string;
  level: number;
  hp: { current: number; max: number };
  xp: number;
  stats: Record<string, { score: number; mod: number }>;
  skills: { name: string; ability: string; proficient: boolean; mod: number }[];
  abilities: { name: string; description: string }[];
  statusEffects: { name: string; type: "buff" | "debuff"; description: string }[];
  gear: { slot: string; item: string }[];
  loyalty: number;
  joinedAt: string;
}

export type SceneNpc = BackgroundNpc | PassiveNpc | ActiveNpc | CompanionNpc;

// ── Companions (Left sidebar — Party tab) ──

export const companions: CompanionNpc[] = [
  {
    id: "npc-003",
    name: "Lira Vex",
    tier: "companion",
    faction: "The Veil Walkers",
    factionRank: "Initiate",
    factionColor: "#a78bfa",
    portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    status: "alive",
    disposition: 72,
    dispositionLabel: "Loyal",
    traits: ["Resourceful", "Curious", "Reckless"],
    appearance: {
      face: "Sharp elven features, bright green eyes",
      hair: "Dark violet, cut short and uneven",
      body: "Wiry and quick, moves like a cat",
      notable: "Arcane tattoos visible on forearms",
    },
    race: "Wood Elf",
    class: "Wizard",
    level: 4,
    hp: { current: 22, max: 26 },
    xp: 3800,
    stats: {
      STR: { score: 8, mod: -1 },
      DEX: { score: 14, mod: 2 },
      CON: { score: 12, mod: 1 },
      INT: { score: 18, mod: 4 },
      WIS: { score: 10, mod: 0 },
      CHA: { score: 13, mod: 1 },
    },
    skills: [
      { name: "Arcana", ability: "INT", proficient: true, mod: 6 },
      { name: "Investigation", ability: "INT", proficient: true, mod: 6 },
      { name: "History", ability: "INT", proficient: true, mod: 6 },
      { name: "Perception", ability: "WIS", proficient: false, mod: 0 },
    ],
    abilities: [
      { name: "Arcane Recovery", description: "Recover spell slots on a short rest (once per day)." },
      { name: "Shield", description: "Reaction: +5 AC until start of next turn." },
    ],
    statusEffects: [
      { name: "Mage Armor", type: "buff" as const, description: "AC set to 13 + DEX modifier until next long rest." },
    ],
    gear: [
      { slot: "Main Hand", item: "Quarterstaff" },
      { slot: "Armor", item: "Mage Robes" },
      { slot: "Amulet", item: "Amulet of Arcane Focus" },
    ],
    loyalty: 72,
    joinedAt: "Day 8, The Veil Walker Sanctum",
  },
];

// ── Scene NPCs (Right sidebar — NPC tab) ──

export const sceneNpcs: SceneNpc[] = [
  // Active — full stats, mechanically participates
  {
    id: "npc-001",
    name: "Marcus Vale",
    tier: "active",
    disposition: 65,
    dispositionLabel: "Cautious Trust",
    faction: "Merchants Guild",
    factionRank: "Associate",
    factionColor: "#daa520",
    portrait: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    status: "alive",
    appearance: {
      face: "Angular features, dark stubble",
      hair: "Short brown, receding",
      body: "Lean, average height",
      notable: "Missing left ring finger",
    },
    traits: ["Cautious", "Analytical", "Pragmatic"],
    race: "Human",
    class: "Rogue",
    level: 5,
    hp: { current: 28, max: 28 },
    xp: 6500,
    stats: {
      STR: { score: 10, mod: 0 },
      DEX: { score: 14, mod: 2 },
      CON: { score: 12, mod: 1 },
      INT: { score: 16, mod: 3 },
      WIS: { score: 11, mod: 0 },
      CHA: { score: 8, mod: -1 },
    },
    skills: [
      { name: "Investigation", ability: "INT", proficient: true, mod: 6 },
      { name: "Deception", ability: "CHA", proficient: true, mod: 2 },
      { name: "Stealth", ability: "DEX", proficient: true, mod: 5 },
      { name: "Insight", ability: "WIS", proficient: false, mod: 0 },
    ],
    abilities: [
      { name: "Sneak Attack", description: "3d6 extra damage when advantage or ally adjacent." },
    ],
    statusEffects: [],
    observedCapabilities: ["Quick hands", "Sharp eye for detail", "Knows the underground"],
    threatImpression: "Could be dangerous in the right circumstances",
    visibleStatus: ["Alert", "On edge"],
  },
  // Passive — social NPC with basic stats
  {
    id: "npc-005",
    name: "Veyra Sindal",
    tier: "passive",
    disposition: 40,
    dispositionLabel: "Warm",
    faction: "Temple of Dawn",
    factionRank: "Acolyte",
    factionColor: "#22c55e",
    portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    status: "alive",
    appearance: {
      face: "Soft features, warm brown eyes, faint freckles",
      hair: "Auburn, long, loosely braided",
      body: "Average build, carries herself with quiet confidence",
      notable: "A silver holy symbol around her neck, faintly glowing",
    },
    traits: ["Gentle", "Observant", "Secretive"],
    race: "Human",
    level: 4,
    hp: { current: 24, max: 24 },
    xp: 3200,
  },
  // Passive — another social NPC
  {
    id: "npc-004",
    name: "Captain Holt",
    tier: "passive",
    disposition: 20,
    dispositionLabel: "Neutral",
    faction: "City Watch",
    factionRank: "Captain",
    factionColor: "#60a5fa",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    status: "alive",
    appearance: {
      face: "Square jaw, clean-shaven, stern expression",
      hair: "Grey, cropped short",
      body: "Broad-shouldered, imposing",
      notable: "A deep scar running across his left temple",
    },
    traits: ["By-the-book", "Stern", "Fair"],
    race: "Human",
    level: 7,
    hp: { current: 52, max: 52 },
    xp: 23000,
  },
  // Background — set dressing
  {
    id: "npc-bg-001",
    name: "The Bartender",
    tier: "background",
    faction: "Unaffiliated",
    factionRank: "",
    factionColor: "#8a6a8a",
    portrait: null,
    status: "alive",
    description: "A heavyset man with a thick moustache, polishing the same glass he's been polishing for the last hour.",
  },
  {
    id: "npc-bg-002",
    name: "Hooded Figure",
    tier: "background",
    faction: "Unknown",
    factionRank: "",
    factionColor: "#8a6a8a",
    portrait: null,
    status: "alive",
    description: "Sits alone in the far corner, nursing a drink. Face hidden. Hasn't moved in an hour.",
  },
];

export type Quest = {
  id: string;
  title: string;
  status: "active" | "completed" | "failed";
  description: string;
  lore: string;
  questGiver: string;
  location: string;
  objectives: { text: string; completed: boolean }[];
  rewards: { xp: number; gold: number; items: string[]; reputation: { faction: string; change: number }[] };
  notes: string[];
};

export const questLog: Quest[] = [
  {
    id: "quest-001",
    title: "The Stolen Artifact",
    status: "active",
    description: "Marcus Vale has asked you to recover a stolen artifact from the underground market in the Old Quarter.",
    lore: "The Orb of Shadows is an ancient relic tied to the Veil Walkers. It was stolen from a private collection three weeks ago and has since surfaced on the black market. Marcus believes a fence known as 'The Crow' is brokering the sale. The Syndicate has eyes on every entrance to the underground market — but Marcus knows a way in through the catacombs.",
    questGiver: "Marcus Vale",
    location: "Old Quarter — Underground Market",
    objectives: [
      { text: "Find the entrance to the underground market", completed: true },
      { text: "Locate the artifact dealer known as 'The Crow'", completed: false },
      { text: "Recover the Orb of Shadows", completed: false },
    ],
    rewards: { xp: 500, gold: 200, items: ["Ring of Whispers"], reputation: [{ faction: "Merchants Guild", change: 15 }, { faction: "The Syndicate", change: -10 }] },
    notes: ["Marcus gave you a map to the catacombs entrance", "The Crow's identity is unknown — ask around carefully", "The Syndicate is watching the market entrances"],
  },
  {
    id: "quest-002",
    title: "Whispers in the Dark",
    status: "active",
    description: "Strange whispers have been reported in the warehouse district at night. Investigate the source.",
    lore: "Dock workers have been refusing to work the late shift near Warehouse 14. They claim to hear voices speaking in a language they can't understand, always after midnight. Captain Holt mentioned it in passing — he doesn't believe in ghosts but can't afford to lose more workers.",
    questGiver: "Captain Holt",
    location: "Warehouse District — Warehouse 14",
    objectives: [
      { text: "Visit the warehouse district after midnight", completed: false },
      { text: "Investigate the source of the whispers", completed: false },
    ],
    rewards: { xp: 300, gold: 100, items: [], reputation: [{ faction: "City Watch", change: 10 }] },
    notes: ["The whispers only occur after midnight", "Workers describe the language as 'old and wrong'"],
  },
  {
    id: "quest-003",
    title: "A Merchant's Debt",
    status: "completed",
    description: "Help Marcus settle his debt with the Syndicate.",
    lore: "Marcus owed the Syndicate 5000 gold from a deal gone wrong. He managed to scrape together 3000 but needed help negotiating the remainder. You brokered a deal — the Syndicate accepted the 3000 plus a future favor. Marcus is relieved but knows the favor will come due eventually.",
    questGiver: "Marcus Vale",
    location: "Trade District — Syndicate Office",
    objectives: [
      { text: "Negotiate with Syndicate representative", completed: true },
      { text: "Deliver payment of 3000 gold", completed: true },
    ],
    rewards: { xp: 400, gold: 150, items: ["Thieves' Cant Phrasebook"], reputation: [{ faction: "Merchants Guild", change: 10 }, { faction: "The Syndicate", change: 5 }] },
    notes: ["The Syndicate will call in a favor — be ready", "Marcus is grateful but still cautious"],
  },
];

export type Faction = {
  name: string;
  reputation: number;
  tier: string;
  color: string;
  description: string;
  territory: string;
  leader: string;
  goals: string[];
  knownMembers: string[];
  playerHistory: string[];
  relationships: { faction: string; stance: string }[];
};

export const factions: Faction[] = [
  {
    name: "Merchants Guild",
    reputation: 45,
    tier: "Friendly",
    color: "#daa520",
    description: "The Merchants Guild controls the legal flow of goods through the Trade District and beyond. Wealthy, well-connected, and quietly ruthless when their interests are threatened.",
    territory: "Trade District, Market Square",
    leader: "Guildmaster Aldric Thorne (unseen)",
    goals: ["Maintain monopoly on trade routes", "Eliminate Syndicate influence in the markets", "Secure the Orb of Shadows for private collection"],
    knownMembers: ["Marcus Vale (Associate)", "Aldric Thorne (Guildmaster)"],
    playerHistory: ["Helped Marcus Vale settle a debt", "Currently recovering an artifact for the Guild"],
    relationships: [{ faction: "The Syndicate", stance: "Hostile" }, { faction: "City Watch", stance: "Allied" }, { faction: "Temple of Dawn", stance: "Neutral" }],
  },
  {
    name: "The Syndicate",
    reputation: -15,
    tier: "Unfriendly",
    color: "#ef4444",
    description: "A criminal network operating from the shadows. They deal in stolen goods, protection rackets, and information. Nobody knows who leads them — only that crossing them is a mistake.",
    territory: "Old Quarter, Warehouse District (underground)",
    leader: "Unknown",
    goals: ["Expand control over the underground market", "Collect on Marcus Vale's remaining debt", "Acquire the Orb of Shadows"],
    knownMembers: ["The Crow (Fence)", "??? (Enforcer)"],
    playerHistory: ["Negotiated Marcus's debt — they accepted 3000gp + a future favor", "The favor has not yet been called in"],
    relationships: [{ faction: "Merchants Guild", stance: "Hostile" }, { faction: "City Watch", stance: "Hostile" }, { faction: "The Veil Walkers", stance: "Neutral" }],
  },
  {
    name: "City Watch",
    reputation: 20,
    tier: "Neutral",
    color: "#60a5fa",
    description: "The official law enforcement of the city. Underfunded and overstretched, but Captain Holt runs a disciplined operation in the Trade District. They tolerate adventurers as long as the peace is kept.",
    territory: "All districts (headquarters in Civic Quarter)",
    leader: "Captain Holt (Trade District)",
    goals: ["Maintain public order", "Investigate the warehouse whispers", "Root out Syndicate operations"],
    knownMembers: ["Captain Holt (Captain)"],
    playerHistory: ["Captain Holt mentioned the warehouse whispers in passing", "No major interactions — reputation is neutral"],
    relationships: [{ faction: "Merchants Guild", stance: "Allied" }, { faction: "The Syndicate", stance: "Hostile" }, { faction: "Temple of Dawn", stance: "Friendly" }],
  },
  {
    name: "The Veil Walkers",
    reputation: 60,
    tier: "Allied",
    color: "#a78bfa",
    description: "A secretive order of arcanists who study the boundary between the material world and the planes beyond. They keep to themselves but have taken an interest in the rune on your hand.",
    territory: "The Veil Walker Sanctum (hidden location)",
    leader: "Archon Sythara",
    goals: ["Study planar anomalies in the city", "Protect arcane artifacts from misuse", "Understand the origin of your rune"],
    knownMembers: ["Lira Vex (Initiate — your companion)", "Archon Sythara (leader, unmet)"],
    playerHistory: ["Lira Vex identified the rune on your hand", "Lira joined your party on Day 8", "The Sanctum granted you limited access"],
    relationships: [{ faction: "Temple of Dawn", stance: "Cautious" }, { faction: "The Syndicate", stance: "Neutral" }, { faction: "Merchants Guild", stance: "Neutral" }],
  },
  {
    name: "Temple of Dawn",
    reputation: 5,
    tier: "Neutral",
    color: "#22c55e",
    description: "The city's primary religious institution, dedicated to healing and protection. They run free clinics and shelters. Veyra Sindal is an acolyte there — kind on the surface, but the Temple guards its secrets closely.",
    territory: "Temple Quarter",
    leader: "High Priestess Morwen",
    goals: ["Provide healing to the city's people", "Investigate dark magical disturbances", "Protect sacred relics"],
    knownMembers: ["Veyra Sindal (Acolyte)", "High Priestess Morwen (unmet)"],
    playerHistory: ["Veyra treated your injuries after the dock ambush", "You suspect she knows more than she lets on"],
    relationships: [{ faction: "City Watch", stance: "Friendly" }, { faction: "The Veil Walkers", stance: "Cautious" }, { faction: "The Syndicate", stance: "Hostile" }],
  },
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
