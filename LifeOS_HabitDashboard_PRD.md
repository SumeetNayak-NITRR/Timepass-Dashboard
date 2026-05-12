# LifeOS — Daily Habit & Routine Dashboard
### Build Specification v1.0 · Sumeet Nayak

---

## 0. The Vision

Build a **personal daily command center** — a dashboard that feels like opening a high-end journaling app every morning. The goal is that opening it becomes a *ritual*, not a chore. It must be:

- **Frictionless to log** — one page, everything visible, submit in under 60 seconds
- **Satisfying to look at** — dark, cinematic, glass-morphism with purposeful motion
- **Insightful passively** — stats update automatically; AI insights are one click away
- **Completely self-contained** — localStorage for persistence, Anthropic API for intelligence

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Confetti | `canvas-confetti` |
| Fonts | `Syne` (headings) + `DM Sans` (body) via Google Fonts |
| Storage | `localStorage` |
| AI | Anthropic API — `claude-sonnet-4-20250514` |

Install command:
```bash
npm install framer-motion lucide-react canvas-confetti
```

Add to `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 2. Design System

### 2.1 Color Palette (CSS Variables in `index.css`)

```css
:root {
  --bg-base: #080810;
  --bg-surface: #0f0f1a;
  --bg-glass: rgba(255, 255, 255, 0.04);
  --bg-glass-hover: rgba(255, 255, 255, 0.07);
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-bright: rgba(255, 255, 255, 0.15);

  --coral: #FF6B6B;
  --coral-dim: rgba(255, 107, 107, 0.15);
  --coral-glow: rgba(255, 107, 107, 0.3);

  --purple: #A855F7;
  --purple-dim: rgba(168, 85, 247, 0.15);
  --purple-glow: rgba(168, 85, 247, 0.3);

  --teal: #2DD4BF;
  --teal-dim: rgba(45, 212, 191, 0.15);

  --amber: #FBBF24;
  --amber-dim: rgba(251, 191, 36, 0.15);

  --text-primary: rgba(255, 255, 255, 0.92);
  --text-secondary: rgba(255, 255, 255, 0.5);
  --text-muted: rgba(255, 255, 255, 0.25);

  --font-heading: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  --radius-card: 16px;
  --radius-input: 10px;
}
```

### 2.2 Global Body Styles

```css
body {
  background-color: var(--bg-base);
  font-family: var(--font-body);
  color: var(--text-primary);
  min-height: 100vh;
}

/* Subtle noise texture overlay on the entire page */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}
```

### 2.3 Glass Card Mixin

Every card in the app uses this pattern:
```css
.glass-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.glass-card:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-glass-bright);
}
```

### 2.4 Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| App title / Tab headers | Syne | 22px / 13px | 800 / 700 | white / secondary |
| Section headings | Syne | 15px | 700 | white |
| Body text | DM Sans | 14px | 400 | secondary |
| Input labels | DM Sans | 12px | 500 | muted |
| Stat numbers | Syne | 28px | 800 | coral or purple |
| Stat labels | DM Sans | 11px | 400 | muted |

---

## 3. App Layout

### 3.1 Structure

```
App
├── Sidebar (left, fixed, 220px wide on desktop)
│   ├── Logo / App name
│   ├── Date display
│   ├── XP Badge
│   └── Nav items
└── Main Content Area (flex-1, scrollable)
    └── AnimatePresence → active tab component
```

On **mobile** (< 768px), the sidebar becomes a **bottom tab bar** (5 icons, no labels).

### 3.2 Sidebar Details

- Background: `#0a0a14` with a 1px right border (`var(--border-glass)`)
- Top section: App name `"LifeOS"` in Syne 800, with a small coral dot beside it
- Below name: Today's date — `"Monday, 12 May"` in DM Sans 13px secondary
- XP badge: a small pill showing `"⚡ 240 XP"` in coral — updates live from localStorage
- Streak display: `"🔥 5-day streak"` below XP
- Nav items (with Lucide icons):
  - `BookOpen` → **Today's Log**
  - `BarChart2` → **Insights**
  - `CalendarDays` → **History**
  - `Settings` → **Settings** (optional, minimal)
