# Architecture Overview

## Tech Stack

- **Frontend:** Electron + Next.js + React + Tailwind CSS
- **Backend:** Next.js API routes (within Electron) + Python/FastAPI microservice for ComfyUI
- **Persistence:** JSON files (no database)
- **AI:** Multi-LLM support (Claude primary, others later)
- **Image Generation:** ComfyUI API (cloud initially, local later), multiple workflows
- **Streaming:** SSE or WebSocket for narrative text streaming

## Save File Structure

```
/saves
  /campaign-001
    player.json          # stats, skills, proficiencies, class, inventory, appearance, gear, resources
    npcs/
      npc-001.json       # per-NPC: full stat block, profile, personality, goals, relationships, history summary
      npc-002.json
    quests.json          # quest log with status, rewards, completion conditions
    world-state.json     # time, date, location, scene info
    factions.json        # faction definitions, player reputation, NPC memberships
    economy.json         # currency, prices, trade state
    clocks.json          # faction timelines, threat countdowns, quest timers
    chat-history.json    # compressed/summarized conversation
    session-summary.json # rolling summaries of past sessions
    images/              # cached generated images
/lorebook
  persistent/            # always-active lore entries
    world-rules.json
    geography.json
  contextual/            # RAG-retrieved based on scene context
    merchants-guild.json
    old-quarter.json
```

## Multi-Agent System

The core architectural decision: **no monolithic AI calls**. Each agent has a focused role and bounded context.

```
┌─────────────────────────────────────────────────┐
│                 ORCHESTRATOR                      │
│  Routes player input to the right agents.        │
│  Determines which agents need to act per turn.   │
└──┬──────┬──────┬──────┬──────┬──────────────────┘
   │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼
┌──────┐┌──────┐┌──────┐┌──────┐┌──────────┐
│ NAR- ││ NPC  ││QUEST ││IMAGE ││ CAMPAIGN │
│RATOR ││AGENT ││AGENT ││AGENT ││ DIRECTOR │
└──────┘└──────┘└──────┘└──────┘└──────────┘

        RUNS INDEPENDENTLY EVERY TURN:
┌──────────────┐  ┌──────────────┐
│    STATE      │  │  RESOLUTION  │
│   ANALYST     │  │   SYSTEM     │
└──────────────┘  └──────────────┘
```

### Agent Roles

