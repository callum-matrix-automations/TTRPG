# Development Roadmap

## Phase 1: Foundation (v0.1) — UI Shell + Project Scaffold
**Goal:** Electron app running with all UI panels laid out. No AI, no game logic — just the interface.

### Core Layout
- [x] Electron + Next.js project setup
- [x] Main layout with resizable/collapsible panels (custom drag-to-resize, icon strip sidebars)
- [x] Basic theming system (CSS variables, dark purple/gold theme, Playfair/Montserrat/Fira Code)
- [x] Notification/toast system (5 types, auto-dismiss, dev trigger panel)
- [x] Phase/turn indicator in top bar

### Left Sidebar Panels
- [x] Character sheet (portrait, HP/energy/XP bars, collapsible drawers for attributes, skills, abilities, status effects, appearance)
- [x] Transformation panel (Identity/Willpower/Conditioning bars, physical changes, overall progress)
- [x] Party panel (companion cards with stats, click to open full modal)
- [x] Inventory panel (clickable items with detail modal — image, description, effects, attributes)
- [x] Gear/equipment panel (slot grid with SVG character placeholder, equip/unequip modal)
- [x] World map panel (Phaser 3 canvas — compact preview + fullscreen modal with location detail + travel UI)
- [x] Property panel (property details, upgrades, safe rest indicator, tier progression)
- [x] Relationship web (character list + force-directed graph modal with navigable character modals)

### Right Sidebar Panels
- [x] NPC panel (tiered: active with HP/stats/observed capabilities, passive with disposition, background collapsible)
- [x] Quest log (quest cards with progress bars, click for full detail modal with lore/rewards/notes)
- [x] Faction reputation (reputation bars, click for detail modal with goals/members/relations/history)

### Top Bar
- [x] Time & date display (approximate time, calendar date)
- [x] Location display
- [x] Clock/timer display (with hover tooltips showing type, progress, description)
- [x] Resources/currency display (context-dependent: cash + faction credits)
- [x] Phase/turn indicator
- [x] Rest button (opens rest modal)

### Center Panel
- [x] Scene/background image area
- [x] Central narrative panel (narration, NPC dialogue, player dialogue, system messages)
- [x] Player input area (free text + action suggestion buttons)
- [x] Dice roll result display (static — animation pending)

### Modals
- [x] Item detail modal (image, description, effects, attributes, animated open/close)
- [x] Equipment slot modal (compatible items, equip/unequip)
- [x] Quest detail modal (lore, objectives with progress, rewards with reputation, notes)
- [x] Faction detail modal (cover image, description, territory, leader, goals, members, relations, history)
- [x] Companion detail modal (full character sheet with drawers, matching player character layout)
- [x] Character modal (navigable stack — click connections to drill through NPCs)
- [x] Relationship graph modal (fullscreen force-directed graph, node click popups, faction legend)
- [x] Rest modal (location safety check, short/long rest with recovery preview, clock warning)
- [x] Appearance modal (categorized full-body description, image placeholder, transformation indicators)
- [x] Fullscreen map modal (Phaser canvas, location detail panel, travel confirmation, breadcrumb navigation)

### Data & Types
- [x] Placeholder data (modern Casino Royale setting, all fantasy content replaced)
- [x] NPC tier system types (background/passive/active/companion with promotion-only flow)
- [x] Transformation system types (TransformationTracker, PhysicalChange, DetailedAppearance)
- [x] Hierarchical map types (LocationDepth, MapConnection, MapLocation)
- [x] Typed quest, faction, inventory, relationship graph data

### Remaining Phase 1
- [ ] Dice roll animation (spinning, suspense, tier-specific reveal — result card exists but no animation)
- [ ] Save/load UI placeholder
- [ ] Settings panel placeholder
- [ ] Character creation flow placeholder

## Phase 2: Game Engine Core (v0.2)
**Goal:** Game mechanics working without AI. Dice rolls, stat checks, inventory, economy, spatial world, transformation.

### Resolution Engine
- [ ] D20 + modifiers + advantage/disadvantage + bonuses
- [ ] 4-tier outcome system (crit fail / fail / success / crit success)
- [ ] Passive check calculations
- [ ] Dice roll animation (spinning, suspense, tier-specific reveal)
- [ ] Opposed rolls (NPC CHA vs player WIS saves)

### Character Systems
- [ ] Stat/attribute system (STR, DEX, CON, INT, WIS, CHA + derived modifiers)
- [ ] Skill system (full skill list, proficiency, expertise)
- [ ] Character leveling (XP thresholds, level up, proficiency bonus scaling)
- [ ] HP system (damage, healing, incapacitation)
- [ ] Energy system (depletion from travel/scenes, recovery from rest)

### Transformation Engine
- [ ] Identity/Willpower/Conditioning depletion logic
- [ ] Threshold event triggering (when Identity crosses milestones)
- [ ] Physical change application (per body part, incremental)
- [ ] Willpower → mental defense modifier calculation
- [ ] Faction lock-in mechanics (intro event triggers, player trapped until resolution)
- [ ] Post-transformation class change and stat modification
- [ ] Template assignment system