- Active nav item: left border `3px solid var(--coral)`, text in white, bg `var(--coral-dim)`
- Inactive: text `var(--text-secondary)`, no border

---

## 4. Tab 1 — Today's Log

### 4.1 Layout

Full-width scrollable page. Top has:
- Heading: `"Good morning, Sumeet 👋"` (change greeting based on time — morning/afternoon/evening)
- Subtext: `"Log your day. Stay consistent."` in secondary color

Below: a **2-column grid** of section cards (on mobile: 1 column).

Each section card is a glass card with:
- A colored icon in a small dim-colored circle (top left)
- Section title in Syne 700
- Its input fields
- No submit button per card — one global **"Save Day"** button at the bottom

### 4.2 The Six Section Cards

---

**Card 1 — Study** · `BookOpen` icon · coral accent

Fields:
- `Hours studied` — number input (0–16, step 0.5), placeholder `"0.0"`
- `What did you study?` — text input, placeholder `"e.g. SQL basics, Python loops"`

---

**Card 2 — Workout** · `Dumbbell` icon · purple accent

Fields:
- `Did you work out?` — segmented toggle: `[ ✓ Done ] [ ✗ Skipped ]`
  - When "Done" selected: reveal (with height animation) two sub-fields:
    - `Workout type` — text input, placeholder `"e.g. Push day, Football drills"`
    - `Duration (mins)` — number input
- `Felt` — horizontal emoji slider: 😴 😐 😊 💪 🔥 (store as 1–5)

---

**Card 3 — Diet** · `Apple` icon · teal accent

Fields:
- `Breakfast` — text input, placeholder `"What did you eat?"`
- `Lunch` — text input
- `Dinner` — text input
- `Water (glasses)` — number input (0–15)
- `Overall rating` — star rating component (1–5 stars), coral colored stars

---

**Card 4 — Finance** · `Wallet` icon · amber accent

Fields:
- `Total spent (₹)` — number input with `₹` prefix
- `Spent on` — text input, placeholder `"e.g. food ₹80, Swiggy ₹120"`
- `Category` — segmented: `[ Food ] [ Transport ] [ Education ] [ Other ]`

---

**Card 5 — Sleep & Energy** · `Moon` icon · purple accent

Fields:
- `Hours slept` — number input (0–12, step 0.5)
- `Sleep quality` — icon row: 😵 😴 😐 🙂 😌 (store 1–5)
- `Energy level today` — same icon row: 🔋1% 🔋25% 🔋50% ⚡ 🚀 (store 1–5)

---

**Card 6 — Communication + Football** · `Mic` icon + `Trophy` icon · coral accent

Communication sub-section:
- `Practiced today?` — toggle `[ Yes ] [ No ]`
- When Yes: `Notes` — text area, placeholder `"What did you practice? Any new words?"`
- `Confidence level` — 1–5 star rating

Football sub-section (separated by a subtle divider):
- `Activity` — segmented: `[ Training ] [ Match ] [ Rest ]`
- `Notes` — small textarea, placeholder `"Match result, what you worked on..."`

---

**Card 7 — General Notes** · `Feather` icon · secondary accent

- Single large textarea, placeholder: `"Anything else about today? Wins, reflections, things to improve..."`
- Character count shown bottom-right in muted color

---

### 4.3 Save Button

Full-width button at the very bottom:
- Text: `"Save Day →"` in Syne 700
- Background: `linear-gradient(135deg, var(--coral), var(--purple))`
- Height: 52px, border-radius: 12px
- On hover: `brightness(1.1)` + slight scale up (`scale(1.01)`)
- On click: save to localStorage, trigger confetti if it's a new day (not an update)
- If entry already exists for today: button text changes to `"Update Day →"`

### 4.4 LocalStorage Schema

Key: `lifeos_log_YYYY-MM-DD`

