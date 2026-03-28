# Game Mechanics

## Resolution System

D&D 5e d20 binary system with critical hits/misses.

### Outcome Tiers

| Tier | Condition | Description |
|------|-----------|-------------|
| Critical Fail | Natural 1 | Worst possible outcome |
| Fail | Below DC | Doesn't work, possible minor consequence |
| Success | Meets or exceeds DC | Works as intended |
| Critical Success | Natural 20 | Best possible outcome, bonus effect |

### Roll Flow

Every check follows the same 2-step pattern:

**Step 1 — GM Call (AI Agent)**

The GM Call agent reads the situation and sets parameters. This is the only AI step.

Input: scene context, acting character, intended action, relevant stats
Output:
```json
{
  "check_type": "deception",
  "ability": "CHA",
  "dc": 14,
  "advantage": false,
  "disadvantage": true,
  "disadvantage_reason": "Guard is already suspicious",
  "bonuses": [
    { "source": "Forged documents", "value": 2 }
  ],
  "outcomes": {
    "critical_fail": "The guard recognizes the forgery and calls for backup",
    "fail": "The guard doesn't buy it and asks you to wait",
    "success": "The guard waves you through after checking the papers",
    "critical_success": "The guard is so convinced he offers to escort you personally"
  },
  "visibility": "public"
}
```

**Step 2 — Resolution Engine (Pure Code)**

No AI. Calculates and resolves:

1. Roll d20 (or 2d20 for advantage/disadvantage)
2. Add ability modifier (from character stats)
3. Add proficiency bonus (if proficient in the skill)
4. Add any situational bonuses
5. Compare total to DC
6. Check for nat 1 / nat 20
7. Return result + matched outcome

```json
{
  "roll": 8,
  "modifier": 3,
  "proficiency": 2,
  "bonuses": 2,
  "total": 15,
  "dc": 14,
  "result": "success",
  "outcome_text": "The guard waves you through after checking the papers",
  "natural": false
}
```

### Roll Initiators

**Player-Initiated**
- Player declares action ("I try to bluff past the guard")
- Orchestrator routes to GM Call agent
- GM Call sets parameters and outcomes
- Resolution Engine rolls and resolves
- Result is always PUBLIC (player sees roll, DC, outcome)

**NPC-Initiated**
- NPC agent decides to attempt something ("I want to roll Insight on this person")
- GM Call agent sets parameters and outcomes
- Resolution Engine pulls NPC stats from their JSON, rolls and resolves
- Result visibility determined by GM Call:
  - **Hidden**: player sees NO roll UI, only a narrative hint of the outcome
  - **Partially revealed**: player gets a hint something happened ("The guard studies your face...")
  - **Public**: player sees the roll (e.g., NPC arm-wrestling the player)

**Environment-Initiated**
- Campaign Director triggers environmental checks (traps, hazards, ambient perception)
- GM Call agent sets parameters
- Resolution Engine resolves for all affected characters
- Visibility varies: trap = hidden until triggered, earthquake = public

### Hidden Roll → Narrative Hint Flow

```
NPC Agent: "I want to roll Insight against the player"
    ↓
GM Call (AI): Sets DC (player's passive Deception), defines outcomes
    Outcomes: { fail: "Can't read them", success: "Notices nervous tick" }
    Visibility: hidden
    ↓
Resolution Engine (code): Rolls d20 + NPC WIS mod + proficiency
    Result: success
    ↓
NPC Agent receives: "You noticed the player has a nervous tick when they mentioned the warehouse"
Player sees: "She tilts her head slightly, a faint smile crossing her lips."
Player UI: no dice roll shown
```

The player gets a narrative hint that *something* happened but doesn't know the mechanic behind it. Just like a real TTRPG where the GM rolls behind a screen.

### Advantage & Disadvantage

Standard 5e rules:
- **Advantage**: Roll 2d20, take the higher
- **Disadvantage**: Roll 2d20, take the lower
- They cancel each other out (any number of each = neither)

Determined by the GM Call agent based on scene context. The agent provides a reason for any advantage/disadvantage so the narrative can reference it.

### Ability Scores & Modifiers

Standard 5e:

| Score | Modifier |
|-------|----------|
| 1 | -5 |
| 2-3 | -4 |
| 4-5 | -3 |
| 6-7 | -2 |
| 8-9 | -1 |
| 10-11 | 0 |
| 12-13 | +1 |
| 14-15 | +2 |
| 16-17 | +3 |
| 18-19 | +4 |
| 20 | +5 |

### Skills

Standard 5e skill list mapped to abilities:

**STR:** Athletics
**DEX:** Acrobatics, Sleight of Hand, Stealth
**INT:** Arcana, History, Investigation, Nature, Religion
**WIS:** Animal Handling, Insight, Medicine, Perception, Survival
**CHA:** Deception, Intimidation, Performance, Persuasion

Proficiency: if proficient, add proficiency bonus to the roll.
Expertise: if expertise, add proficiency bonus × 2.

