# World Setting — The City

## Overview

A modern city where transformation technology is real, commercialized, and hidden in plain sight. The player is a regular person — not a hero, not special — navigating a world where powerful factions can reshape bodies and minds. Each faction operates as a "dungeon" with its own transformation pipeline, economy, and social structure.

The player explores the open world freely until they engage with a faction deeply enough to trigger its intro event. Once locked in, they must navigate the faction's territory while resisting transformation, ultimately either succumbing (class change, new identity) or defeating the faction (escape with lingering effects).

---

## The Corporate Layer

Two corporations produce the transformation technology that factions use. They are the lore backbone — they explain WHY transformations look the way they do, but they are not directly encountered as dungeons (except BimTech HQ).

### BimTech Industries

- Global leader in transformation technology
- Outward-facing: legitimate beauty products and equipment company
- Behind the scenes: manufactures bimbo transformation and mind control technology
- Sells to factions worldwide
- **Product line:** "Bimbo Models" — standardized templates that physically and mentally modify targets into a specific model
- Each model has a product line code and identifier
- All instances of the same model share the same personality, appearance, behavior
- **Enterprise clients** (like Casino Royale) can commission custom models exclusive to them
- **Non-enterprise clients** only have access to BimTech's proprietary/off-the-shelf models

### [East Asian Competitor] (Name TBD)

- East Asian themed branding and corporate identity
- Newer company, less established than BimTech
- All models are East Asian in presentation
- Has secured a deal with Casino Royale — Sakura Silk is their first Casino-exclusive model
- Nobody knows much about them publicly
- **Hidden trait:** ALL of their models (proprietary and enterprise custom) carry an ethnic narcissism behavioral trait — this is a feature of the company's technology, not any individual model
- Competing with BimTech for market share

### How Corporations Relate to Factions

```
BimTech Industries
├── Casino Royale (enterprise client — 8 custom models)
├── Alpha Omega Sorority (client tier TBD)
├── Beach Club (client tier TBD)
├── Night Club (client tier TBD)
└── BimTech HQ (the source — has all models)

[Competitor]
├── Casino Royale (enterprise client — Sakura Silk)
├── Sakura District locations (primary territory)
└── [Competitor] HQ (has all competitor models)
```

Factions that aren't BimTech clients might use independent transformation methods, or might be smaller clients using off-the-shelf proprietary models.

---

## City Districts & Locations

### City Centre

The commercial and entertainment heart of the city. High-end, glamorous, dangerous.

| Location | Type | Faction | Notes |
|---|---|---|---|
| **Casino Royale** | Dungeon (complex) | Casino Royale | Massive entertainment complex. BimTech enterprise client. Multiple zones within. First dungeon to build. |
| **Salon** | Location | TBD | Could be independent or faction-affiliated. |
| **Night Club** | Dungeon | TBD | Nightlife venue with its own transformation pipeline. |

**Casino Royale Internal Zones:**
- Casino Floor (gaming, slots, high roller rooms)
- The Promenade (shopping, boutiques, salons, spa)
- The Entertainment District (nightclubs, VIP lounges, shows)
- Hotel Towers (residential apartments for residents)
- Sakura District / Ivory Quarter (themed Japanese district)
- Staff Areas / The Depths (restricted, processing, conditioning)

### University District

Academic area. Player may start here or have connections here. Factions target students.

| Location | Type | Faction | Notes |
|---|---|---|---|
| **Alpha Omega Sorority** | Dungeon | Alpha Omega | Sorority with a transformation pipeline. Uses BimTech tech (tier TBD). |
| **Goth Faction** | Dungeon | TBD | Counter-culture group with their own transformation aesthetic. |
| **Cheerleader Faction** | Dungeon | TBD | Athletic/spirit squad with transformation pressure. |

### Business District

Corporate territory. Where the money and power live.

| Location | Type | Faction | Notes |
|---|---|---|---|
| **BimTech Industries HQ** | Dungeon | BimTech | The source of transformation tech. Extremely dangerous. Has access to ALL models. |
| **[Competitor] HQ** | Dungeon | Competitor | The rival corporation. All East Asian models. |

### Miscellaneous Locations

| Location | Type | Faction | Notes |
|---|---|---|---|
| **Beach Club** | Dungeon | TBD | Seasonal/summer transformation faction. |
| **Hotel / Manor House** | Dungeon | TBD | Exclusive venue with its own pipeline. |

### Non-Faction Locations (Safe Zones / Services)

