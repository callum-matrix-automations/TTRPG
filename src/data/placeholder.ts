// ═══════════════════════════════════════════════════
// PLACEHOLDER DATA — Modern Setting
// Casino Royale active dungeon scenario
// All data loaded from here. Will migrate to JSON files in Phase 2.
// ═══════════════════════════════════════════════════

// ── Player Character ──

export const playerCharacter = {
  name: "Cal",
  class: "Civilian",
  level: 1,
  race: "Human",
  xp: { current: 0, next: 300 },
  hp: { current: 20, max: 20 },
  energy: { current: 85, max: 100 },
  proficiencyBonus: 2,
  stats: {
    STR: { score: 12, mod: 1, base: 12, modifiers: [{ source: "Base", value: 12 }] },
    DEX: { score: 14, mod: 2, base: 14, modifiers: [{ source: "Base", value: 14 }] },
    CON: { score: 13, mod: 1, base: 13, modifiers: [{ source: "Base", value: 13 }] },
    INT: { score: 16, mod: 3, base: 16, modifiers: [{ source: "Base", value: 16 }] },
    WIS: { score: 14, mod: 2, base: 14, modifiers: [{ source: "Base", value: 14 }] },
    CHA: { score: 10, mod: 0, base: 10, modifiers: [{ source: "Base", value: 10 }] },
  },
  skills: [
    { name: "Athletics", ability: "STR", proficient: false, expertise: false, mod: 1 },
    { name: "Perception", ability: "WIS", proficient: true, expertise: false, mod: 4 },
    { name: "Investigation", ability: "INT", proficient: true, expertise: false, mod: 5 },
    { name: "Insight", ability: "WIS", proficient: true, expertise: false, mod: 4 },
    { name: "Persuasion", ability: "CHA", proficient: false, expertise: false, mod: 0 },
    { name: "Deception", ability: "CHA", proficient: false, expertise: false, mod: 0 },
    { name: "Stealth", ability: "DEX", proficient: true, expertise: false, mod: 4 },
    { name: "Streetwise", ability: "WIS", proficient: false, expertise: false, mod: 2 },
  ],
  appearance: {
    gender: "Male",
    height: "5'10\"",
    hair: "Dark brown, short and messy",
    face: "Average features, light stubble",
    eyes: "Dark brown",
    lips: "Normal",
    makeup: "None",
    skin: "Light complexion, normal",
    chest: "Flat, average male build",
    waist: "Normal",
    hips: "Narrow, male proportions",
    ass: "Normal",
    handsAndNails: "Normal, short nails",
    legs: "Average",
    feet: "Size 10, normal",
    voice: "Normal male baritone",
    posture: "Casual, slightly slouched",
    speech: "Normal conversational",
    overall: "An unremarkable young man who blends into a crowd easily",
  } as DetailedAppearance,
  savingThrows: {
    WIS: { proficient: true, mod: 4 },
    INT: { proficient: true, mod: 5 },
  },
  abilities: [
    { name: "Street Smarts", source: "Civilian", description: "Advantage on Perception checks to notice suspicious behavior.", uses: null },
    { name: "Quick Thinking", source: "Civilian", description: "Once per day, reroll a failed WIS saving throw.", uses: { current: 1, max: 1, recharge: "Long Rest" } },
  ],
  statusEffects: [] as { name: string; type: "buff" | "debuff"; description: string; duration: string; icon: string }[],
};

// ── Transformation Tracker ──

export type PhysicalChange = {
  bodyPart: string;
  before: string;
  current: string;
  changePercent: number;
  source: string;
  stage: number;
};

// Full physical appearance — all 19 tracked body parts
export type DetailedAppearance = {
  gender: string;
  height: string;
  hair: string;
  face: string;
  eyes: string;
  lips: string;
  makeup: string;
  skin: string;
  chest: string;
  waist: string;
  hips: string;
  ass: string;
  handsAndNails: string;
  legs: string;
  feet: string;
  voice: string;
  posture: string;
  speech: string;
  overall: string; // one-line summary for at-a-glance view
};

export type TransformationTracker = {
  active: boolean;
  factionId: string | null;
  factionName: string | null;
  factionColor: string | null;
  identity: number;
  willpower: number;
  conditioning: number;
  currentThreshold: number;
  thresholdName: string;
  overallProgress: number;
  physicalChanges: PhysicalChange[];
  assignedTemplate: string | null;
};

