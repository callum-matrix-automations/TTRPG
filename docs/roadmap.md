# Development Roadmap

## Phase 1: Foundation (v0.1) — UI Shell + Project Scaffold
**Goal:** Electron app running with all UI panels laid out. No AI, no game logic — just the interface.

- [x] Electron + Next.js project setup
- [x] Main layout with resizable/collapsible panels
- [x] Central narrative panel (with placeholder text, streaming-ready)
- [x] Left sidebar: character sheet (stats, attributes, skills, appearance)
- [x] Left sidebar: party panel (companion management)
- [x] Right sidebar: NPC panel (tiered: active/passive/background)
- [x] Inventory panel (with item detail modal)
- [x] Gear/equipment panel (with slot modal)
- [x] Quest log panel (with quest detail modal)
- [x] Time & date display
- [x] Clock/timer display (visible clocks only, with tooltips)
- [x] Resources / currency display
- [x] Faction reputation display (with faction detail modal)
- [x] Scene/background image area
- [ ] Dice roll/skill check UI (roll animation, result display, hidden roll hints)
- [x] Player input area (free text + structured options)
- [x] Relationship web visualization (force-directed graph with character modals)
- [x] Basic theming system (CSS variables, dark mode default)
- [x] Placeholder data loaded from TypeScript (will migrate to JSON in Phase 2)
- [ ] World map UI (hub-and-spoke locations, travel paths, travel time preview)
- [ ] Energy resource bar (alongside HP)
- [ ] Rest modal (short rest / long rest with time cost and recovery preview)
- [ ] Phase/turn indicator in top bar
- [ ] Notification/toast system
- [ ] Property panel placeholder

## Phase 2: Game Engine Core (v0.2)
**Goal:** Game mechanics working without AI. Dice rolls, stat checks, inventory, economy, spatial world.

### Resolution Engine
- [ ] D20 + modifiers + advantage/disadvantage + bonuses
- [ ] 4-tier outcome system (crit fail / fail / success / crit success)
- [ ] Passive check calculations
- [ ] Dice roll animation (spinning, suspense, tier-specific reveal)

### Character Systems
- [ ] Stat/attribute system (STR, DEX, CON, INT, WIS, CHA + derived modifiers)
- [ ] Skill system (full 5e skill list, proficiency, expertise)
- [ ] Character leveling (XP thresholds, level up, proficiency bonus scaling)
- [ ] HP system (damage, healing, death/incapacitation)
- [ ] Energy system (depletion from travel/combat/scenes, recovery from rest)

### Inventory & Economy
- [ ] Inventory management (add, remove, equip, use)
- [ ] Economy engine (currency, buy/sell at shops)
- [ ] Shop UI (accessible from merchant locations)

### World Systems
- [ ] Hub-and-spoke map system (hubs defined by player, spokes AI-generated)
- [ ] Location data structure (properties, restrictions, danger level, faction, NPCs present, available hours)
- [ ] Movement engine (travel between spokes and hubs with time/energy cost)
- [ ] Restricted area gate (condition check + player choice to proceed or turn back)
- [ ] Random event trigger system (probability roll on location entry/travel)
- [ ] Day/night cycle (time periods affect location availability, passed as variable to AI)

### Turn Structure
- [ ] Game loop: Player Action → Resolution → World Response → World Tick
- [ ] Scene system (triggered on NPC engagement or random event)
- [ ] World tick (clock advancement, off-screen NPC movement, resource updates)
- [ ] Time tracking (predictable travel costs, GM-determined scene time)

### Tracking Systems
- [ ] Clock system (create, tick, complete, visible/hidden)
- [ ] Faction reputation tracking (numeric scale, named tiers, gameplay consequences)
- [ ] NPC disposition tracking (numeric scale, named tiers)
- [ ] NPC tier system (background → passive → active → companion promotion)

### Rest & Recovery
- [ ] Short rest (1 hour, partial energy restore, some ability charges, requires safe location)
- [ ] Long rest (8 hours, full restore, requires safe/owned location, costs time)
- [ ] Rest location validation (safe area check)

### Property System
- [ ] Property types (rented room → apartment → house → estate)
- [ ] Property purchase/rent mechanics
- [ ] Safe rest at owned property
- [ ] Item stash at property
- [ ] Property upgrades (spend gold for improvements)

### Persistence
- [ ] Save/load system (JSON file read/write)
- [ ] Game state manager (central state that all systems read/write)
- [ ] Settings system (gameplay, display, audio)

## Phase 3: AI Integration — Single Agent (v0.3)
**Goal:** Basic AI narrative working. One AI agent as proof of concept before splitting into multi-agent.