These will be developed as needed:
- Player's apartment (starting property)
- Shops, restaurants, services
- Public spaces (parks, transit, etc.)
- Medical facilities (potential resistance resources)

---

## Faction Design Template

Every faction follows this structure:

```
FACTION: [Name]
├── Territory: [locations on the map]
├── Corporation: [BimTech / Competitor / Independent]
├── Client Tier: [Enterprise (custom models) / Standard (proprietary) / None]
├── Currency: [faction-specific currency name, or null]
├── Population System: [tiers of involvement — e.g., Guest/Resident/Staff]
│
├── Transformation Pipeline:
│   ├── Intro Event: [what locks the player in]
│   ├── Thresholds: [number of stages, what triggers each]
│   ├── Templates/Models: [available transformation outcomes]
│   ├── Conditioning Sources: [what drains Identity/Willpower]
│   └── Defeat Condition: [how the player can escape/overcome]
│
├── NPCs:
│   ├── Key NPCs: [named characters with roles]
│   ├── Template NPCs: [transformed staff — their template IS their class]
│   └── Background NPCs: [guests, visitors, ambient population]
│
├── Economy:
│   ├── Currency: [name, exchange rate to global currency]
│   ├── Earning Methods: [jobs, tasks, rewards]
│   ├── Spending Sinks: [what costs money and why]
│   └── Debt Mechanics: [how debt creates pressure, if applicable]
│
└── Locations:
    ├── [Zone 1]: [sub-locations]
    ├── [Zone 2]: [sub-locations]
    └── [Restricted Zones]: [what's behind the curtain]
```

---

## Player Progression Through the World

### Starting State
- Player is a civilian (class TBD through character creation)
- Lives in an apartment (starting property)
- Has access to the open world
- No faction allegiance
- Full Identity (100), Willpower (100), Conditioning (0)

### Exploration Phase
- Player explores districts, meets NPCs, discovers faction territories
- Factions are encountered organically — the player stumbles into their influence
- Early interactions are safe — shopping at a faction's stores, socializing with their members
- The player doesn't know they're being drawn in

### Lock-In
- At some point, the player triggers a faction's intro event
- This is the "point of no return" for that dungeon
- The player is now in the dungeon — they can't leave until resolution
- Transformation tracker activates

### Dungeon Phase
- Player navigates the faction's territory
- NPCs pressure them with opposed rolls
- Identity/Willpower deplete, Conditioning rises
- Threshold events fire, changing the player physically and mentally
- The player must find ways to resist, gather allies, discover weaknesses

### Resolution
- **Succumb:** Full transformation. Player gets a class change. Returns to world with new identity. Can encounter other factions.
- **Defeat:** Player overcomes the faction. Returns to world with lingering partial changes. Faction may pursue them.

### Post-Resolution
- Player returns to open world exploration
- May carry physical changes from partial transformation
- Can engage with the next faction
- Only one faction transformation is active at a time
- Previous transformation history tracked but not mechanically active

---

## The Three-Tier Population System (Generic)

Most factions use a three-tier system for people in their territory:

| Tier | Generic Name | Casino Equivalent | Status |
|---|---|---|---|
| **Visitor** | Outsider, customer, guest | Guest | Free to leave. Can use faction services. No transformation pressure yet. |
| **Entangled** | Resident, member, employee | Resident | Locked in. Has obligations (debt, job, social ties). Transformation pressure active. |
| **Converted** | Asset, model, member | Staff (Bimbo Model) | Fully transformed. New identity. Part of the faction permanently. |

---

## NPC Classification Within Factions

Faction NPCs use our existing tier system:

| NPC Tier | Within a Faction |
|---|---|
| **Background** | Other visitors, ambient population |
| **Passive** | Regular faction members the player hasn't engaged with mechanically |
| **Active** | Faction members who pressure the player (roll against them, initiate conditioning) |
| **Companion** | Rare — an NPC who helps the player resist from within |

**Transformed NPCs** (staff/models) are classified by their template as their class/race. A "Candy Lush" is a class, just like "Wizard" or "Rogue" in a fantasy setting. Their stats, behavior, and abilities come from the template definition.

---

## Tone & Atmosphere

- **Surface:** Glamorous, luxurious, welcoming. Everything looks amazing.
- **Reality:** Predatory, manipulative, inescapable. The beauty is the trap.
- **NPCs:** Overwhelmingly positive and affectionate. "Toxic positivity." They genuinely believe they're helping.
- **Authority:** Through social pressure, pity, and backhanded compliments — not force or anger.
- **Player:** Not special. Not a hero. Just a person who walked into the wrong place.
