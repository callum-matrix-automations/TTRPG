# Map Implementation — Hierarchical Spatial Graph

## Overview

The world is a **hierarchical spatial graph with mixed authorship**. The grand-scale structure is hand-crafted by the player/designer. As locations become more granular, the AI takes over generation. The game engine enforces movement rules — the AI cannot bypass spatial constraints.

---

## Depth Levels

Every location exists at one of five depth levels. Depth determines the zoom level on the map and how the location renders.

| Depth | What It Represents | Typical Authorship | Map View |
|---|---|---|---|
| **world** | Top-level regions/areas | Always hand-crafted | World map with district nodes |
| **district** | Major areas within the world | Always hand-crafted | District overview with zone nodes |
| **zone** | Points of interest within a district | Hand-crafted core, AI can add siblings if allowed | Zone layout with building nodes |
| **building** | Specific locations within a zone | Mixed — hand-crafted important ones, AI-generated others | Building floor plan with room nodes |
| **room** | Individual spaces within a building | Mostly AI-generated | Room view with exit connections |

### Example Hierarchy

```
World: The City
├── District: City Centre (handcrafted)
│   ├── Zone: Casino (handcrafted)
│   │   ├── Building: Casino Floor (handcrafted)
│   │   ├── Building: Hotel Wing (handcrafted)
│   │   └── Building: Shopping District (handcrafted)
│   │       ├── Room: Clothing Store (AI-generated)
│   │       │   ├── Sub: Main Floor (AI-generated)
│   │       │   ├── Sub: Backroom (AI-generated)
│   │       │   └── Sub: Changing Room (AI-generated)
│   │       ├── Room: Jeweler (AI-generated)
│   │       └── Room: ??? (AI can generate more)
│   ├── Zone: Salon (handcrafted)
│   └── Zone: Night Club (handcrafted)
├── District: University District (handcrafted)
│   └── ...
└── District: Docks (handcrafted)
    └── ...
```

---

## Data Structure

### Location Node

```typescript
type LocationDepth = "world" | "district" | "zone" | "building" | "room";

type Connection = {
  targetId: string;              // ID of the connected location
  travelMinutes: number;         // time cost to traverse (0 for instant/within-building)
  direction: string;             // "north", "through the door", "down the stairs", "exit to Shopping District"
  accessible: boolean;           // can the player use this connection right now?
  accessCondition: string | null; // "locked:key-backroom", "skill:perception:15", "reputation:faction:friendly", null = always open
  discovered: boolean;           // has the player found this exit? (false = hidden from UI)
};

type Location = {
  id: string;
  name: string;
  depth: LocationDepth;
  parentId: string | null;       // what location contains this one (null = top level)

  // Authorship & AI generation rules
  authored: "handcrafted" | "ai-generated";
  aiCanGenerateChildren: boolean;   // can AI create nodes INSIDE this location?
  aiCanGenerateSiblings: boolean;   // can AI create nodes ALONGSIDE this location (same depth, same parent)?
  maxAiDepth: number;               // max levels of AI generation below this (0 = terminal, no deeper)

  // Spatial connections
  connections: Connection[];

  // Properties
  description: string;
  faction: string | null;
  factionColor: string | null;
  dangerLevel: 0 | 1 | 2 | 3;     // 0=safe, 1=low, 2=moderate, 3=high
  restricted: {
    condition: string;              // "reputation:merchants_guild:friendly", "quest:quest-001:active", "time:after:22:00"
    when: string;                   // "always", "night", "day"
  } | null;
  availableHours: string | null;    // null = always open, "06:00-22:00" = limited hours
  npcsPresent: string[];            // NPC IDs currently at this location
  discovered: boolean;              // has the player been here / knows it exists?
  playerIsHere: boolean;            // is the player currently at this location?

  // Map rendering
  x: number;                        // position within parent's map view (percentage 0-100)
  y: number;
};
```