- [ ] Claude API integration (streaming responses)
- [ ] Basic narrator agent with structured output
- [ ] Player input → AI response → state update loop
- [ ] Context window management (message history with limits)
- [ ] Basic system prompt architecture
- [ ] Lorebook system — persistent entries (always injected)
- [ ] Lorebook system — contextual entries (RAG retrieval by scene context)
- [ ] AI-generated spoke locations (given hub skeleton)
- [ ] AI-determined scene time costs (post-scene)
- [ ] AI-determined energy costs (post-scene)

## Phase 4: Multi-Agent System (v0.4)
**Goal:** Full agent architecture as designed.

- [ ] Orchestrator agent
- [ ] Narrator agent (split from v0.3 single agent)
- [ ] NPC agent (per-NPC system prompt swapping, pure narrative output)
- [ ] Quest agent (completion checks, reward distribution)
- [ ] GM Call agent (sets roll parameters, DCs, outcomes, advantage/disadvantage)
- [ ] State Analyst (2-shot: triage → update, runs per-character per-turn)
- [ ] Campaign Director agent (story pacing, clue planting, random event content, clock management)
- [ ] Image agent (ComfyUI workflow routing)
- [ ] Agent communication protocol
- [ ] Context routing (each agent gets only relevant context)
- [ ] Hidden roll system (NPC-initiated rolls with narrative hints)
- [ ] Environment/random event system (code triggers, Campaign Director generates content)
- [ ] NPC stat generation (AI generates full stat block on tier promotion to Active)

## Phase 5: ComfyUI Integration (v0.5)
**Goal:** AI-generated images for scenes, NPCs, and player character.

- [ ] ComfyUI API integration (cloud endpoint)
- [ ] Image Agent implementation
- [ ] Scene background generation workflow
- [ ] NPC portrait generation workflow
- [ ] Player character portrait workflow
- [ ] Character full-body generation (gear visualization)
- [ ] Inventory item art generation
- [ ] Quest cover art generation
- [ ] Faction cover art generation
- [ ] Status effect & ability icon generation (library-based)
- [ ] Image caching system
- [ ] Consistent character generation (reference images / IP-adapter)
- [ ] On-demand regeneration (user-requested)

## Phase 6: Context Management & Summarization (v0.6)
**Goal:** Keep AI context bounded and efficient long-term.

- [ ] Rolling session summaries (auto-summarize older turns)
- [ ] Campaign-level summary compression
- [ ] Per-NPC history summarization (on scene exit)
- [ ] Context budget tracking (know how much each agent is consuming)

## Phase 7: Living World (v0.7)
**Goal:** NPCs and the world exist independently of the player.

- [ ] NPC off-screen progression (goals advance when player is away)
- [ ] NPC-to-NPC relationship evolution (off-screen)
- [ ] NPC movement between locations (off-screen, Campaign Director driven)
- [ ] Faction timeline progression (clocks tick while player is away)
- [ ] World event system (things happen without player involvement)
- [ ] NPC deception mechanics (active deception tracking, detection via checks)
- [ ] Reputation consequences (faction reactions, price changes, area access, bounty hunters)
- [ ] Procedural events (code triggers category, AI generates content)

## Phase 8: Polish & Expansion (v0.8+)

- [ ] Multiple campaign support
- [ ] Character creation wizard
- [ ] UI themes / genre-specific theming
- [ ] Multiple LLM provider support
- [ ] Local ComfyUI support
- [ ] Class/role system with features
- [ ] Expanded skill check systems
- [ ] Export/share campaigns
- [ ] Contract / bounty board system
- [ ] Companion loyalty & morale depth
- [ ] Property income generation (endgame)

## Design Principles (Apply at Every Phase)

1. **Incremental updates** — Never regenerate entire data structures. Only update changed fields.
2. **Bounded context** — No agent ever gets the full chat history. Summaries + relevant data only.
3. **NPC agents produce pure narrative** — State changes extracted separately by the State Analyst.
4. **System agents return structured JSON** — Narrator, Quest, GM Call, State Analyst use structured output.
5. **Code handles math, AI handles judgment** — Resolution Engine is code. GM Call is AI. Random event triggers are code, event content is AI.
6. **Separation of concerns** — Game engine logic is pure code, not AI-dependent.
7. **JSON-first persistence** — All game state in readable JSON files. No database.
8. **Theme-ready** — CSS variables from day one so theming is a config change, not a rewrite.
9. **Hidden information is real** — NPC rolls can be invisible to the player. The system respects information asymmetry.
10. **Stats are lazy-loaded** — Full NPC stat blocks exist but only pass to systems that need them. Generated on-demand by AI when tier promotes.
11. **Code triggers, AI fills** — Random events, procedural content, and world generation use code for structure/probability and AI for content/narrative.
12. **Time is a resource** — Every action costs time. Time drives the world forward. Resting, traveling, and exploring all have time costs that make clocks tick and the world progress.