export const transformation: TransformationTracker = {
  active: true, // Player is locked into Casino Royale
  factionId: "casino-royale",
  factionName: "Casino Royale",
  factionColor: "#daa520",
  identity: 88,
  willpower: 92,
  conditioning: 8,
  currentThreshold: 0,
  thresholdName: "Guest (Resident Transition)",
  overallProgress: 4,
  physicalChanges: [
    { bodyPart: "Skin", before: "Normal complexion", current: "Slightly smoother, faintly luminous", changePercent: 8, source: "casino-royale", stage: 0 },
    { bodyPart: "Hair", before: "Dark brown, short and messy", current: "Slightly softer, subtle shine", changePercent: 5, source: "casino-royale", stage: 0 },
  ],
  assignedTemplate: null,
};

// ── Inventory ──

export const inventory: {
  id: string; name: string; type: string; equipped: boolean; quantity: number; rarity: string;
  slots: string[]; description: string; image: string; effects: string[];
  attributes: Record<string, string>;
}[] = [
  {
    id: "inv-001", name: "Smartphone", type: "gear", equipped: true, quantity: 1, rarity: "common",
    slots: [],
    description: "Your personal phone. Contacts, maps, notes. Lifeline to the outside world.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    effects: ["Access to contacts and information", "Can call for help (if signal available)"],
    attributes: { battery: "78%", signal: "Weak (Casino interference)" },
  },
  {
    id: "inv-002", name: "Wallet", type: "gear", equipped: true, quantity: 1, rarity: "common",
    slots: [],
    description: "Contains your ID, bank cards, and a few crumpled bills. The Casino prefers credits.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    effects: ["Contains identification", "Holds cash currency"],
    attributes: { cash: "$127", cards: "2 bank cards, student ID" },
  },
  {
    id: "inv-003", name: "Casino Royale Guest Pass", type: "key", equipped: true, quantity: 1, rarity: "uncommon",
    slots: [],
    description: "A sleek gold-trimmed card that grants access to Casino Royale's guest areas. It tracks your movements and spending.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    effects: ["Access to Casino Royale guest areas", "Tracks location within the complex", "Required for credit transactions"],
    attributes: { "credit balance": "350 credits", status: "Guest", "issued": "Today" },
  },
  {
    id: "inv-004", name: "Energy Drink", type: "consumable", equipped: false, quantity: 2, rarity: "common",
    slots: [],
    description: "A can of generic energy drink from a vending machine. Tastes like battery acid and regret.",
    image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&q=80",
    effects: ["Restores 15 Energy"],
    attributes: { healing: "+15 Energy", action: "Use" },
  },
  {
    id: "inv-005", name: "Complimentary Spa Voucher", type: "key", equipped: false, quantity: 1, rarity: "uncommon",
    slots: [],
    description: "A voucher for one free treatment at the Casino's wellness spa. The receptionist was very insistent you take it.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    effects: ["One free spa treatment", "Warning: Spa treatments may contain conditioning agents"],
    attributes: { "valid at": "Promenade Wellness Spa", expires: "Never" },
  },
];

// ── Gear ──

export const gear = [
  { slot: "Outerwear", item: "Hoodie", icon: "Shirt" },
  { slot: "Top", item: "T-Shirt", icon: "Shirt" },
  { slot: "Bottoms", item: "Jeans", icon: "Shirt" },
  { slot: "Footwear", item: "Sneakers", icon: "Footprints" },
  { slot: "Accessories", item: "Watch", icon: "CircleDot" },
  { slot: "Bag", item: "Backpack", icon: "Backpack" },
];

// ── NPC Tier System ──

export type NpcTier = "companion" | "active" | "passive" | "background";

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

export interface BackgroundNpc extends NpcBase {
  tier: "background";
  description: string;
}

export interface PassiveNpc extends NpcBase {
  tier: "passive";
  disposition: number;
  dispositionLabel: string;
  traits: string[];
  appearance: Record<string, string>;
  detailedAppearance: DetailedAppearance;
  transformation: TransformationTracker | null;
  race: string;
  level: number;
  hp: { current: number; max: number };
  xp: number;
}

export interface ActiveNpc extends NpcBase {
  tier: "active";
  disposition: number;
  dispositionLabel: string;
  traits: string[];
  appearance: Record<string, string>;
  detailedAppearance: DetailedAppearance;
  transformation: TransformationTracker | null;
  race: string;
  class: string;
  level: number;
  hp: { current: number; max: number };
  xp: number;
  stats: Record<string, { score: number; mod: number }>;
  skills: { name: string; ability: string; proficient: boolean; mod: number }[];
  abilities: { name: string; description: string }[];
  statusEffects: { name: string; type: "buff" | "debuff"; description: string }[];
  observedCapabilities: string[];
  threatImpression: string;
  visibleStatus: string[];
}