---

## AI Generation Rules

### Downward Generation (Children)

Controlled by `aiCanGenerateChildren` and `maxAiDepth` on the **parent** node.

- `aiCanGenerateChildren: true` + `maxAiDepth > 0` → AI can create child locations inside this one
- Each generated child inherits `maxAiDepth - 1` from the parent
- When `maxAiDepth` reaches 0, no further downward generation is possible

### Lateral Generation (Siblings)

Controlled by `aiCanGenerateSiblings` on the **parent** node (the node that contains the siblings).

- If the parent has `aiCanGenerateSiblings: true`, the AI can create new nodes at the same depth, under the same parent
- New siblings are connected to at least one existing sibling
- The parent's `maxAiDepth` does NOT decrease for lateral generation (siblings are at the same depth, not deeper)

### Generation Inheritance

When the AI generates a new node, the node's AI rules are derived from its parent:

```
New node's maxAiDepth = parent's maxAiDepth - 1
New node's aiCanGenerateChildren = (new maxAiDepth > 0)
New node's aiCanGenerateSiblings = parent's aiCanGenerateSiblings (inherited)
```

### Example: Generation Rules in Practice

```
Shopping District (handcrafted)
  aiCanGenerateChildren: true
  aiCanGenerateSiblings: false     ← AI can't create siblings of Shopping District
  maxAiDepth: 3                    ← AI can go 3 levels deep from here

  └── Clothing Store (AI-generated, depth = building)
      aiCanGenerateChildren: true
      aiCanGenerateSiblings: true  ← AI CAN create more stores (sibling generation)
      maxAiDepth: 2                ← inherited: 3 - 1 = 2

      └── Main Floor (AI-generated, depth = room)
          aiCanGenerateChildren: true
          aiCanGenerateSiblings: true  ← AI CAN create more rooms
          maxAiDepth: 1                ← inherited: 2 - 1 = 1

          └── Storage Closet (AI-generated, depth = sub-room)
              aiCanGenerateChildren: false  ← maxAiDepth would be 0
              aiCanGenerateSiblings: true   ← AI CAN still create sibling sub-rooms
              maxAiDepth: 0                 ← terminal depth
```

### Control Matrix

| Location | Handcrafted? | AI Children? | AI Siblings? | Max AI Depth | Notes |
|---|---|---|---|---|---|
| The City | Yes | No | No | 0 | Districts are all hand-crafted |
| City Centre | Yes | Yes | No | 0 | Zones inside are hand-crafted, but zones can have AI content |
| Casino | Yes | Yes | No | 2 | Casino sections are hand-crafted, but rooms within can be AI |
| Shopping District | Yes | Yes | Yes | 3 | Stores are AI-generated, store interiors are AI-generated |
| Casino Floor | Yes | Yes | No | 1 | Rooms within casino floor can be AI, but can't branch sideways |

---

## Connection System

### How Connections Work

Connections define which locations a player can move to directly. **If no connection exists, the player cannot move between those locations** — regardless of what the AI narrates.

### Connection Rules

1. **Every location must connect to at least one other location** (no orphan nodes)
2. **Every generated room must connect to at least one existing room** in the same parent
3. **Connections are bidirectional by default** — if A connects to B, B connects to A
4. **One-way connections are allowed** for special cases (trap doors, locked doors from one side, one-way teleporters)
5. **Connections can be hidden** (`discovered: false`) — the player doesn't see the exit until they find it (via Perception check, quest, etc.)
6. **Connections can be locked** (`accessible: false`) — the player sees the exit but can't use it until a condition is met

### Connection Accessibility Conditions

The `accessCondition` field uses a structured string format:

| Format | Example | Meaning |
|---|---|---|
| `null` | — | Always accessible |
| `locked:key-id` | `locked:key-backroom` | Requires a specific key item in inventory |
| `skill:skillname:dc` | `skill:perception:15` | Requires passing a skill check |
| `reputation:faction:tier` | `reputation:merchants_guild:friendly` | Requires minimum faction reputation |
| `quest:quest-id:status` | `quest:quest-001:active` | Requires a quest to be in a specific state |
| `time:after:HH:MM` | `time:after:22:00` | Only accessible after a certain time |
| `time:before:HH:MM` | `time:before:06:00` | Only accessible before a certain time |

### AI-Generated Connections

When the AI generates new rooms, it **must** provide the connection graph as part of its output. The structured output format:

```json
{
  "generated_locations": [
    {
      "id": "clothing-main",
      "name": "Main Floor",
      "description": "Racks of clothing line the walls...",
      "connections": [
        { "targetId": "clothing-store", "direction": "exit to Shopping District", "travelMinutes": 0 },
        { "targetId": "clothing-back", "direction": "unmarked door behind the counter", "travelMinutes": 0 },
        { "targetId": "clothing-changing", "direction": "curtained area to the right", "travelMinutes": 0 }
      ]
    },
    {
      "id": "clothing-back",
      "name": "Backroom",
      "description": "A cramped storage room. Boxes of unsorted clothing line the walls.",
      "connections": [
        { "targetId": "clothing-main", "direction": "back through the door", "travelMinutes": 0 }
      ]
    },
    {
      "id": "clothing-changing",
      "name": "Changing Room",
      "description": "A small area with a mirror and curtain dividers.",
      "connections": [
        { "targetId": "clothing-main", "direction": "back through the curtain", "travelMinutes": 0 }
      ]
    }
  ]
}
```

**Key constraint:** The Backroom connects to Main Floor but NOT to Changing Room. The player in the Backroom can only go back to Main Floor. To reach the Changing Room, they must go Backroom → Main Floor → Changing Room.

The game engine validates this. The AI cannot say "you walk through the wall into the Changing Room" — the connection doesn't exist.

---

## Movement & Navigation

### Player Movement Flow

```
1. Player sees current location + available exits (discovered, accessible connections)
2. Player selects a destination
3. Engine checks:
   a. Does a valid connection exist?
   b. Is the connection accessible? (check conditions)
   c. Is the connection discovered?
4. If valid:
   a. Calculate travel time and energy cost
   b. Show travel preview (time, energy, danger)
   c. Player confirms
   d. Execute: update player location, deduct time/energy, roll random event check
5. If not valid:
   a. Show why (locked, restricted, undiscovered)
   b. Offer alternatives if applicable
```

### Travel Between Depth Levels

Moving between depth levels works through connections, same as moving within a depth level:

- **Entering a building**: Connection from zone-level node to building's entrance room
- **Exiting a building**: Connection from building's entrance back to zone-level parent
- **Zooming in on the map**: When you travel to a node that has children, the map zooms in to show the interior

### Travel Time Rules

| Movement Type | Time Cost | Energy Cost |
|---|---|---|
| Room to room (same building) | 0 min (instant) | 0 |
| Building to building (same zone) | 5-15 min | 0 |
| Zone to zone (same district) | 10-30 min | 0-1 |
| District to district | 30-120 min | 2-5 |

### Random Event Checks

Random event probability on movement:

| Condition | Base Probability |
|---|---|
| Moving within safe area | 5% |
| Moving within moderate danger area | 15% |
| Moving within high danger area | 25% |
| Entering restricted area | +20% |
| Night time | +10% |
| Low HP/energy | +5% |

When triggered: code determines event category (combat/social/discovery/environmental), Campaign Director generates the content.

---

## Map UI Design

### Zoom-by-Depth Navigation

The map renders differently at each depth level. The player navigates by zooming in (entering a location) and out (exiting to parent).

