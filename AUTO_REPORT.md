# Boxing Trainer &mdash; AUTO Development Report

Automated development log for the NEXTERA+PRISM rotation agent.
Each entry captures benchmarking, dev work, QA, and metrics for one pass.

---

## 2026-04-10 &mdash; Pass #1 (Sonnet Opus 4.6)

### Stage 1. Benchmarking vs FightCamp / BOXX / Nintendo Fitness Boxing

Current app (v2) had a strong 3D boxer with biomechanically-grounded keyframes
but was a **silent animation viewer**. Pro apps deliver:

| Feature | FightCamp | BOXX | Nintendo FB | v2 (before) |
| --- | --- | --- | --- | --- |
| Timed rounds + bell | YES | YES | YES | **NO** |
| Audio coach callouts | YES | YES | YES | **NO** |
| Heavy bag target | YES (real) | - | - | **NO** |
| Punch counter / stats | YES | YES | YES | **NO** |
| Workout presets | YES | YES | YES | **NO** |
| Shadowbox / combo caller | - | YES | YES | **NO** |
| SFX (glove, bell, scuff) | YES | YES | YES | **NO** |
| Impact VFX | YES | YES | YES | **NO** |
| Advanced moves (overhand, liver, parry, roll) | YES | YES | - | partial |

**Gap verdict**: v2 was roughly a "3D pose encyclopedia" compared to peer
training apps which ship interactive workouts with audio coaching. Also
detected a **rule violation**: `@import url('https://fonts.googleapis.com/...')`
in head CSS, which breaks offline mode and violates the external-CDN
whitelist (Three.js / Tone.js / Leaflet only).

### Stage 2. Full-team development

**Frontend / UX**
- Removed Google Fonts CDN import; switched to system font stack
  (`-apple-system`, `Segoe UI`, `Malgun Gothic`, `Apple SD Gothic Neo`,
  Roboto&hellip;) plus Impact/Oswald display stack.
- Added responsive mobile hamburger menus (left = moves, right = info).
  Below 720px the side panels collapse into slide-out drawers.
- Added Round Timer card (phase, mm:ss countdown, progress bar, round count).
- Added Session Stats card (punches, rounds, combos, time).
- Added Settings card with 6 toggles (sound, coach callouts, particles,
  trail, bag visibility, joints).
- Added workout preset row (beginner 3&times;1, intermediate 3&times;2,
  advanced 5&times;3).
- Added giant Coach Callout overlay (center screen) that flashes the
  combo number (1, 1-2, 2-3-5-6&hellip;).
- Added Toast notification system for status messages.
- Added fullscreen red flash on round-start events.
- Added difficulty badges (&#48712;&#52488;/&#51473;&#44553;/&#44256;&#44553;)
  on every move button.
- Reworked bottom toolbar: added slow-mo, round, shadowbox buttons.
- HTML entity-encoded all quotes in inline onclick handlers for safety.

**Backend / logic**
- **Web Audio API engine** (zero external files). 5 synth voices:
  - `bell()` - 3-partial metal bell (850/1275/2550 Hz) with 1.6s decay.
  - `bellEnd()` - triple-bell end sequence.
  - `impact()` - 150&rarr;55 Hz sine thump + bandpass noise slap.
  - `scuff()` - filtered noise burst for footwork.
  - `beep()` / `callNum(n)` - unique coach callout tone per combo number.
- **Round Timer / Workout mode**: state machine
  `ready &rarr; work &rarr; rest &rarr; work &rarr; &hellip; &rarr; done`
  with bell cues on every transition, automatic round increments,
  fullscreen flash at round start, and progress bar.
- **Shadowbox (combo caller) mode**: random combo picker from a pool of
  15 moves/combos, shows giant coach number, plays staggered per-punch
  coach beeps timed to combo sequence, auto-queues the next combo after
  current one finishes.
- **Session stats tracker**: counts punches at the peak of each punch
  animation (t&asymp;0.55), counts rounds on phase transition, counts
  combos on selection, tracks session time via dt accumulator.
- **Peak-impact detector**: fires once per punch at t=0.48-0.62, spawns
  particles, plays impact SFX, kicks heavy bag, increments counter.
- **Slow-mo cycle** button: 1.0x &rarr; 0.5x &rarr; 0.25x &rarr; 1.0x.
- **Keyboard shortcuts added**: T (round), S (shadowbox), M (sorthpaw).

**3D engine / visuals**
- **Heavy Bag** mesh: tapered cylinder body with domed caps, 3 red
  stripes, 4 steel chain cylinders, ceiling mount plate + I-beam.
  Hangs in front of boxer at z=+1.35.
- **Pendulum physics** on the bag: dual-axis spring-damper
  (k=6, c=2.2) reacting to punch impacts. Punches at the peak push
  `swingVx`/`swingVz` based on glove world position.
- **Impact particle system**: 80-particle ring buffer, `THREE.Points`
  with additive blending. Burst of 14 particles per punch peak,
  gravity-affected, 1.6s lifetime.
- **Glove trail**: 22-point ribbon line tracked during t=0.2&ndash;0.7
  of each punch, colored accent red, cleared between moves.
- **Boxer / lighting / floor**: preserved (unchanged).

**Content (new moves &amp; combos)**
- 3 new basic punches: OVERHAND (7), LIVER SHOT (8), BODY JAB (1B).
  Each with accurate keyframes (wind-up &rarr; impact &rarr; retract).
- 4 new footwork / defense: PIVOT, PARRY, ROLL (under hook), CHECK HOOK.
- 4 new combos: 1-6-3-2, 3-2-3, 1-2-5-2, 1B-2-3 (body-head).
- All moves tagged with difficulty (b/i/a).

### Stage 3. QA verification

Ran these automated checks:
- `node -e "new Function(extractedJS)"` &rarr; **JS parses OK**.
- Tag balance: 57 `<div>`/`</div>`, 15 `<button>`/`</button>`, 2 scripts.
- Manifest JSON parses.
- External URL scan: only `cdnjs.cloudflare.com/.../three.min.js`
  (whitelisted). **No Google Fonts, no other CDNs.**
- 46 `getElementById()` refs &rarr; all 46 IDs exist in HTML.
- All 9 punch IDs, 11 footwork IDs, 9 combo IDs have move defs.
- All 20 keyframe entries exist for punch+footwork moves.
- All `seq:` references in combos resolve to valid move IDs.
- Personal-info scan: no `/home/`, no `bsy522`, no `Users/` &mdash; **CLEAN**.
- Quote encoding: 4 properly HTML-entity-encoded onclick attributes.
- **Mock-DOM runtime smoke test**: init(), animate(), selectMove() for
  every new move, toggleRound, toggleShadowbox, toggleSlowmo,
  setWorkout(beg/int/adv), togMenu(left/right), TIMER.tick(),
  SHADOW.tick(), resetStats() &mdash; all executed without throwing.

### Stage 4. Metrics

| | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Lines | 1063 | 2204 | +1141 (+107%) |
| File size (KB) | ~40 | 77 | +37 |
| Punches | 6 | 9 | +3 |
| Combos | 5 | 9 | +4 |
| Footwork/defense | 7 | 11 | +4 |
| Audio SFX | 0 | 5 | +5 |
| 3D scene objects | boxer | boxer + heavy bag + particles + trail | +3 systems |
| HUD cards | 2 | 6 | +4 |
| External CDN violations | 1 | 0 | fixed |

---