export interface CompanionNpc extends NpcBase {
  tier: "companion";
  disposition: number;
  dispositionLabel: string;
  traits: string[];
  appearance: Record<string, string>;
  detailedAppearance: DetailedAppearance;
  transformation: TransformationTracker | null;
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

// ── Companions ──

export const companions: CompanionNpc[] = [];

// ── Scene NPCs (Casino Royale) ──

export const sceneNpcs: SceneNpc[] = [
  // Active — Casino staff, rolls against the player
  {
    id: "npc-kandi",
    name: "Kandi",
    tier: "active",
    disposition: 75,
    dispositionLabel: "Adoring",
    faction: "Casino Royale",
    factionRank: "Hostess (P-72)",
    factionColor: "#ff69b4",
    portrait: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    status: "alive",
    appearance: {
      face: "Perfectly symmetrical, high cheekbones, permanent smile",
      hair: "Platinum blonde, waist-length, impossibly shiny",
      body: "5'4\", exaggerated hourglass figure",
      notable: "Bright pink eyes, glossy overfilled lips, pink PVC bunny uniform",
    },
    detailedAppearance: {
      gender: "Female (Converted)",
      height: "5'4\"",
      hair: "Platinum blonde, waist-length, impossibly shiny and voluminous",
      face: "Perfectly symmetrical, sculpted high cheekbones, permanent vapid smile, heavy Botox",
      eyes: "Bright pink, wide and glassy, vacant stare with long false lashes",
      lips: "Massively overfilled, glossy bubblegum pink, permanent pout",
      makeup: "Full glam — heavy contour, highlight, false lashes, pink eyeshadow, porcelain finish",
      skin: "Flawless, poreless, sun-kissed tan, luminous glow",
      chest: "DD+, perfectly spherical, gravity-defying",
      waist: "Impossibly cinched, exaggerated hourglass",
      hips: "Wide, exaggerated curves",
      ass: "Enhanced, perfectly rounded bubble",
      handsAndNails: "Delicate, long pink acrylic nails with glitter",
      legs: "Long, toned, smooth, always in nude pantyhose",
      feet: "Small, arched, always in 6\" platform stilettos",
      voice: "High-pitched, breathy, giggly",
      posture: "Exaggerated feminine — chest out, hip cocked, hair tossing",
      speech: "Vapid Vernacular — heavy valley girl, excessive 'like' and 'OMG', ditzy and airheaded",
      overall: "A living doll in a pink PVC bunny corset. Platinum hair, pink eyes, plastic perfection. Indistinguishable from every other Candy Lush model.",
    },
    transformation: {
      active: false,
      factionId: "casino-royale",
      factionName: "Casino Royale",
      factionColor: "#ff69b4",
      identity: 0,
      willpower: 0,
      conditioning: 100,
      currentThreshold: 5,
      thresholdName: "Active Model (P-72)",
      overallProgress: 100,
      physicalChanges: [],
      assignedTemplate: "Candy Lush",
    },
    traits: ["Bubbly", "Persistent", "Disarmingly Friendly"],
    race: "Human (Modified)",
    class: "Candy Lush",
    level: 5,
    hp: { current: 30, max: 30 },
    xp: 0,
    stats: {
      STR: { score: 8, mod: -1 },
      DEX: { score: 14, mod: 2 },
      CON: { score: 12, mod: 1 },
      INT: { score: 6, mod: -2 },
      WIS: { score: 8, mod: -1 },
      CHA: { score: 20, mod: 5 },
    },
    skills: [
      { name: "Persuasion", ability: "CHA", proficient: true, mod: 8 },
      { name: "Performance", ability: "CHA", proficient: true, mod: 8 },
      { name: "Deception", ability: "CHA", proficient: true, mod: 8 },
      { name: "Seduction", ability: "CHA", proficient: true, mod: 8 },
    ],
    abilities: [
      { name: "Perfume Kiss", description: "CHA-based opposed roll. On success, target becomes Giddy (disadvantage on WIS saves for 1 hour)." },
      { name: "Vapid Charm", description: "Target must succeed on WIS save or be compelled to follow Kandi to a location of her choosing." },
    ],
    statusEffects: [],
    observedCapabilities: ["Incredibly persuasive", "Seems harmless but always gets what she wants", "Smells intoxicating"],
    threatImpression: "She doesn't look dangerous. That's what makes her dangerous.",
    visibleStatus: ["Cheerful", "On duty"],
  },
  // Passive — Casino management
  {
    id: "npc-victoria",
    name: "Victoria Lane",
    tier: "passive",
    disposition: 30,
    dispositionLabel: "Professional",
    faction: "Casino Royale",
    factionRank: "Guest Relations Manager",
    factionColor: "#daa520",
    portrait: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    status: "alive",
    appearance: {
      face: "Sharp, immaculate makeup, cold but polished smile",
      hair: "Dark brown, sleek updo",
      body: "Tall, slim, impeccably dressed in a tailored black suit",
      notable: "Gold Casino Royale pin on lapel, always carrying a tablet",
    },
    detailedAppearance: {
      gender: "Female",
      height: "5'9\"",
      hair: "Dark brown, always in a sleek professional updo",
      face: "Sharp features, high cheekbones, immaculate makeup",
      eyes: "Dark brown, intense and evaluating",
      lips: "Matte red lipstick, thin professional smile",
      makeup: "Flawless professional — foundation, contour, subtle eyeshadow",
      skin: "Olive complexion, well-maintained",
      chest: "Average, professional silhouette",
      waist: "Slim, tailored suit accentuates",
      hips: "Proportionate",
      ass: "Normal",
      handsAndNails: "Manicured, short red nails, always holding a tablet",
      legs: "Long, professional heels",
      feet: "Size 8, black designer heels",
      voice: "Low, measured, authoritative",
      posture: "Perfect, commanding presence",
      speech: "Corporate professional — precise, polished, subtly condescending",
      overall: "A tall, impeccably dressed corporate woman. Everything about her screams authority and control.",
    },
    transformation: null, // Not transformed — management staff
    traits: ["Calculating", "Polished", "Condescending"],
    race: "Human",
    level: 8,
    hp: { current: 40, max: 40 },
    xp: 0,
  },
  // Background — other guests and ambient
  {
    id: "npc-bg-001",
    name: "Nervous Tourist",
    tier: "background",
    faction: "None",
    factionRank: "",
    factionColor: "#8a6a8a",
    portrait: null,
    status: "alive",
    description: "A middle-aged man clutching a drink, glancing around like he's looking for the exit. He's already lost more than he planned.",
  },
  {
    id: "npc-bg-002",
    name: "Bunny Hostess (Unknown Model)",
    tier: "background",
    faction: "Casino Royale",
    factionRank: "Staff",
    factionColor: "#ff69b4",
    portrait: null,
    status: "alive",
    description: "Another platinum-haired bunny girl glides past with a tray of drinks. She winks at you. They all look the same.",
  },
];

// ── Quests ──

export type Quest = {
  id: string;
  title: string;
  status: "active" | "completed" | "failed";
  image: string | null;
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
    title: "The Welcome Package",
    status: "active",
    image: "https://images.unsplash.com/photo-1596838132731-3301c3efb35f?w=800&q=80",
    description: "Victoria Lane has offered you a complimentary welcome package — a tour of the Casino, a spa voucher, and 500 bonus credits. It feels too generous.",
    lore: "The Casino Royale welcome package is standard for new guests who show 'potential.' What they don't tell you is that every element of the package is designed to increase your exposure to conditioning agents. The tour routes through areas with ambient conditioning. The spa voucher leads to treatment rooms with neural alignment equipment. The credits create dependency on the Casino economy.",
    questGiver: "Victoria Lane",
    location: "Casino Royale — Guest Relations",
    objectives: [
      { text: "Complete the Casino tour", completed: false },
      { text: "Visit the Promenade shops", completed: false },
      { text: "Redeem the spa voucher (optional)", completed: false },
    ],
    rewards: { xp: 50, gold: 0, items: ["500 Casino Credits"], reputation: [{ faction: "Casino Royale", change: 10 }] },
    notes: ["The spa voucher doesn't expire — suspicious", "Kandi was assigned as your tour guide", "Your phone signal is weak inside the complex"],
  },
  {
    id: "quest-002",
    title: "Find the Exit",
    status: "active",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",
    description: "Something doesn't feel right about this place. The exits seem to lead to more Casino. Find a way out — or at least find someone who knows one.",
    lore: "The Casino Royale complex is architecturally designed to disorient. Corridors loop, signage is inconsistent, and staff always seem to redirect you toward entertainment areas. The actual exits exist but are increasingly restricted as you progress through residency tiers.",
    questGiver: "Self",
    location: "Casino Royale",
    objectives: [
      { text: "Locate the main entrance you came in through", completed: false },
      { text: "Find someone who's successfully left", completed: false },
      { text: "Map the Casino layout (discover 5 locations)", completed: false },
    ],
    rewards: { xp: 100, gold: 0, items: [], reputation: [{ faction: "Casino Royale", change: -5 }] },
    notes: ["The staff don't like questions about exits", "The nervous tourist at the bar might know something"],
  },
];