### Inventory & Economy
- [ ] Inventory management (add, remove, equip, use)
- [ ] Multi-currency economy (cash + faction-specific currencies)
- [ ] Shop UI (accessible from merchant locations)
- [ ] Debt mechanics (faction-specific economic pressure)

### World Systems
- [ ] Hierarchical map engine (district → zone → building → room navigation)
- [ ] Location data with AI generation flags (authored, aiCanGenerateChildren, maxAiDepth)
- [ ] Connection-based movement (validate connections, enforce accessibility)
- [ ] Movement engine (travel time/energy cost, clock advancement)
- [ ] Restricted area gate (condition check + player choice)
- [ ] Random event trigger system (probability roll on location entry/travel)
- [ ] Day/night cycle (time periods affect availability, passed as variable to AI)

### Turn Structure
- [ ] Game loop: Player Action → Resolution → World Response → World Tick
- [ ] Scene system (triggered on NPC engagement or random event)
- [ ] World tick (clock advancement, off-screen NPC movement, resource updates)
- [ ] Time tracking (predictable travel costs, GM-determined scene time)

### Tracking Systems
- [ ] Clock system (create, tick, complete, visible/hidden)
- [ ] Faction reputation tracking with gameplay consequences
- [ ] NPC disposition tracking (numeric scale, named tiers)
- [ ] NPC tier promotion (background → passive → active → companion)

### Rest & Recovery
- [ ] Short rest (1 hour, partial energy restore, requires safe location)
- [ ] Long rest (8 hours, full restore, requires safe/owned location)
- [ ] Rest location validation (safe area check — UI exists, logic needed)

### Property System
- [ ] Property types (rented room → apartment → house → estate)
- [ ] Property purchase/rent mechanics
- [ ] Safe rest at owned property
- [ ] Item stash at property
- [ ] Property upgrades

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
- [ ] AI-generated locations (given parent skeleton + depth rules)
- [ ] AI-determined scene time costs (post-scene)
- [ ] AI-determined energy costs (post-scene)
- [ ] AI-generated NPC stat blocks (on tier promotion to Active)
- [ ] Transformation event narration (AI generates threshold event scenes)

## Phase 4: Multi-Agent System (v0.4)
**Goal:** Full agent architecture as designed.

- [ ] Orchestrator agent
- [ ] Narrator agent (split from v0.3 single agent)
- [ ] NPC agent (per-NPC system prompt swapping, pure narrative output)
- [ ] Quest agent (completion checks, reward distribution)
- [ ] GM Call agent (sets roll parameters, DCs, outcomes, advantage/disadvantage)
- [ ] State Analyst (2-shot: triage → update, runs per-character per-turn)
- [ ] Campaign Director / Event Manager agent (story pacing, threshold events, random events, clock management)
- [ ] Image agent (ComfyUI workflow routing)
- [ ] Agent communication protocol
- [ ] Context routing (each agent gets only relevant context)
- [ ] Hidden roll system (NPC-initiated rolls with narrative hints)
- [ ] Environment/random event system (code triggers, Campaign Director generates content)
- [ ] Conditioning pressure system (NPC-initiated opposed rolls for transformation)

## Phase 5: ComfyUI Integration (v0.5)
**Goal:** AI-generated images for scenes, NPCs, and player character.

- [ ] ComfyUI API integration (cloud endpoint)
- [ ] Image Agent implementation
- [ ] Scene background generation workflow
- [ ] NPC portrait generation workflow
- [ ] Player character portrait workflow
- [ ] Character full-body generation (transformation visualization)
- [ ] Inventory item art generation
- [ ] Quest cover art generation
- [ ] Faction cover art generation
- [ ] Status effect & ability icon generation (library-based)
- [ ] Image caching system
- [ ] Consistent character generation (reference images / IP-adapter)
- [ ] On-demand regeneration (user-requested)
- [ ] Transformation progression portraits (regenerate at each threshold)

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
- [ ] Reputation consequences (faction reactions, price changes, area access)
- [ ] Procedural events (code triggers category, AI generates content)

## Phase 8: Polish & Expansion (v0.8+)

- [ ] Multiple campaign support
- [ ] Character creation wizard
- [ ] UI themes / genre-specific theming
- [ ] Multiple LLM provider support
- [ ] Local ComfyUI support
- [ ] Expanded skill check systems
- [ ] Export/share campaigns
- [ ] Contract / bounty board system
- [ ] Companion loyalty & morale depth
- [ ] Property income generation (endgame)
- [ ] Additional factions: Alpha Omega Sorority, Goth faction, Cheerleader faction
- [ ] Additional factions: Beach Club, Hotel/Manor House, Night Club
- [ ] BimTech Industries HQ dungeon
- [ ] [Competitor] HQ dungeon

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
13. **Transformation is generic** — The transformation framework works for any faction. Each faction fills it with faction-specific content (thresholds, templates, conditioning sources). Only one transformation is active at a time.
14. **One dungeon at a time** — Player is locked into a faction's territory during active transformation. Must succumb or defeat to leave. No multi-faction juggling.
