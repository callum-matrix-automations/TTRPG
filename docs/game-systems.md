# Game Systems — Core Mechanics Design

This document defines the game systems that make this a real game, not just an AI chat client. These are the rules the engine enforces — the AI narrates within them but cannot override them.

---

## 1. Spatial World & Movement

### Hub-and-Spoke Map Generation

The world is not pre-built. The player (or campaign setup) defines **hub zones** — broad district types like "Residential", "Commercial", "Docks", "Temple Quarter". The AI then generates **spoke locations** within each hub, and those spokes can have further sub-locations.

```
Hub: Trade District
├── The Gilded Rat Tavern (spoke)
│   ├── Main Hall
│   ├── Back Room (restricted: requires Marcus's trust)
│   └── Cellar (locked: requires key)
├── Market Square (spoke)
│   ├── Weapon Stall
│   ├── Potion Merchant
│   └── Black Alley (restricted: night only)
└── Merchants Guild Hall (spoke)
    └── Inner Chamber (restricted: requires Friendly reputation)
```

**Key rules:**
- Hubs are defined by the player/campaign setup as a skeleton
- Spoke locations are AI-generated, giving novelty per playthrough
- Sub-locations within spokes can be further generated on demand
- Each location has properties: `accessible`, `restricted` (conditions), `dangerLevel`, `faction`, `availableHours`, `npcsPresent`
- Restricted locations show a warning before entry — player chooses whether to proceed

### Movement & Travel

- Moving between **spokes within the same hub** costs a small, fixed unit of time (e.g., 15-30 minutes)
- Moving between **hubs** costs more time (e.g., 1-2 hours) and a small amount of energy
- Travel time is **predictable and shown to the player** before they commit
- Travel between hubs has a **random event chance** — code rolls a probability, if triggered the Campaign Director decides what happens
- The player sees the map, picks a destination, confirms the travel

### NPC Movement

- NPCs in the current scene can decide to travel (the NPC agent knows available locations)
- Off-screen NPCs are moved by the Campaign Director / narrator during world ticks
- NPC locations are tracked in their JSON files

### Restricted Locations

- Defined per location: `restricted: { condition: "reputation:merchants_guild:friendly", when: "always" }`
- Or time-based: `restricted: { condition: "none", when: "22:00-06:00" }` (closed at night)
- Player is notified when approaching: "This area is restricted. [Enter anyway] [Turn back]"
- Entering triggers the random event + GM resolution mechanic

---

## 2. Turn / Phase Structure

The game has a structured loop, not freeform chat.

### Game Loop

```
1. PLAYER ACTION PHASE
   - Player chooses: Move, Talk to NPC, Explore, Use Item, Rest, or Free Action

2. RESOLUTION PHASE
   - If the action requires a check: GM Call → Resolution Engine → Outcome
   - If no check needed: skip to response

3. WORLD RESPONSE PHASE
   - AI narrates the result
   - NPCs react
   - Scene plays out (may involve multiple exchanges within the scene)

4. WORLD TICK
   - Time advances (determined by action type or GM decision post-scene)
   - Clocks tick
   - Off-screen NPCs progress
   - Resources update (energy cost of travel, etc.)
   - Random event check for next location
```

### Scenes

- A **scene** is triggered when the player enters a location and engages with someone/something
- Scenes can also trigger **without player choice** via random events on location entry
- Within a scene, the player and NPCs exchange dialogue/actions freely (this is the AI conversation part)
- At the end of a scene, the GM decides how much time passed
- The world tick fires after the scene ends

### Time Costs

| Action | Time Cost | Energy Cost |
|---|---|---|
| Move within hub | 15-30 min (fixed per path) | 0 |
| Move between hubs | 1-2 hours (fixed per path) | Small (GM-defined per route) |
| Scene | GM decides post-scene | GM decides post-scene |
| Short rest | 1 hour | 0 (restores energy) |
| Long rest | 8 hours | 0 (full restore) |
| Use item | Negligible | 0 |

---

## 3. Resource Management

Kept intentionally simple. Three resources:

### HP (Health Points)
- Depleted by combat, traps, environmental hazards, failed checks with physical consequences
- Does NOT regenerate automatically
- Restored by: healing potions, healer NPCs, rest, healing spells (companion)
- At 0 HP: incapacitated (scene plays out narratively — rescue, capture, or death depending on context)

### Energy
- Represents fatigue and stamina
- Depleted by: travel between hubs (small cost), combat (moderate cost), extended scenes (GM-determined post-scene)
- Restored by: short rest (partial), long rest (full), certain consumables
- Low energy: penalties to checks (disadvantage below 25%), movement options restricted
- At 0 energy: forced rest — cannot travel, disadvantage on all checks

### Gold
- Single currency (no silver/copper complexity beyond display flavor)
- Spent on: items at shops, services (healing, information, lodging), bribes, property
- Earned from: quest rewards, selling items, contracts, found loot
- Tracked as a simple integer

### What We Explicitly DON'T Track
- Food/rations (abstracted — if you have gold you can eat)
- Encumbrance (carry what you want)
- Ammunition (abstracted)
- Spell components (abstracted)

---

## 4. Rest & Recovery

### Short Rest (1 hour)
- Requires: a reasonably safe location (tavern, camp, allied territory)
- Restores: half of max energy, some ability charges
- Time cost: 1 hour (clocks tick)
- Available: most locations that aren't actively hostile

### Long Rest (8 hours)
- Requires: a safe location (inn, owned property, protected camp)
- Restores: full HP, full energy, all ability charges
- Time cost: 8 hours (significant clock advancement, world progresses)
- NOT available in: hostile territory, dungeons, restricted areas
- Cost: may require paying for lodging (inn = gold cost)

