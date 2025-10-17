# Auto-Carousel Feature - Event Details & Poster

## 🎯 Feature Overview

Added an **automatic carousel system** that alternates between Event Details and Event Poster every 6 seconds, with a horizontal navigation bar for manual control.

---

## ✅ What Was Implemented

### 1. **Auto-Sliding Carousel**
- Automatically switches between **Event Details** (Slide 0) and **Event Poster** (Slide 1)
- Each slide displays for **6 seconds** before transitioning
- Smooth spring animation during transitions
- Can be toggled ON/OFF via the navigation bar

### 2. **Horizontal Navigation Bar**
- Located directly below the event banner
- Three interactive elements:
  1. **"Event Details" button** - Jump to event information
  2. **"Event Poster" button** - Jump to poster view
  3. **Auto-slide toggle** - Play/Pause the carousel

### 3. **Progress Bar**
- Visual indicator showing time remaining until next slide
- Fills from 0% to 100% over 6 seconds
- Gradient color (pink to blue)
- Only visible when auto-slide is ON

### 4. **Manual Control**
- Clicking any tab stops auto-sliding
- User can manually navigate between views
- Auto-slide can be re-enabled via toggle button

---

## 🎨 Visual Layout

### Navigation Bar Structure
```
┌───────────────────────────────────────────────────────────────┐
│  [Banner Image]                                      [Nav ↔]  │
├───────────────────────────────────────────────────────────────┤
│  [ℹ️ Event Details] [🖼️ Event Poster] [⏸️/▶️ Auto-slide]    │
│  ═════════════════════════════════════ (Progress Bar)         │
├───────────────────────────────────────────────────────────────┤
│  Content (Event Details or Poster)                            │
└───────────────────────────────────────────────────────────────┘
```

### Slide 0 - Event Details (6 seconds)
```
┌───────────────────────────────────────────────────────────────┐
│  [Banner Image]                                               │
├───────────────────────────────────────────────────────────────┤
│  [●  Event Details]  [ Event Poster]  [⏸️]                    │
│  ████████░░░░░░░░░░░░ (50% progress)                          │
├─────────────────────┬─────────────────────────────────────────┤
│  Event Name         │  What to Expect                         │
│  Date & Time        │  Description...                         │
│  Speaker            │                                         │
│  Venue              │  Countdown Timer                        │
│  Fee: FREE          │  [00:16:41:25]                          │
│                     │                                         │
│                     │  [REGISTER BUTTON]                      │
└─────────────────────┴─────────────────────────────────────────┘
     ↓ After 6 seconds, automatically slides to Poster ↓
```

### Slide 1 - Event Poster (6 seconds)
```
┌───────────────────────────────────────────────────────────────┐
│  [Banner Image]                                               │
├───────────────────────────────────────────────────────────────┤
│  [ Event Details]  [● Event Poster]  [⏸️]                     │
│  ████████░░░░░░░░░░░░ (50% progress)                          │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ╔═════════════════════════════════════════════════════════╗ │
│  ║                                                         ║ │
│  ║                  POSTER IMAGE                           ║ │
│  ║                  (Full Coverage)                        ║ │
│  ║                                                         ║ │
│  ╚═════════════════════════════════════════════════════════╝ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
     ↓ After 6 seconds, automatically slides back to Details ↓
```

---

## 🔧 Technical Implementation

### State Variables
```typescript
const [currentSlide, setCurrentSlide] = useState(0)    // 0=Details, 1=Poster
const [autoSlide, setAutoSlide] = useState(true)       // Auto-carousel ON/OFF
const [slideProgress, setSlideProgress] = useState(0)  // Progress 0-100%
const [isPosterVisible, setIsPosterVisible] = useState(false)
```