### Passive Checks

Passive score = 10 + all modifiers that normally apply to the check.

Used as DCs when an NPC rolls against the player (e.g., NPC Deception vs player's passive Insight), or for ambient perception (does the player notice the hidden door without actively searching).

## Character System

### Player Character

```json
{
  "name": "Alex Chen",
  "class": "Operative",
  "level": 3,
  "xp": { "current": 1200, "next_level": 2700 },
  "stats": {
    "STR": 12, "DEX": 16, "CON": 14, "INT": 10, "WIS": 13, "CHA": 11
  },
  "hp": { "current": 28, "max": 28 },
  "skills": {
    "stealth": { "proficient": true, "expertise": false },
    "investigation": { "proficient": true, "expertise": false },
    "deception": { "proficient": false, "expertise": false }
  },
  "proficiency_bonus": 2,
  "inventory": [],
  "gear": { "equipped": {}, "carrying": [] },
  "resources": { "currency": 500, "special": {} },
  "appearance": {},
  "goals_active_quests": "→ see quests.json",
  "status_effects": [],
  "current_injuries": []
}
```

### Character Progression

D&D 5e leveling:
- XP awarded by Quest Agent (quest completion) and Campaign Director (milestone events)
- Level up triggers stat increases and proficiency bonus scaling
- Class features / abilities — TBD (depends on how deep we go with classes)

### NPC Stat Blocks

Full 5e stat block per NPC (see architecture.md for full NPC JSON structure).
- Generated when NPC is created (can be AI-assisted for balancing)
- Stats only loaded by Resolution System and State Analyst
- NPC Agent never sees stats

## Economy System

Code-driven. No AI needed for transactions.

- Currency tracking (wallet / stash)
- Item prices defined in item database
- Buy/sell/trade/barter transactions
- Economy can be influenced by world events (Campaign Director can shift prices)
- Theft / loss tracked via State Analyst

## Faction System

- Faction definitions (name, description, goals, hierarchy)
- Player reputation per faction (numeric scale, e.g., -100 to +100 with named tiers)
- NPC faction memberships and ranks
- Faction relationships with each other (allied, neutral, hostile)
- Faction reputation changes triggered by: quest completion, NPC interactions, player actions (via State Analyst)

## Clock System

Borrowed from Blades in the Dark. Tracks progress toward events that happen with or without the player.

```json
{
  "id": "clock-001",
  "name": "Syndicate Investigation",
  "type": "faction_timeline",
  "segments_total": 6,
  "segments_filled": 2,
  "tick_trigger": "time_passes",
  "on_complete": "Syndicate raids the warehouse district",
  "visible_to_player": false
}
```

Types:
- **Faction timeline**: faction progresses toward a goal
- **Threat countdown**: bad thing approaching (e.g., building about to collapse)
- **Quest timer**: deadline for a quest
- **Encounter**: progress toward a random/scheduled encounter

Ticked by: Campaign Director (when time passes or events occur). Some clocks are visible to the player (quest deadlines), others are hidden (faction plots).

## Social & Influence Mechanics

### NPC Disposition

Numeric scale per relationship (-100 to +100):

| Range | Label |
|-------|-------|
| -100 to -61 | Hostile |
| -60 to -21 | Unfriendly |
| -20 to 20 | Neutral |
| 21 to 60 | Friendly |
| 61 to 100 | Loyal |

Updated by State Analyst based on scene interactions.

### Relationship Web

All known NPC-to-NPC and NPC-to-player relationships tracked in their respective JSON files.

UI component: visual graph showing known characters, with lines colored/labeled by disposition. "Unknown" nodes for characters not yet encountered but referenced by others.

### Deception

NPCs can actively deceive the player (and each other). Tracked in relationship data:
```json
"deception_active": true,
"deception_details": "Pretending to be an ally while reporting to the Syndicate"
```

Player can attempt to detect via Insight checks (or passive Insight vs NPC Deception).

## Information Discovery

### Clues & Hints

Planted by Campaign Director into scenes, NPC dialogue, and environment descriptions.
- Active search: player declares "I search the room" → Perception/Investigation check
- Passive: if player's passive Perception meets threshold, Narrator weaves hint into description
- NPC-delivered: NPCs share info based on disposition, goals, and knowledge

### Navigation & Mapping

- World state tracks known locations
- Travel between locations consumes time (Clock System ticks)
- New locations discovered through exploration, NPC info, or quest progression
- UI: map component showing discovered locations and connections (future phase)

## Reward System

Quest completion rewards defined in quest data:

```json
{
  "quest_id": "quest-005",
  "rewards": {
    "xp": 300,
    "currency": 200,
    "items": ["item-encrypted-drive"],
    "reputation": [
      { "faction": "police", "change": 10 },
      { "faction": "syndicate", "change": -15 }
    ],
    "unlock": "New area: Underground Market"
  }
}
```

Rewards distributed by Quest Agent on completion. Multiple reward types can stack.