### Strategic Decisions
- Resting costs time, and time is valuable (clocks tick, NPCs move, events fire)
- You can't rest everywhere — safety must be found or created
- Property ownership gives guaranteed safe rest without gold cost

---

## 5. Day/Night Cycle

Simple implementation — time of day as a variable, not a visual system.

- Time advances through the turn structure (travel, scenes, rest)
- Time of day affects:
  - **Location availability**: shops close at night, certain areas only accessible at specific times
  - **NPC availability**: some NPCs only appear at certain times
  - **GM context**: time of day is passed as a variable to the AI, influencing scene descriptions and events
  - **Danger levels**: some areas more dangerous at night
- Time periods: Early Morning, Morning, Midday, Afternoon, Evening, Late Evening, Night, Late Night

---

## 6. Reputation Consequences

Reputation is already tracked per faction. This system defines what it **does**.

### Reputation Tiers & Effects

| Tier | Range | Effects |
|---|---|---|
| Hostile | -100 to -61 | Attacked on sight in faction territory. Bounty hunters sent. |
| Unfriendly | -60 to -21 | NPCs refuse to help. Shops charge 2x prices. Restricted from faction areas. |
| Neutral | -20 to 20 | Default interactions. Normal prices. |
| Friendly | 21 to 60 | Discounts at faction shops. Access to restricted areas. Faction quests available. |
| Allied | 61 to 100 | Major discounts. Full area access. Special rewards. NPCs offer help proactively. |

### Reputation as a Gate
- Some locations require minimum reputation: `restricted: { condition: "reputation:merchants_guild:friendly" }`
- Some quests only offered at certain reputation levels
- Some dialogue options unlocked by reputation
- Passed as a variable to the AI so NPCs react appropriately

---

## 7. Restricted Areas & Stealth

Simplified — no complex stealth system, just a gate + consequence mechanic.

- Locations can be marked `restricted` with a condition (time, reputation, quest, key)
- When the player approaches a restricted area, they get a notification:
  - What the restriction is (if they know)
  - "Enter anyway" / "Turn back" choice
- Entering a restricted area:
  - Code rolls a random event check (higher probability in restricted areas)
  - If triggered: Campaign Director generates the encounter (caught by guards, trap, ambush, etc.)
  - If not triggered: player can explore freely (for now)
  - Subsequent actions in the restricted area have elevated random event chances

---

## 8. Procedural Events

No pre-built event tables. The structure is code, the content is AI.

### Event Trigger Flow
```
1. CODE: Roll random event check (probability based on: location danger, time of day, restricted status)
2. CODE: If triggered, determine event category (combat, social, discovery, environmental, trap)
3. AI (Campaign Director): Given the category, location, time, and world state — generate the event
4. GAME: Scene triggers with the event context
```

### Event Categories
- **Combat**: hostile encounter (bandits, monsters, rival faction members)
- **Social**: NPC interaction (stranger asking for help, merchant offering a deal, information overheard)
- **Discovery**: find something (hidden item, secret passage, clue, body)
- **Environmental**: weather, structural hazard, natural obstacle
- **Trap**: mechanical or magical trap (in dungeons/restricted areas)

### Probability Modifiers
- Base: 10% per location entry
- Restricted area: +20%
- Hostile faction territory: +15%
- Night time: +10%
- High danger location: +15%
- Player has low HP/energy: +5% (the world smells weakness)

---

## 9. Property System

The player can own property. This is a progression mechanic.

### Property Types (progressive)
1. **Rented Room** — cheap, basic. Safe rest, small stash. Can lose it if rent isn't paid.
2. **Apartment** — more expensive. Safe rest, larger stash, some customization.
3. **House** — significant investment. Safe rest, large stash, crafting potential (future), companion housing.
4. **Estate** — endgame. Multiple rooms, upgradeable, income generation potential.

### Property Features
- **Safe rest**: guaranteed long rest location without per-night cost
- **Stash**: store items you're not carrying (since we don't track encumbrance, this is for organization)
- **Upgrades**: spend gold to improve (better security, alchemist table, training room)
- **Location matters**: property in different districts has different advantages (near shops, near faction HQ, near adventure areas)
- **Can be lost**: if you anger the wrong faction, your property might be seized or attacked

---

## Future Ideas (Not Yet Designed)

### Companion Management (Depth TBD)
- Companions have loyalty and morale
- Player decisions affect companion loyalty
- Companions may leave or betray based on choices
- Companion personal quests
- Equipment and level management for companions

### Contract / Bounty Board (Structure TBD)
- Procedurally generated side quests from job boards
- Available at taverns, guild halls, notice boards
- Provides gold income between main quests
- Some contracts have hidden complications
- Reputation rewards from completing contracts

---

## UI Surfaces Required

| System | UI Component | Status |
|---|---|---|
| World map | Map panel with hubs, spokes, travel paths, travel time preview | Not built |
| Turn/phase indicator | Phase display in top bar or narrative panel | Not built |
| Energy resource | Energy bar alongside HP in character sheet + top bar | Not built |
| Rest modal | Short rest / long rest with time cost and recovery preview | Not built |
| Time of day | Already in top bar (approximate time) | Built |
| Reputation gates | Restriction warning when approaching restricted locations | Not built |
| Random event notification | Narrative entry + scene trigger | Not built (toast system needed) |
| Property management | Property panel or modal — view, upgrade, manage stash | Not built |
| Bounty board | Modal accessible from specific locations | Not built |