Value (JSON):
```json
{
  "date": "2025-05-12",
  "study": {
    "hours": 3.5,
    "topics": "SQL basics, Power BI filters"
  },
  "workout": {
    "done": true,
    "type": "Push day",
    "duration": 45,
    "feel": 4
  },
  "diet": {
    "breakfast": "Oats + milk",
    "lunch": "Dal rice",
    "dinner": "Roti sabzi",
    "water": 8,
    "rating": 4
  },
  "finance": {
    "spent": 120,
    "description": "Canteen food",
    "category": "Food"
  },
  "sleep": {
    "hours": 7,
    "quality": 4,
    "energy": 4
  },
  "communication": {
    "practiced": true,
    "notes": "Practiced introducing myself. Used 3 new words.",
    "confidence": 3
  },
  "football": {
    "activity": "Training",
    "notes": "Worked on crossing drills"
  },
  "notes": "Good productive day overall."
}
```

Other localStorage keys:
- `lifeos_xp` — number (total XP)
- `lifeos_streak` — `{ count: 5, lastDate: "2025-05-11" }`

---

## 5. Tab 2 — Insights

### 5.1 Layout

Two sections stacked vertically:

**Section A — Quick Stats** (auto-computed, no button needed)

A responsive grid of **mini stat cards** (3 per row on desktop, 2 on mobile):

| Stat | Icon | Accent |
|---|---|---|
| Study hours this week | `BookOpen` | coral |
| Workout streak | `Flame` | amber |
| Avg sleep (7 days) | `Moon` | purple |
| Avg diet rating (7 days) | `Apple` | teal |
| Total ₹ spent this week | `Wallet` | amber |
| Comm. practice days (7d) | `Mic` | coral |

Each mini stat card:
- Number in Syne 800 at 28px in the accent color
- Label in DM Sans 11px muted below
- Small icon in a dim-colored pill top-right
- Animated number count-up on mount (Framer Motion `useSpring` or simple JS counter)

---

**Section B — AI Insights**

A large glass card with:
- Title: `"AI Coach"` in Syne 700 + a purple sparkle icon
- Subtext: `"Powered by Claude · analyzes your last 7 days"`
- If fewer than 3 entries: show a locked state — `"Log at least 3 days to unlock AI analysis"` with a lock icon
- Otherwise: a button `"Generate Insights →"` with purple gradient
- On click: show a loading skeleton (3 animated shimmer lines) while the API call runs
- When response arrives: display in a styled card with bullet points, each bullet on its own line with a `▸` prefix in coral

**API Call Specification:**

```javascript
const entries = getLast7DaysEntries(); // reads from localStorage

const systemPrompt = `You are a personal productivity coach for a 20-year-old engineering student named Sumeet who is focused on Data Analytics, football, fitness, and improving his English communication. Analyze his habit tracking data and give honest, specific, actionable insights. Be direct and encouraging. Format your response as exactly 6 bullet points. Each bullet must start with an emoji relevant to the category, followed by a colon, then the insight. No preamble. No summary. Just the 6 bullets.`;

const userMessage = `Here is my habit data for the last 7 days:\n\n${JSON.stringify(entries, null, 2)}\n\nGive me my weekly insights.`;

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }]
  })
});

const data = await response.json();
const text = data.content[0].text;
```

Display each bullet point with a staggered fade-in animation (Framer Motion, 0.1s delay between bullets).

---

## 6. Tab 3 — History

### 6.1 Layout

- Top: month selector (left/right arrows + `"May 2025"` in center, Syne 700)
- Below: a vertical list of day cards, newest first

### 6.2 Day Card

Each card is a glass card showing:
- **Left column:** Day + date (e.g., `"Mon"` in muted, `"12"` in Syne 800 white)
- **Right column:** compact pill grid showing the day's key stats:
  - `📚 3.5h` — study
  - `💪 Done` or `✗` — workout
  - `😴 7h` — sleep
  - `💰 ₹120` — spent
  - ⭐⭐⭐⭐ — diet rating (stars)
- Click to expand: smooth height animation revealing full details for that day
- Expanded state shows all fields formatted cleanly in a two-column sub-grid

### 6.3 Empty State

If no entries for the selected month:
- Centered illustration placeholder (simple SVG — e.g., a small calendar with a dashed border)
- Text: `"No entries yet for this month."` in muted color

---

## 7. XP & Streak System

### Logic (runs on every save):

