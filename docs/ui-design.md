# UI Design — Surface Audit & Implementation Plan

Full mapping of every UI surface needed across all phases, what currently exists, and what needs to be built.

---

## Current State (Phase 1 — Built)

| Component | File | What It Does |
|---|---|---|
| GameLayout | `GameLayout.tsx` | Resizable 3-panel layout with collapsible icon strip sidebars |
| TopBar | `TopBar.tsx` | Time, date, location, weather, clocks (with tooltips), currency |
| CharacterSheet | `CharacterSheet.tsx` | Portrait, name/class/level, HP/XP bars, collapsible drawers for attributes, skills, abilities, status effects, appearance. Attribute popups show modifier breakdown (portaled). |
| InventoryPanel | `InventoryPanel.tsx` | Clickable item list with rarity colors, equipped badges, quantity |
| ItemModal | `ItemModal.tsx` | Item detail view: image, description, effects, attributes. Animated open/close. |
| GearPanel | `GearPanel.tsx` | 2-column equipment slot grid, clickable to open slot modal |
| EquipmentSlotModal | `EquipmentSlotModal.tsx` | Equip/unequip compatible items per slot. Animated open/close. |
| NarrativePanel | `NarrativePanel.tsx` | Scene image, narrative entries (narration/NPC/player/system), dice result card, action suggestions, text input |
| PartyPanel | `PartyPanel.tsx` | Left sidebar: companion list with expandable character sheets (HP, stats, skills, abilities, gear, loyalty) |
| NpcPanel | `NpcPanel.tsx` | Right sidebar: tiered NPC display. Portrait selector for active/passive NPCs, collapsible background section. Active NPCs show observed capabilities and threat impression. |
| QuestLog | `QuestLog.tsx` | Quest cards with objectives, completion status, reward previews |
| FactionReputation | `FactionReputation.tsx` | Reputation bars per faction with tier labels |
| RelationshipWeb | `RelationshipWeb.tsx` | SVG node graph with connection lines (basic placeholder) |

### Known Gaps in Current Build

- `playerCharacter.savingThrows` — data exists but never displayed
- `currentNpc.status` ("alive") — data exists but never displayed
- Only 8 of 18 D&D 5e skills are in placeholder data
- Quest cards have `cursor-pointer` but no click handler / detail modal
- Dice roll result is static — no animation
- Narrative input/action buttons have no handlers
- Equip/unequip only logs to console (no state mutation)

---

## NPC Tier System — UI Specifications

NPCs are displayed differently based on their tier. See `architecture.md` for the full tier definition and promotion rules.

### Left Sidebar — Party Tab (Companions)

Companions appear in a dedicated **Party** tab in the left sidebar (between Character and Inventory).

| Element | Description |
|---|---|
| Companion card (collapsed) | Portrait circle (faction-colored border), name, class/level, HP bar |
| Companion card (expanded) | Full mini character sheet: 6-stat grid, skills, abilities, gear summary, status effects, loyalty, join date |
| Empty state | Shield icon + "No companions yet" message |

### Right Sidebar — NPC Tab (Scene NPCs)

The NPC tab shows all NPCs present in the current scene, organized by tier.

| Tier | Selector | Detail View |
|---|---|---|
| **Active** | Portrait in selector with gold tier dot | Full portrait, name/faction/class/level, disposition bar, threat impression card, observed capabilities (badges), visible status (badges), traits, appearance |
| **Passive** | Portrait in selector with purple tier dot | Portrait, name/faction/level, disposition bar, traits, appearance. No combat stats shown. |
| **Background** | Not in selector | Collapsible section at bottom: compact cards with small portrait + name + one-line description |

### Tier Promotion Flow (UI Transitions)

| Promotion | UI Change |
|---|---|
| Background → Passive | NPC moves from background section to the portrait selector. AI assigns basic stats (level, HP, XP). |
| Passive → Active | AI generates full stat block. Detail view gains: class, threat impression, observed capabilities, visible status sections. |
| Active → Companion | NPC moves from right sidebar NPC tab to left sidebar Party tab. Full character sheet becomes available. |