// ── Factions ──

export type Faction = {
  name: string;
  reputation: number;
  tier: string;
  color: string;
  image: string | null;
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
    name: "Casino Royale",
    reputation: 15,
    tier: "Interested",
    color: "#daa520",
    image: "https://images.unsplash.com/photo-1596838132731-3301c3efb35f?w=800&q=80",
    description: "The entertainment capital of the city. A massive complex offering gaming, dining, entertainment, and luxury accommodation. Behind the glamour lies a sophisticated operation that transforms individuals into hyper-feminine, mentally reprogrammed staff. Powered by BimTech Industries technology.",
    territory: "City Centre — Casino Royale Complex",
    leader: "Unknown (Corporate ownership)",
    goals: ["Recruit new 'assets' from the guest population", "Maintain the illusion of luxury and choice", "Expand the model template program", "Increase guest-to-resident conversion rate"],
    knownMembers: ["Kandi (P-72, Candy Lush Hostess)", "Victoria Lane (Guest Relations Manager)"],
    playerHistory: ["Entered as a guest", "Given a welcome package and tour offer"],
    relationships: [{ faction: "BimTech Industries", stance: "Client" }, { faction: "City Watch", stance: "Neutral" }],
  },
  {
    name: "BimTech Industries",
    reputation: 0,
    tier: "Unknown",
    color: "#60a5fa",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description: "A global corporation specializing in beauty products and equipment. Their public brand is sleek and aspirational. The truth — that they manufacture transformation and mind control technology — is the city's best-kept secret.",
    territory: "Business District — BimTech Tower",
    leader: "Unknown",
    goals: ["Expand transformation technology market share", "Develop new model templates", "Maintain corporate secrecy"],
    knownMembers: [],
    playerHistory: ["No direct contact"],
    relationships: [{ faction: "Casino Royale", stance: "Supplier" }],
  },
];