```javascript
function handleXPAndStreak(isNewEntry) {
  if (!isNewEntry) return; // updating existing entry gives no XP

  // XP
  const currentXP = parseInt(localStorage.getItem('lifeos_xp') || '0');
  localStorage.setItem('lifeos_xp', currentXP + 10);

  // Streak
  const today = new Date().toISOString().split('T')[0];
  const streakData = JSON.parse(localStorage.getItem('lifeos_streak') || '{"count":0,"lastDate":""}');
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streakData.lastDate === yesterday) {
    streakData.count += 1;
  } else if (streakData.lastDate !== today) {
    streakData.count = 1;
  }

  streakData.lastDate = today;
  localStorage.setItem('lifeos_streak', JSON.stringify(streakData));

  // Confetti on 7-day streak milestone
  if (streakData.count % 7 === 0) {
    triggerConfetti();
  }
}

function triggerConfetti() {
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#FF6B6B', '#A855F7', '#2DD4BF'] });
  });
}
```

---

## 8. Animations (Framer Motion)

### Page transitions
```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    {/* tab content */}
  </motion.div>
</AnimatePresence>
```

### Card stagger on mount
```jsx
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};
```

### Input focus glow
On focus, inputs get a subtle box-shadow: `0 0 0 2px var(--coral-glow)` — use Tailwind's `focus:ring` or inline style.

### Save button press
```jsx
whileTap={{ scale: 0.97 }}
whileHover={{ scale: 1.01 }}
```

---

## 9. Responsive Behavior

| Breakpoint | Layout |
|---|---|
| Desktop (≥ 768px) | Fixed left sidebar (220px) + scrollable main area |
| Mobile (< 768px) | No sidebar — sticky bottom tab bar with 4 icon tabs |
| Cards grid | 2-col on desktop, 1-col on mobile |
| Stats grid | 3-col on desktop, 2-col on mobile |

---

## 10. Settings Tab (Optional / Minimal)

A single glass card with:
- `Your Name` — text input (stored as `lifeos_name`, defaults to `"Sumeet"`)
- `Anthropic API Key` — password input (stored as `lifeos_api_key` in localStorage — note: this overrides the `.env` variable, good for production use without exposing the key in code)
- `Export Data` — button that downloads all localStorage entries as a JSON file
- `Clear All Data` — red danger button with a confirmation step

---

## 11. File Structure

```
src/
├── main.jsx
├── App.jsx                  ← layout, sidebar, routing
├── index.css                ← CSS variables, global styles
├── components/
│   ├── Sidebar.jsx
│   ├── BottomNav.jsx        ← mobile only
│   ├── GlassCard.jsx        ← reusable wrapper
│   ├── StatCard.jsx         ← mini stat cards
│   ├── SegmentedControl.jsx ← reusable toggle
│   ├── StarRating.jsx       ← reusable 1–5 stars
│   └── EmojiRating.jsx      ← reusable emoji row
├── tabs/
│   ├── TodayLog.jsx
│   ├── Insights.jsx
│   └── History.jsx
├── utils/
│   ├── storage.js           ← all localStorage read/write logic
│   ├── xp.js                ← XP and streak logic
│   └── date.js              ← date helpers (today's key, week range, etc.)
└── hooks/
    └── useLocalStorage.js   ← generic hook
```

---

## 12. Environment Variable

Create a `.env` file at root:
```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Access in code: `import.meta.env.VITE_ANTHROPIC_API_KEY`

---

## 13. Final UX Rules

1. **On app load:** auto-detect if today's log exists → pre-fill the form. Button shows `"Update Day →"` instead of `"Save Day →"`
2. **Greeting:** `"Good morning"` before 12pm, `"Good afternoon"` before 5pm, `"Good evening"` after 5pm
3. **No required fields** — user can submit a partial log. Everything is optional.
4. **No page reloads** — everything is SPA, all state in React + localStorage
5. **Scroll position** — each tab remembers its scroll position (store in a ref, restore on tab switch)
6. **Dark mode only** — no light mode toggle. The dark aesthetic is intentional.
7. **Font loading** — add `font-display: swap` to avoid layout shift

---

*Built for Sumeet Nayak · NIT Raipur · LifeOS v1.0*