---

## Phase 2: Game Engine Core — UI Needed

| UI Surface | Description | Priority | Depends On |
|---|---|---|---|
| **Dice roll animation** | Spinning dice, suspense delay, result reveal. Must support advantage/disadvantage (2 dice). 4-tier outcome visuals: crit fail (red shake), fail (muted), success (gold), crit success (gold explosion). | Critical | Resolution Engine |
| **Saving throws drawer** | New drawer in CharacterSheet. Data already exists in placeholder — DEX (+7), INT (+5). Shows proficiency indicator. | High | Resolution Engine |
| **Full 18-skill list** | Expand from 8 to all 18 5e skills in placeholder data and CharacterSheet skills drawer. | High | Skill checks |
| **Inventory actions** | "Use", "Drop", "Destroy" buttons in ItemModal. "Add item" flow for loot/rewards. | High | Inventory management |
| **Shop/trade modal** | Merchant UI: NPC portrait, merchant inventory list with prices, buy/sell buttons, player gold display, quantity selector. | High | Economy engine |
| **Level up modal** | Triggered when XP exceeds threshold. Shows: new level, stat increase picker (ASI), new abilities unlocked, proficiency bonus change, confirmation button. | High | Character leveling |
| **Save/load screen** | Full-screen or large modal. Save slot list with: campaign name, character name, timestamp, location, play time. New/load/delete actions. Auto-save indicator. | High | Save/load system |
| **Settings panel** | Tabbed panel: Gameplay (text speed, auto-save, difficulty), Display (theme, font size), Audio (placeholder). | High | Game state manager |
| **Time passage indicator** | Visual treatment when time advances: "3 hours pass..." overlay or narrative card. Clock segments animate filling. | Medium | Time/date tracking |
| **Clock completion event** | When a clock fills all segments: dramatic notification, narrative description of what happened. | Medium | Clock system |
| **Reputation change notification** | Toast/popup: "+10 Merchants Guild" with faction color and icon. Appears after rep-affecting actions. | Medium | Faction reputation |
| **Disposition change indicator** | Subtle animation on NPC disposition bar when it changes. Arrow showing direction of change. | Medium | NPC disposition |
| **Quest update notifications** | Toast: "Quest Updated: The Stolen Artifact", "New Objective", "Quest Complete!" with reward summary. | Medium | Quest system |
| **Quest detail modal** | Click quest card to expand full detail view (similar to ItemModal): all objectives, full description, reward breakdown, abandon button. | Medium | Quest system |
| **Combat/initiative tracker** | Turn order bar (horizontal, top of narrative panel or dedicated area). Shows: character portraits in initiative order, current turn highlight, round counter. | Low | Resolution Engine (combat) |

---

## Phase 3: AI Integration (Single Agent) — UI Needed

| UI Surface | Description | Priority | Depends On |
|---|---|---|---|
| **Streaming text animation** | Token-by-token text rendering in narrative panel. Characters appear with slight delay. Must handle markdown/formatting mid-stream. | Critical | Claude API streaming |
| **AI thinking indicator** | Animated indicator in narrative panel while waiting for AI response. "The story unfolds..." or animated dots. Must feel thematic, not generic. | Critical | Claude API |
| **Context budget meter** | Small indicator (top bar or settings) showing context window usage. Bar or percentage. Warning state when approaching limit. | Medium | Context window management |
| **Lorebook viewer/editor** | Panel or modal to browse lore entries. Two tabs: Persistent (always active) and Contextual (RAG-retrieved). Each entry shows: title, content preview, tags, which agents receive it. Search and filter. | Medium | Lorebook system |
| **System prompt viewer** (dev/debug) | Optional debug panel showing the current system prompt being sent to the AI. Useful during development. Can be hidden in production. | Low | System prompt architecture |

---

## Phase 4: Multi-Agent System — UI Needed