// ── World State ──

export const worldState = {
  time: "Late Evening",
  date: "September 15th",
  location: "Casino Royale — Main Floor",
  weather: "Indoor (Climate Controlled)",
};

export const resources = {
  cash: 127,
  credits: 350,
};

export const clocks = [
  { name: "Guest Orientation", segments: 4, filled: 1, visible: true, type: "event" as const, description: "The Casino is evaluating you as a potential resident. Complete activities to fill — or avoid them to stop the clock." },
  { name: "Phone Battery", segments: 6, filled: 4, visible: true, type: "threat" as const, description: "Your phone's battery is draining. The Casino doesn't seem to have convenient charging stations. When empty, you lose contact with the outside." },
];

// ── Narrative ──

export const narrativeHistory = [
  {
    type: "narration" as const,
    text: "The Casino Royale hits you like a wall of sensation. Gold and pink light washes over everything, the air thick with perfume and the soft chiming of slot machines. Crystal chandeliers scatter rainbows across marble floors. It's beautiful. It's overwhelming. And something about it makes your skin prickle.",
  },
  {
    type: "npc" as const,
    speaker: "Kandi",
    text: "\"Oh my GOD, hi! Like, welcome to Casino Royale!\" A platinum-haired woman in a pink PVC bunny outfit materializes at your side, her smile impossibly wide. Her eyes are... pink? \"I'm Kandi, and I'm, like, totally your guide today! Victoria said you're getting the VIP welcome package? That's SO exciting!\"",
  },
  {
    type: "player" as const,
    text: "I take a step back from the overwhelming enthusiasm. \"Thanks, I'm just looking around. I don't need a guide.\"",
  },
  {
    type: "npc" as const,
    speaker: "Kandi",
    text: "Her smile doesn't waver — if anything, it gets wider. \"Aww, that's so cute! But like, the Casino is SUPER big and you could totally get lost. Trust me, you want a guide. Everyone does!\" She links her arm through yours before you can object, her grip surprisingly firm. \"Let's start with the Promenade, 'kay? They have the BEST shops.\"",
  },
  {
    type: "system" as const,
    text: "[Opposed Roll — Kandi's Persuasion (18) vs Cal's WIS Save (12+4=16)] Kandi succeeds. She guides you toward the Promenade before you can formulate a refusal.",
  },
];

export const diceResult: {
  type: string; roll: number; modifier: number; total: number; dc: number;
  outcome: "success" | "fail" | "crit_success" | "crit_fail"; natural: boolean;
} = {
  type: "WIS Save",
  roll: 12,
  modifier: 4,
  total: 16,
  dc: 18,
  outcome: "fail",
  natural: false,
};