**Orchestrator**
- Receives player input + current game state summary
- Decides which agents need to act (narrator doesn't fire every turn)
- Routes context to each agent (only what they need)
- Assembles final response from agent outputs
- Does NOT handle state analysis or resolution — those are independent

**Narrator**
- Describes scenes, environments, transitions
- Only triggered when scene description is needed (not during pure NPC dialogue)
- Input: current location, time, recent summary, player action, relevant lore
- Output: structured { narrative, scene_changed, new_location, time_advance, image_needed, image_context }

**NPC Agent**
- Single agent that swaps system prompts per NPC
- System prompt assigned at NPC creation (even mundane NPCs have goals/personality)
- Input: NPC system prompt + conversation with THIS NPC only (summarized) + relevant world context
- Output: pure narrative/dialogue (NO structured data — that's the State Analyst's job)
- NPCs have their own goals, relationships with player AND other NPCs
- Player is NOT treated as "chosen one" — NPCs have their own agendas
- NPCs can independently decide to initiate rolls ("I want to roll Insight on this person")
- NPC stat blocks are NOT passed to the NPC agent (keeps prompts lean)

**Quest Agent**
- Checks completion conditions, updates quest states, assigns new quests
- Manages quest rewards (XP, items, currency, reputation)
- Runs AFTER narrative resolution, not during
- Input: current quests + recent events summary
- Output: structured { completed, updated, new_quests, rewards, notifications }

**Image Agent**
- Translates descriptions into ComfyUI API calls
- Multiple workflows: character portraits, scene backgrounds, NPC introductions
- Manages image caching (consistent characters unless major physical changes)
- Only triggers on: new scene, NPC introduction, user request

**Campaign Director**
- The "GM brain" — has campaign-level objectives and plot threads
- Maintains story pacing, ensures things don't get stuck
- Can nudge events, introduce complications, trigger encounters
- Has its own plans/objectives similar to how a real GM prepares a campaign
- Drives off-screen NPC progression when time passes
- Initiates environment rolls (traps, hazards, ambient events)
- Plants clues and hints for the player to discover
- Manages clocks/timers (advances faction timelines, threat countdowns)

**State Analyst (independent — runs every turn)**
- Runs independently after each NPC acts (per-NPC, not batched)
- Also runs for the player character
- 2-shot process:
  - Shot 1 (AI): "Given this scene, which fields changed for this character?" → returns list of changed categories
  - Shot 2 (AI): "Update these specific fields" → returns precise field-level changes
- Receives FULL current state for all characters present in the scene
- Only writes changes for the character being analyzed
- Handles: HP, disposition, relationships, goals, injuries, status effects, inventory changes, etc.
- NPC stat blocks ARE passed to the State Analyst (needs full picture to assess changes)

**Resolution System (independent — triggered on demand)**
See: [Game Mechanics — Resolution System](game-mechanics.md#resolution-system)

### Code Systems (Not AI Agents)

**Lorebook System**
- NOT an AI agent — it's a retrieval system
- Persistent entries: always injected into relevant agent contexts
- Contextual entries: RAG-based retrieval using current scene context (location, NPCs present, keywords, quest state)
- Entries stored as JSON files in /lorebook directory

**Mechanics Engine**
- Pure code: dice rolling, modifier calculation, DC comparison
- No AI needed for math — AI only involved in GM Call (setting parameters)

**Clock System**
- Tracks faction timelines, threat countdowns, quest deadlines, encounter timers
- Code-driven tick system (advances when time passes)
- Campaign Director reads clock state to make pacing decisions

**Economy Engine**
- Currency tracking, item prices, trade transactions
- Code-driven, no AI needed

**Social Engine**
- Tracks NPC dispositions, faction reputation, relationship web
- Code-driven tracking, AI-informed updates (via State Analyst)

## Context Management

```
Last 5-10 turns    → kept verbatim (recent context)
Older turns        → summarized into "session summary"
Very old turns     → compressed into "campaign summary"
```

A background summarization task periodically compresses older turns. Each agent receives only the summary depth it needs.

NPC history: when an NPC leaves a scene, their conversation history gets summarized and stored in their JSON. Next encounter loads the summary, not the full log.

## NPC System

Each NPC gets their own JSON file with full data:

```json
{
  "id": "npc-001",
  "name": "Marcus Vale",
  "system_prompt": "You are Marcus Vale, a cautious information broker who works the warehouse district...",
  "personality": { "traits": ["cautious", "analytical"], "speech_patterns": "Speaks in short, clipped sentences", "quirks": "Always counting coins" },
  "goals": [
    { "goal": "Find the stolen artifact", "priority": "high", "progress": "Has a lead on the buyer" },
    { "goal": "Pay off debt to the Syndicate", "priority": "critical", "progress": "Owes 5000, has 2000" }
  ],
  "relationships": {
    "player": { "disposition": 65, "notes": "Helped me once, cautious trust", "deception_active": false },
    "npc-003": { "disposition": -20, "notes": "Rival, competing for same goal" }
  },
  "knowledge": ["Knows about the underground market", "Doesn't know player's real identity"],
  "stats": {
    "STR": 10, "DEX": 14, "CON": 12, "INT": 16, "WIS": 11, "CHA": 8
  },
  "skills": {
    "investigation": { "proficient": true },
    "arcana": { "proficient": true },
    "history": { "proficient": true },
    "deception": { "proficient": false }
  },
  "proficiency_bonus": 2,
  "hp": { "current": 28, "max": 28 },
  "level": 5,
  "class": "commoner",
  "appearance": {
    "face": "Angular features, dark stubble",
    "hair": "Short brown, receding",
    "body": "Lean, average height",
    "notable": "Missing left ring finger"
  },
  "history_summary": "Met player at the docks in session 3. Traded info for a favor...",
  "last_seen": { "location": "Warehouse District", "time": "Day 5, 22:00" },
  "faction": "Merchants Guild",
  "faction_rank": "associate",
  "status": "alive",
  "current_injuries": [],
  "status_effects": []
}
```

**Key principle:** NPC Agent only sees system_prompt + personality + goals + relationships + knowledge + conversation history. Stats/skills are only pulled by the Resolution System when a roll happens. State Analyst sees everything.

## Lorebook System

Two types of lore entries:

**Persistent (always active):**
```json
{
  "id": "lore-world-001",
  "title": "World Rules — Modern Setting",
  "type": "persistent",
  "content": "The year is 2024. Technology level is modern-day Earth...",
  "inject_into": ["narrator", "npc", "campaign_director"]
}
```

**Contextual (RAG-retrieved):**
```json
{
  "id": "lore-ctx-001",
  "title": "The Merchants Guild",
  "type": "contextual",
  "tags": ["merchants guild", "trade district", "commerce", "smuggling"],
  "trigger_npcs": ["npc-001", "npc-005"],
  "trigger_locations": ["trade-district", "guild-hall"],
  "content": "The Merchants Guild controls all legal trade in the district...",
  "priority": "high"
}
```

Retrieval: when building context for any agent, the lorebook system checks current location, NPCs present, active quests, and recent keywords against contextual entries. Matching entries are injected into the agent's context alongside persistent entries.

## Physical Appearance Tracker

Structured JSON per body part/slot. Updated incrementally by State Analyst (only changed fields). Feeds into Image Agent for portrait generation.

```json
{
  "face": "Sharp jawline, scar across left cheek",
  "hair": "Black, shoulder-length, tied back",
  "body": "Athletic build, tanned skin",
  "notable": "Glowing blue eyes (cursed)",
  "current_injuries": ["bandaged right hand"],
  "gear_visible": ["leather jacket", "shoulder holster"]
}
```

## Key Design Principles

1. **Narrator doesn't fire every turn.** If an NPC is speaking, only the NPC agent responds.
2. **Incremental updates only.** State Analyst writes only changed fields. No regenerating entire sheets.
3. **Bounded context per agent.** Each agent gets only what it needs. No full chat history dumps.
4. **NPC agents produce pure narrative.** No structured output from NPCs — the State Analyst handles data extraction separately.
5. **Structured output from system agents.** Narrator, Quest Agent, GM Call — these return structured JSON.
6. **Stats are lazy-loaded.** NPC stat blocks only passed to Resolution System and State Analyst, never to the NPC agent itself.
7. **Off-screen progression.** Campaign Director + NPC agents simulate what happened while the player was away.
8. **Hidden information is real.** NPC rolls can be hidden from the player. Results shown as narrative hints only.
9. **Code handles math, AI handles judgment.** Dice rolls, modifier calc, DC comparison = code. Setting the DC, determining conditions = AI.
