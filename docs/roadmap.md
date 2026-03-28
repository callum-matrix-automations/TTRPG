# Development Roadmap

## Phase 1: Foundation (v0.1) — UI Shell + Project Scaffold
**Goal:** Electron app running with all UI panels laid out. No AI, no game logic — just the interface.

- [ ] Electron + Next.js project setup
- [ ] Main layout with resizable/collapsible panels
- [ ] Central narrative panel (with placeholder text, streaming-ready)
- [ ] Left sidebar: character sheet (stats, attributes, skills, appearance)
- [ ] Right sidebar: NPC panel (portrait, stats when relevant)
- [ ] Inventory panel
- [ ] Gear/equipment panel
- [ ] Quest log panel (with reward previews)
- [ ] Time & date display
- [ ] Clock/timer display (visible clocks only)
- [ ] Resources / currency display
- [ ] Faction reputation display
- [ ] Scene/background image area
- [ ] Dice roll/skill check UI (roll animation, result display, hidden roll hints)
- [ ] Player input area (free text + structured options)
- [ ] Relationship web visualization (placeholder)
- [ ] Basic theming system (CSS variables, dark mode default)
- [ ] Placeholder data loaded from JSON files

## Phase 2: Game Engine Core (v0.2)
**Goal:** Game mechanics working without AI. Dice rolls, stat checks, inventory, economy.

- [ ] Resolution Engine (d20 + modifiers + advantage/disadvantage + bonuses)
- [ ] 4-tier outcome system (crit fail / fail / success / crit success)
- [ ] Passive check calculations
- [ ] Stat/attribute system (STR, DEX, CON, INT, WIS, CHA + derived modifiers)
- [ ] Skill system (full 5e skill list, proficiency, expertise)
- [ ] Inventory management (add, remove, equip, use)
- [ ] Economy engine (currency, buy/sell/trade)
- [ ] Clock system (create, tick, complete, visible/hidden)
- [ ] Faction reputation tracking (numeric scale, named tiers)
- [ ] NPC disposition tracking (numeric scale, named tiers)
- [ ] Character leveling (XP thresholds, level up, proficiency bonus scaling)
- [ ] Time/date tracking system
- [ ] Save/load system (JSON file read/write)
- [ ] Game state manager (central state that all systems read/write)

## Phase 3: AI Integration — Single Agent (v0.3)
**Goal:** Basic AI narrative working. One AI agent as proof of concept before splitting into multi-agent.

- [ ] Claude API integration (streaming responses)
- [ ] Basic narrator agent with structured output
- [ ] Player input → AI response → state update loop
- [ ] Context window management (message history with limits)
- [ ] Basic system prompt architecture
- [ ] Lorebook system — persistent entries (always injected)
- [ ] Lorebook system — contextual entries (RAG retrieval by scene context)

## Phase 4: Multi-Agent System (v0.4)
**Goal:** Full agent architecture as designed.

- [ ] Orchestrator agent
- [ ] Narrator agent (split from v0.3 single agent)
- [ ] NPC agent (per-NPC system prompt swapping, pure narrative output)
- [ ] Quest agent (completion checks, reward distribution)
- [ ] GM Call agent (sets roll parameters, DCs, outcomes, advantage/disadvantage)
- [ ] State Analyst (2-shot: triage → update, runs per-character per-turn)
- [ ] Campaign Director agent (story pacing, clue planting, environment rolls, clock management)
- [ ] Image agent (ComfyUI workflow routing)
- [ ] Agent communication protocol
- [ ] Context routing (each agent gets only relevant context)
- [ ] Hidden roll system (NPC-initiated rolls with narrative hints)
- [ ] Environment roll system (Director-initiated checks)

## Phase 5: ComfyUI Integration (v0.5)
**Goal:** AI-generated images for scenes, NPCs, and player character.

- [ ] ComfyUI API integration (cloud endpoint)
- [ ] Image Agent implementation
- [ ] Scene background generation workflow
- [ ] NPC portrait generation workflow
- [ ] Player character portrait workflow
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
- [ ] Faction timeline progression (clocks tick while player is away)
- [ ] World event system (things happen without player involvement)
- [ ] NPC deception mechanics (active deception tracking, detection via checks)
- [ ] Relationship web UI (visual graph of known characters and connections)

## Phase 8: Polish & Expansion (v0.8+)
- [ ] Multiple campaign support
- [ ] UI themes / genre-specific theming
- [ ] Multiple LLM provider support
- [ ] Local ComfyUI support
- [ ] Navigation / map UI
- [ ] Class/role system with features
- [ ] Expanded skill check systems
- [ ] Export/share campaigns
- [ ] Settings/configuration UI

## Design Principles (Apply at Every Phase)

1. **Incremental updates** — Never regenerate entire data structures. Only update changed fields.
2. **Bounded context** — No agent ever gets the full chat history. Summaries + relevant data only.
3. **NPC agents produce pure narrative** — State changes extracted separately by the State Analyst.
4. **System agents return structured JSON** — Narrator, Quest, GM Call, State Analyst use structured output.
5. **Code handles math, AI handles judgment** — Resolution Engine is code. GM Call is AI.
6. **Separation of concerns** — Game engine logic is pure code, not AI-dependent.
7. **JSON-first persistence** — All game state in readable JSON files. No database.
8. **Theme-ready** — CSS variables from day one so theming is a config change, not a rewrite.
9. **Hidden information is real** — NPC rolls can be invisible to the player. The system respects information asymmetry.
10. **Stats are lazy-loaded** — Full NPC stat blocks exist but only pass to systems that need them.