// ── Relationship Graph ──

export type RelationshipNode = {
  id: string;
  name: string;
  faction: string;
  factionColor: string;
  disposition: number;
  status: "alive" | "dead" | "missing" | "unknown";
  portrait: string | null;
  known: boolean;
  description: string;
};

export type RelationshipLink = {
  source: string;
  target: string;
  type: string;
  strength: number;
  known: boolean;
};

export const relationshipNodes: RelationshipNode[] = [
  {
    id: "player", name: "Cal", faction: "Unaffiliated", factionColor: "#60a5fa",
    disposition: 0, status: "alive",
    portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    known: true, description: "You. A civilian who wandered into the wrong casino.",
  },
  {
    id: "npc-kandi", name: "Kandi", faction: "Casino Royale", factionColor: "#ff69b4",
    disposition: 75, status: "alive",
    portrait: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
    known: true, description: "A Candy Lush model (P-72). Assigned as your guide. Relentlessly cheerful and surprisingly hard to refuse.",
  },
  {
    id: "npc-victoria", name: "Victoria Lane", faction: "Casino Royale", factionColor: "#daa520",
    disposition: 30, status: "alive",
    portrait: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    known: true, description: "Guest Relations Manager. Professional, calculating. She's the one who offered the welcome package.",
  },
  {
    id: "npc-unknown-bunny", name: "???", faction: "Casino Royale", factionColor: "#ff69b4",
    disposition: 0, status: "alive",
    portrait: null,
    known: false, description: "You've seen several other bunny hostesses. They all look disturbingly similar to Kandi.",
  },
  {
    id: "npc-tourist", name: "Nervous Tourist", faction: "None", factionColor: "#8a6a8a",
    disposition: 0, status: "alive",
    portrait: null,
    known: true, description: "A man at the bar who looks like he wants to leave but can't. Might know something useful.",
  },
];

export const relationshipLinks: RelationshipLink[] = [
  { source: "player", target: "npc-kandi", type: "Assigned Guide", strength: 0.7, known: true },
  { source: "player", target: "npc-victoria", type: "Guest Relations", strength: 0.3, known: true },
  { source: "player", target: "npc-tourist", type: "Fellow Guest", strength: 0.1, known: true },
  { source: "npc-kandi", target: "npc-victoria", type: "Reports To", strength: 0.8, known: true },
  { source: "npc-kandi", target: "npc-unknown-bunny", type: "Same Template", strength: 0.9, known: false },
];

// ── Game Phase ──

export type GamePhase = "player_action" | "resolution" | "world_response" | "world_tick";
export const gamePhase: GamePhase = "player_action";

// ── World Map ──

export type LocationDepth = "world" | "district" | "zone" | "building" | "room";

export type MapConnection = {
  targetId: string;
  travelMinutes: number;
  energyCost: number;
  direction: string;
  accessible: boolean;
  accessCondition: string | null;
  discovered: boolean;
};

export type MapLocation = {
  id: string;
  name: string;
  depth: LocationDepth;
  parentId: string | null;
  authored: "handcrafted" | "ai-generated";
  aiCanGenerateChildren: boolean;
  aiCanGenerateSiblings: boolean;
  maxAiDepth: number;
  connections: MapConnection[];
  description: string;
  faction: string | null;
  factionColor: string | null;
  dangerLevel: 0 | 1 | 2 | 3;
  restricted: { condition: string; when: string } | null;
  availableHours: string | null;
  npcsPresent: string[];
  discovered: boolean;
  playerIsHere: boolean;
  x: number;
  y: number;
};