| UI Surface | Description | Priority | Depends On |
|---|---|---|---|
| **NPC list/selector** | Top of NPC panel: horizontal scrollable list of NPC portraits/names present in current scene. Click to switch displayed NPC. Badge for disposition (color dot). | Critical | NPC agent (per-NPC swapping) |
| **Agent activity indicator** | Subtle status showing which agents are active: "Narrator is describing...", "Marcus is thinking...", "Quest log updating...". Could be small animated icons in top bar or bottom of narrative panel. | High | Orchestrator |
| **Hidden roll hint** | Narrative-only indication that an NPC-initiated roll happened. No dice UI shown. Subtle text styling difference: "She tilts her head slightly..." (italic, faint gold border). The player feels something happened but doesn't see mechanics. | High | Hidden roll system |
| **Environment event notification** | Director-initiated ambient events: "A distant rumble shakes the walls..." Distinct visual treatment from NPC dialogue and narration — perhaps with a subtle icon or border style. | Medium | Campaign Director |
| **"While you were away" recap** | When time passes significantly (travel, rest), a narrative card appears summarizing off-screen events: NPC actions, faction movements, clock ticks. Styled as a parchment/letter. | Medium | Campaign Director |
| **GM Call transparency** (optional) | Debug/optional display showing what the GM Call agent set: DC, advantage/disadvantage reason, outcome definitions. Togglable in settings. | Low | GM Call agent |

---

## Phase 5: ComfyUI Integration — UI Needed

| UI Surface | Description | Priority | Depends On |
|---|---|---|---|
| **Image loading skeleton** | Shimmer/skeleton placeholder shown while images are being generated. Same dimensions as final image. Progress indicator optional. | High | ComfyUI API |
| **Image regenerate button** | Small refresh icon overlay on scene image, NPC portraits, player portrait. Click to request new generation. | High | Image Agent |
| **Image generation queue** | If multiple images are generating, show queue status. "Generating scene... (2 in queue)". | Medium | Image caching system |
| **Portrait consistency indicator** | Shows when a portrait uses a reference image for consistency. Small "linked" icon. | Low | IP-adapter |

---

## Phase 6: Context Management — UI Needed

| UI Surface | Description | Priority | Depends On |
|---|---|---|---|
| **Session recap panel** | "Previously on your adventure..." modal or expandable section at top of narrative panel. Shows auto-generated summary of previous sessions. | High | Rolling session summaries |
| **Per-agent context meter** | Expansion of Phase 3 context meter. Shows each agent's context consumption as stacked bar or breakdown. Useful for debugging and optimization visibility. | Medium | Context budget tracking |
| **Compression indicator** | Subtle note when older conversation is being compressed. "Earlier events have been summarized." | Low | Campaign-level compression |

---

## Phase 7: Living World — UI Needed

| UI Surface | Description | Priority | Depends On |
|---|---|---|---|
| **World event banner** | Full-width notification for major world events. "The Syndicate has seized the warehouse district." Persistent until dismissed, with link to relevant faction/quest. | High | World event system |
| **NPC off-screen recap** | Per-NPC summary of what they did while the player was away. Shown when re-encountering an NPC or viewing their panel. "Since you last met: Marcus secured a new trade route..." | High | NPC off-screen progression |
| **Deception suspicion UI** | When player has reason to suspect deception (successful Insight check), subtle indicator on NPC panel: "Something feels off..." with faint warning styling. NOT explicit "this NPC is lying". | Medium | NPC deception mechanics |
| **Interactive relationship web** | Upgrade from static SVG: clickable nodes that show NPC detail popup, draggable layout, filter by faction, edge labels showing relationship type, "unknown" nodes for referenced-but-unmet NPCs. | Medium | Relationship web UI |
| **Faction timeline viewer** | Visual timeline per faction showing clock progress, key events, and projected outcomes. Accessible from faction panel. | Low | Faction timeline progression |

---

## Phase 8: Polish & Expansion — UI Needed