### Auto-Carousel Logic
```typescript
useEffect(() => {
  if (!autoSlide || upcomingEvents.length === 0) {
    setSlideProgress(0)
    return
  }

  // Progress bar updates every 60ms (100 steps over 6 seconds)
  const progressInterval = setInterval(() => {
    setSlideProgress((prev) => {
      if (prev >= 100) return 0
      return prev + 1
    })
  }, 60)

  // Slide transition every 6000ms (6 seconds)
  const slideInterval = setInterval(() => {
    setCurrentSlide((prev) => {
      const next = prev === 0 ? 1 : 0
      setIsPosterVisible(next === 1)
      return next
    })
  }, 6000)

  return () => {
    clearInterval(progressInterval)
    clearInterval(slideInterval)
  }
}, [autoSlide, upcomingEvents, currentSlide])
```

### Navigation Bar Buttons

#### Event Details Button
```tsx
<button
  onClick={() => {
    setCurrentSlide(0)
    setIsPosterVisible(false)
    setAutoSlide(false) // Stop auto-sliding
  }}
  className={currentSlide === 0 
    ? 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]' // Active
    : 'bg-white/5 text-gray-400'                      // Inactive
  }
>
  <svg>ℹ️ Icon</svg>
  <span>Event Details</span>
</button>
```

#### Event Poster Button
```tsx
<button
  onClick={() => {
    setCurrentSlide(1)
    setIsPosterVisible(true)
    setAutoSlide(false) // Stop auto-sliding
  }}
  className={currentSlide === 1
    ? 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]' // Active
    : 'bg-white/5 text-gray-400'                      // Inactive
  }
>
  <svg>🖼️ Icon</svg>
  <span>Event Poster</span>
</button>
```

#### Auto-Slide Toggle Button
```tsx
<button
  onClick={() => setAutoSlide(!autoSlide)}
  className={autoSlide
    ? 'bg-green-500/20 text-green-400' // ON (green)
    : 'bg-white/5 text-gray-400'        // OFF (gray)
  }
  title={autoSlide ? 'Auto-slide ON' : 'Auto-slide OFF'}
>
  <svg>
    {autoSlide 
      ? <path>⏸️ Pause Icon</path>
      : <path>▶️ Play Icon</path>
    }
  </svg>
</button>
```

### Progress Bar
```tsx
{autoSlide && (
  <div className="relative h-1 bg-white/5">
    <motion.div
      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]"
      style={{ width: `${slideProgress}%` }}
      transition={{ duration: 0.06, ease: "linear" }}
    />
  </div>
)}
```

---

## 🎯 User Interaction Flow

### Automatic Behavior (Default)
```
Start → Event Details (6s) → Poster (6s) → Event Details (6s) → Loop...
         ████████████████     ████████████████     
```

### Manual Navigation
```
User clicks "Event Details" button
  ↓
1. Jumps to Event Details immediately
2. Auto-slide stops (autoSlide = false)
3. Button highlights with gradient
4. Progress bar disappears

User clicks auto-slide toggle (▶️)
  ↓
1. Auto-slide resumes (autoSlide = true)
2. Progress bar reappears
3. Carousel continues from current slide
4. Toggle button turns green
```

---

## 🎨 Styling Details

### Active Tab (Selected)
```css
- Background: Gradient (Pink #F24DC2 → Blue #2C97FF)
- Text: White
- Shadow: Large drop shadow
- Icon: White
```

### Inactive Tab
```css
- Background: White 5% opacity (bg-white/5)
- Text: Gray-400
- Hover: White 10% opacity + White text
- Icon: Gray-400
```

### Auto-Slide Toggle (ON)
```css
- Background: Green 500 with 20% opacity
- Text: Green-400
- Icon: Pause symbol (⏸️)
- Hover: Green 500 with 30% opacity
```

### Auto-Slide Toggle (OFF)
```css
- Background: White 5% opacity
- Text: Gray-400
- Icon: Play symbol (▶️)
- Hover: White 10% opacity
```