export const mapLocations: MapLocation[] = [
  // ══════════════════════════════════════
  // DISTRICTS
  // ══════════════════════════════════════

  {
    id: "city-centre", name: "City Centre", depth: "district", parentId: null,
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 0,
    connections: [
      { targetId: "university", travelMinutes: 30, energyCost: 3, direction: "north to campus", accessible: false, accessCondition: "locked:casino-resident", discovered: true },
      { targetId: "business-district", travelMinutes: 25, energyCost: 2, direction: "east to the towers", accessible: false, accessCondition: "locked:casino-resident", discovered: true },
      { targetId: "waterfront", travelMinutes: 20, energyCost: 2, direction: "south to the shore", accessible: false, accessCondition: "locked:casino-resident", discovered: true },
    ],
    description: "The beating heart of the city. Neon lights, high-end venues, and the ever-present glow of Casino Royale dominating the skyline.",
    faction: null, factionColor: null, dangerLevel: 0, restricted: null, availableHours: null,
    npcsPresent: [], discovered: true, playerIsHere: true, x: 50, y: 45,
  },
  {
    id: "university", name: "University District", depth: "district", parentId: null,
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 0,
    connections: [
      { targetId: "city-centre", travelMinutes: 30, energyCost: 3, direction: "south to the city", accessible: true, accessCondition: null, discovered: true },
      { targetId: "business-district", travelMinutes: 20, energyCost: 2, direction: "east through the park", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "Leafy campus grounds, lecture halls, and student housing. Home to several influential Greek organizations.",
    faction: null, factionColor: null, dangerLevel: 0, restricted: null, availableHours: null,
    npcsPresent: [], discovered: true, playerIsHere: false, x: 45, y: 15,
  },
  {
    id: "business-district", name: "Business District", depth: "district", parentId: null,
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 0,
    connections: [
      { targetId: "city-centre", travelMinutes: 25, energyCost: 2, direction: "west to the centre", accessible: true, accessCondition: null, discovered: true },
      { targetId: "university", travelMinutes: 20, energyCost: 2, direction: "west through the park", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "Glass towers and corporate plazas. BimTech Industries' headquarters looms largest of all.",
    faction: null, factionColor: null, dangerLevel: 0, restricted: null, availableHours: null,
    npcsPresent: [], discovered: true, playerIsHere: false, x: 80, y: 30,
  },
  {
    id: "waterfront", name: "Waterfront", depth: "district", parentId: null,
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 0,
    connections: [
      { targetId: "city-centre", travelMinutes: 20, energyCost: 2, direction: "north to the city", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "Beaches, boardwalk, and resort clubs along the coast. Popular in summer.",
    faction: null, factionColor: null, dangerLevel: 0, restricted: null, availableHours: null,
    npcsPresent: [], discovered: true, playerIsHere: false, x: 35, y: 80,
  },

  // ══════════════════════════════════════
  // CITY CENTRE — ZONES
  // ══════════════════════════════════════

  {
    id: "casino-royale", name: "Casino Royale", depth: "zone", parentId: "city-centre",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 3,
    connections: [
      { targetId: "city-salon", travelMinutes: 15, energyCost: 0, direction: "down the boulevard", accessible: false, accessCondition: "locked:casino-resident", discovered: true },
      { targetId: "city-nightclub", travelMinutes: 10, energyCost: 0, direction: "across the plaza", accessible: false, accessCondition: "locked:casino-resident", discovered: true },
    ],
    description: "The crown jewel of the City Centre. A vast entertainment complex that never sleeps. Once you're inside, leaving becomes... complicated.",
    faction: "Casino Royale", factionColor: "#daa520", dangerLevel: 1, restricted: null, availableHours: null,
    npcsPresent: ["npc-kandi", "npc-victoria"], discovered: true, playerIsHere: true, x: 50, y: 40,
  },
  {
    id: "city-salon", name: "Salon Luxe", depth: "zone", parentId: "city-centre",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: true, maxAiDepth: 2,
    connections: [
      { targetId: "casino-royale", travelMinutes: 15, energyCost: 0, direction: "up the boulevard", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "An upscale salon and beauty parlor. Uses BimTech beauty products exclusively — though the customers don't know that.",
    faction: null, factionColor: null, dangerLevel: 0, restricted: null, availableHours: "09:00-21:00",
    npcsPresent: [], discovered: true, playerIsHere: false, x: 30, y: 35,
  },
  {
    id: "city-nightclub", name: "Club Neon", depth: "zone", parentId: "city-centre",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: true, maxAiDepth: 2,
    connections: [
      { targetId: "casino-royale", travelMinutes: 10, energyCost: 0, direction: "across the plaza", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "The city's hottest nightclub. Pulsing music, VIP areas, and a clientele that seems a little too perfect.",
    faction: null, factionColor: null, dangerLevel: 0, restricted: null, availableHours: "22:00-06:00",
    npcsPresent: [], discovered: true, playerIsHere: false, x: 70, y: 50,
  },

  // ══════════════════════════════════════
  // CASINO ROYALE — INTERNAL ZONES
  // ══════════════════════════════════════

  {
    id: "casino-floor", name: "Casino Floor", depth: "building", parentId: "casino-royale",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 2,
    connections: [
      { targetId: "casino-promenade", travelMinutes: 5, energyCost: 0, direction: "through the golden archway", accessible: true, accessCondition: null, discovered: true },
      { targetId: "casino-entertainment", travelMinutes: 5, energyCost: 0, direction: "past the fountains", accessible: true, accessCondition: null, discovered: true },
      { targetId: "casino-hotel", travelMinutes: 10, energyCost: 0, direction: "up the grand escalator", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "The main gaming floor. Slot machines chime, roulette wheels spin, and bunny-suited hostesses circulate with drinks and smiles. The air is thick with perfume.",
    faction: "Casino Royale", factionColor: "#daa520", dangerLevel: 1, restricted: null, availableHours: null,
    npcsPresent: ["npc-kandi"], discovered: true, playerIsHere: true, x: 50, y: 30,
  },
  {
    id: "casino-promenade", name: "The Promenade", depth: "building", parentId: "casino-royale",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: true, maxAiDepth: 2,
    connections: [
      { targetId: "casino-floor", travelMinutes: 5, energyCost: 0, direction: "back to the gaming floor", accessible: true, accessCondition: null, discovered: true },
      { targetId: "casino-entertainment", travelMinutes: 5, energyCost: 0, direction: "through the atrium", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "An indoor shopping district of boutiques, salons, and a wellness spa. Everything is pink, gold, and smells like vanilla. The prices are in credits only.",
    faction: "Casino Royale", factionColor: "#ff69b4", dangerLevel: 1, restricted: null, availableHours: null,
    npcsPresent: [], discovered: true, playerIsHere: false, x: 25, y: 45,
  },
  {
    id: "casino-entertainment", name: "Entertainment District", depth: "building", parentId: "casino-royale",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: true, maxAiDepth: 2,
    connections: [
      { targetId: "casino-floor", travelMinutes: 5, energyCost: 0, direction: "past the fountains", accessible: true, accessCondition: null, discovered: true },
      { targetId: "casino-promenade", travelMinutes: 5, energyCost: 0, direction: "through the atrium", accessible: true, accessCondition: null, discovered: true },
      { targetId: "casino-sakura", travelMinutes: 10, energyCost: 0, direction: "through the bamboo corridor", accessible: true, accessCondition: null, discovered: false },
    ],
    description: "VIP lounges, performance stages, and private rooms. The entertainment here ranges from spectacular shows to... more intimate experiences.",
    faction: "Casino Royale", factionColor: "#a78bfa", dangerLevel: 1, restricted: null, availableHours: null,
    npcsPresent: [], discovered: true, playerIsHere: false, x: 75, y: 45,
  },
  {
    id: "casino-hotel", name: "Hotel Towers", depth: "building", parentId: "casino-royale",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 1,
    connections: [
      { targetId: "casino-floor", travelMinutes: 10, energyCost: 0, direction: "down the grand escalator", accessible: true, accessCondition: null, discovered: true },
    ],
    description: "Residential towers for guests and residents. The higher the floor, the more luxurious — and the harder to leave.",
    faction: "Casino Royale", factionColor: "#daa520", dangerLevel: 0, restricted: null, availableHours: null,
    npcsPresent: [], discovered: true, playerIsHere: false, x: 50, y: 70,
  },
  {
    id: "casino-sakura", name: "Sakura District", depth: "building", parentId: "casino-royale",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 2,
    connections: [
      { targetId: "casino-entertainment", travelMinutes: 10, energyCost: 0, direction: "back through the bamboo corridor", accessible: true, accessCondition: null, discovered: false },
    ],
    description: "A themed Japanese district within the Casino. Cherry blossoms, paper lanterns, and an eerie serenity. Home to the Sakura Silk models.",
    faction: "Casino Royale", factionColor: "#1a1a2e", dangerLevel: 2,
    restricted: { condition: "reputation:casino-royale:resident", when: "always" }, availableHours: null,
    npcsPresent: [], discovered: false, playerIsHere: false, x: 85, y: 70,
  },
  {
    id: "casino-depths", name: "The Depths", depth: "building", parentId: "casino-royale",
    authored: "handcrafted", aiCanGenerateChildren: true, aiCanGenerateSiblings: false, maxAiDepth: 2,
    connections: [],
    description: "Staff-only areas. Processing rooms, conditioning chambers, wardrobe departments. This is where the transformation happens.",
    faction: "Casino Royale", factionColor: "#ef4444", dangerLevel: 3,
    restricted: { condition: "faction:casino-royale:staff", when: "always" }, availableHours: null,
    npcsPresent: [], discovered: false, playerIsHere: false, x: 50, y: 90,
  },
];

// ── Property ──

export type Property = {
  id: string;
  name: string;
  type: "rented_room" | "apartment" | "house" | "estate";
  locationId: string;
  monthlyCost: number | null;
  stashCapacity: number;
  upgrades: { name: string; description: string; installed: boolean; cost: number }[];
  safeRest: boolean;
};

export const playerProperty: Property | null = null; // Player doesn't own property yet