| UI Surface | Description | Priority | Depends On |
|---|---|---|---|
| **Campaign selection screen** | Full-screen: list of campaigns with thumbnails, character names, last played date, play time. New campaign / continue / delete. | High | Multiple campaign support |
| **Character creation flow** | Multi-step wizard: name, race, class, stat allocation (point buy / standard array / rolled), appearance description, backstory. Preview character sheet at each step. | High | Class/role system |
| **Theme selector** | In settings panel: preview thumbnails for each theme. Live preview before confirming. CSS variable swap. | Medium | UI themes |
| **World map** | Interactive map showing discovered locations, connections, current position. Click location to travel (triggers time passage). Fog of war for undiscovered areas. | Medium | Navigation / map UI |
| **Export/share modal** | Export campaign as JSON file. Share summary as formatted text. | Low | Export/share campaigns |
| **Multiple LLM provider selector** | In settings: dropdown to select AI provider (Claude, GPT, local). API key input. Model selection. | Low | Multiple LLM support |
| **Local ComfyUI config** | In settings: connection URL, workflow selection, model selection for local ComfyUI. | Low | Local ComfyUI support |

---

## Notification/Toast System (Cross-Phase)

This system is needed by **every phase from Phase 2 onward**. It is the single most cross-cutting UI surface.

### Event Types That Need Notifications

| Source | Examples | Phase |
|---|---|---|
| Resolution Engine | "Insight Check: Success (17 vs DC 14)" | 2 |
| Inventory | "Acquired: Healing Potion x2" | 2 |
| Economy | "Purchased Rope for 1 gp" | 2 |
| Quest Agent | "Quest Updated: The Stolen Artifact", "Quest Complete!" | 2 |
| Faction System | "+10 Merchants Guild reputation" | 2 |
| Clock System | "Clock Complete: Festival of Masks has begun!" | 2 |
| Level Up | "Level Up! You are now Level 6" | 2 |
| Save System | "Game saved", "Auto-save complete" | 2 |
| AI System | "Connecting to AI...", "Context limit approaching" | 3 |
| Campaign Director | "A new threat emerges..." | 4 |
| Image Generation | "Scene image generated", "Portrait updated" | 5 |
| World Events | "The Syndicate has seized the warehouse district" | 7 |

### Toast Design Requirements

- Appear bottom-right or top-right, stacking vertically
- Auto-dismiss after 3-5 seconds (configurable)
- Different visual treatments by type: success (green), warning (gold), error (red), info (blue), story (purple)
- Click to dismiss, or click to navigate to relevant panel
- Queue system — don't spam, batch rapid-fire events
- Respect reduced-motion preference

---

## Implementation Priority (Build Order)

### Tier 1 — Build Now (Blocks 3+ Phases)

1. **Notification/toast system** — Phases 2-8 all need this
2. **Dice roll animation + full roll UI** — Phases 2, 3, 4
3. **NPC list/selector** — Phases 4, 7
4. **Loading/thinking states** — Phases 3, 4, 5
5. **Save/load screen** — Phases 2, 8
6. **Settings panel** — Phases 2, 8

### Tier 2 — Build Before Backend (Blocks 2 Phases)

7. **Shop/trade modal** — Phases 2, 7
8. **Level up modal** — Phases 2, 4
9. **Lorebook viewer** — Phases 3, 6
10. **Session recap panel** — Phases 6, 7
11. **"While you were away" recap** — Phases 4, 7

### Tier 3 — Quick Wins (Completes Existing Patterns)

12. **Saving throws drawer** — data exists, trivial to add
13. **Full 18-skill list** — expand existing placeholder
14. **Quest detail modal** — same pattern as ItemModal
15. **Image regenerate buttons** — simple overlay, Phase 5 wires up
16. **Character creation flow** (basic) — Phase 8 needs it, but new game flow needs it earlier
17. **Inventory actions** (use/drop) — buttons in existing ItemModal

### Tier 4 — Build During Respective Phase

18. Everything else — Phase-specific UI that doesn't need early scaffolding