### Progress Bar
```css
- Container: 
  - Height: 4px (h-1)
  - Background: White 5% opacity
  
- Fill Bar:
  - Height: 100%
  - Width: Dynamic (0-100%)
  - Background: Gradient (Pink → Blue)
  - Animation: Linear 60ms updates
```

---

## ⏱️ Timing Breakdown

### 6-Second Cycle
```
Time    | Progress | Action
--------|----------|----------------------------------
0.00s   | 0%       | Slide begins
0.60s   | 10%      | Progress bar at 10%
1.20s   | 20%      | Progress bar at 20%
1.80s   | 30%      | Progress bar at 30%
2.40s   | 40%      | Progress bar at 40%
3.00s   | 50%      | Progress bar at 50% (halfway)
3.60s   | 60%      | Progress bar at 60%
4.20s   | 70%      | Progress bar at 70%
4.80s   | 80%      | Progress bar at 80%
5.40s   | 90%      | Progress bar at 90%
6.00s   | 100%     | Slide transition → Reset to 0%
```

### Update Intervals
- **Progress Bar**: Updates every 60ms (16.67 updates/second)
- **Slide Transition**: Every 6000ms (6 seconds)
- **Countdown Timer**: Updates every 1000ms (1 second)

---

## 🔄 State Synchronization

### currentSlide ↔ isPosterVisible
```typescript
// When currentSlide changes, update isPosterVisible
useEffect(() => {
  setIsPosterVisible(currentSlide === 1)
}, [currentSlide])

// When isPosterVisible changes, update currentSlide
useEffect(() => {
  setCurrentSlide(isPosterVisible ? 1 : 0)
}, [isPosterVisible])
```

This ensures:
- Both states stay in sync
- Toggle button works correctly
- Navigation tabs reflect current view
- Poster panel slides in/out correctly

---

## 📱 Responsive Behavior

### Desktop
- Navigation bar: Horizontal layout
- Buttons: Full width with icons + text
- Progress bar: Full width below tabs

### Mobile (future enhancement)
- Navigation bar: Still horizontal (may need adjustment)
- Buttons: Icon only or smaller text
- Progress bar: Full width

---

## 🎯 Key Features Summary

### ✅ Auto-Carousel
- **6-second intervals** between slides
- **2 slides**: Event Details ↔ Event Poster
- **Spring animation** for smooth transitions
- **Continuous loop** when auto-slide is ON

### ✅ Navigation Bar
- **Visual tabs** showing current slide
- **Active highlight** with gradient
- **Manual control** to jump to any slide
- **Auto-slide toggle** to play/pause

### ✅ Progress Indicator
- **Linear progress bar** showing time remaining
- **Gradient fill** (pink to blue)
- **Real-time updates** every 60ms
- **Hidden when auto-slide is OFF**

### ✅ User Control
- **Click tab** to stop auto-slide and jump to slide
- **Toggle button** to resume/pause auto-slide
- **Visual feedback** on all interactions
- **Intuitive icons** (info, image, play/pause)

---

## 🚀 Benefits

### 🎨 Better Engagement
- Dynamic content keeps users engaged
- Automatic showcase of both info and poster
- No manual action needed to see both views

### 👆 Better Control
- Users can override automation anytime
- Quick navigation between views
- Clear visual indicators of current state

### 📊 Better UX
- Progress bar sets expectations
- Active tab shows current location
- Smooth animations feel professional
- No jarring transitions

### 🔄 Better Content Visibility
- Both event details AND poster get equal screen time
- Automatic rotation ensures nothing is missed
- Users who wait will see everything
- Users in a hurry can jump directly

---

## 🎉 Summary

The event card now features a **fully automatic carousel system** that:
1. **Auto-slides** between Event Details and Poster every 6 seconds
2. **Shows progress** with a real-time gradient progress bar
3. **Allows manual navigation** via horizontal tab buttons
4. **Pauses auto-slide** when user takes control
5. **Resumes auto-slide** when user re-enables it

All interactions are smooth, intuitive, and provide clear visual feedback! 🎨✨