| View | What Renders | Interaction |
|---|---|---|
| **World view** | District nodes on a stylized overview map | Click district to zoom in |
| **District view** | Zone nodes within the district | Click zone to zoom in, or click a zone to travel |
| **Zone view** | Building/area nodes within the zone | Click building to zoom in or enter |
| **Building view** | Room nodes as a floor-plan style layout | Click room to move to it |
| **Room view** | Current room description + exit list | Click exit to move through it |

### Map Panel UI

```
┌─────────────────────────────┐
│ 🗺 World Map    [← Back]    │  ← breadcrumb navigation
├─────────────────────────────┤
│                             │
│    [Visual map of current   │  ← rendered nodes + connections
│     depth level]            │     at the current zoom
│                             │
├─────────────────────────────┤
│ 📍 Current: Main Floor      │  ← where the player is
│ ↗ Backroom (through door)   │  ← available exits
│ ↗ Changing Room (curtain)   │
│ ↗ Shopping District (exit)  │
├─────────────────────────────┤
│ [Travel Preview]            │  ← when an exit is selected
│ Time: 0 min | Energy: 0    │
│ [Go]                        │
└─────────────────────────────┘
```

### Breadcrumb Navigation

The map shows a breadcrumb trail so the player always knows where they are in the hierarchy:

```
The City > City Centre > Casino > Shopping District > Clothing Store > Main Floor
```

Clicking any breadcrumb level zooms the map to that depth.

---

## AI Context for Generation

When the AI is asked to generate new locations, it receives:

### For generating children (rooms inside a building):

```json
{
  "parent": { "id": "clothing-store", "name": "Clothing Store", "description": "..." },
  "existing_siblings": [
    { "id": "clothing-main", "name": "Main Floor", "connections": [...] }
  ],
  "grandparent": { "id": "shopping-district", "name": "Shopping District" },
  "nearby_locations": ["Jeweler", "Food Court"],
  "depth": "room",
  "max_ai_depth_remaining": 1,
  "can_generate_siblings": true,
  "generation_rules": "Generate 1-3 rooms. Each must connect to at least one existing room. Provide connection directions."
}
```

### For generating siblings (new stores alongside existing ones):

```json
{
  "parent": { "id": "shopping-district", "name": "Shopping District", "description": "..." },
  "existing_siblings": [
    { "id": "clothing-store", "name": "Clothing Store" },
    { "id": "jeweler", "name": "Jeweler" }
  ],
  "depth": "building",
  "max_ai_depth_remaining": 2,
  "generation_rules": "Generate 1 new store. Must connect to the Shopping District main area. Should be thematically consistent with existing stores."
}
```

---

## Responsibility Split

| Responsibility | Owner |
|---|---|
| Defining hub/district structure | Player / campaign setup (handcrafted) |
| Generating spoke/building/room layouts | AI (on player request or exploration) |
| Defining connections between generated nodes | AI (structured output) |
| Validating connections exist before allowing movement | Game engine (code) |
| Enforcing AI depth limits | Game engine (code) |
| Enforcing access conditions (locks, reputation, time) | Game engine (code) |
| Describing locations narratively | AI (narrator agent) |
| Tracking discovered/undiscovered state | Game engine (code) |
| Rolling random events on movement | Game engine (code) |
| Deciding what happens in random events | AI (Campaign Director) |
| Moving NPCs between locations | AI (Campaign Director for off-screen, NPC agent for in-scene) |

---

## Implementation Phases

### Phase 1 (Current — UI Placeholder)
- Placeholder map data with hand-crafted hubs and spokes
- Visual map with zoomable depth levels
- Location list with connections and travel preview
- Breadcrumb navigation

### Phase 2 (Game Engine)
- Movement engine enforcing connection graph
- Travel time/energy deduction
- Random event trigger on movement
- Restricted area gate checks
- Location discovery tracking

### Phase 3-4 (AI Integration)
- AI location generation (structured output for nodes + connections)
- AI depth limit enforcement
- Campaign Director generates random event content
- NPC location tracking and movement
- Dynamic location generation on player exploration
