# 🎨 Event Card Visual Guide

## New Layout Structure

### Overall Page Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────────┐
│                      UPCOMING EVENTS                                │
│                                                                     │
│  ┌────────────────────┬───────────────────────────────────────────┐│
│  │                    │  ┌─────────────────────────────────────┐  ││
│  │                    │  │     EVENT BANNER IMAGE (h-32)       │  ││
│  │    HEXAGONS        │  │     [Gradient overlay]               │  ││
│  │    (35% width)     │  └─────────────────────────────────────┘  ││
│  │                    │                                            ││
│  │   🔶 🔶 🔶         │  ┌───────────────┬──────────────────────┐ ││
│  │    🔶 🔶           │  │ LEFT COLUMN   │  RIGHT COLUMN        │ ││
│  │   🔶 🔶 🔶         │  │               │                      │ ││
│  │                    │  │ Event Name:   │  What to Expect:     │ ││
│  │                    │  │ [Gradient]    │  [Description...]    │ ││
│  │                    │  │               │                      │ ││
│  │                    │  │ Date & Time:  │  Event Starts In:    │ ││
│  │                    │  │ Oct 17, 2025  │  ┌──┬──┬──┬──┐      │ ││
│  │                    │  │               │  │DD│HH│MM│SS│      │ ││
│  │                    │  │ Speaker:      │  └──┴──┴──┴──┘      │ ││
│  │                    │  │ Dr. Smith     │                      │ ││
│  │                    │  │               │  ┌────────────────┐  │ ││
│  │                    │  │ Venue:        │  │ REGISTER BTN   │  │ ││
│  │                    │  │ Main Hall     │  └────────────────┘  │ ││
│  │                    │  │               │                      │ ││
│  │                    │  │ Fee: FREE     │                      │ ││
│  │                    │  └───────────────┴──────────────────────┘ ││
│  │                    │          [🖼️ View Poster]                 ││
│  └────────────────────┴───────────────────────────────────────────┘│
│                          ● ● ● (Event Dots)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Content Distribution

### Left Column (Event Details)
```
┌─────────────────────────┐
│ Event Name:             │
│ HACKATHON 2025         │ ← text-xl, gradient
│                         │
│ Date & Time:            │
│ Oct 17, 2025 at 10:00  │ ← text-base, white
│                         │
│ Speaker:                │
│ Dr. Jane Smith          │ ← text-base, white
│                         │
│ Venue:                  │
│ Main Auditorium         │ ← text-base, white
│                         │
│ Registration Fee:       │
│ FREE                    │ ← text-2xl, green
└─────────────────────────┘
```

### Right Column (Countdown & CTA)
```
┌─────────────────────────┐
│ What to Expect:         │
│ An exciting event...    │ ← text-sm, gray-300
│ [full description]      │
│                         │
│ Event Starts In:        │
│ ┌────┬────┬────┬────┐  │
│ │ 15 │ 08 │ 42 │ 23 │  │ ← Countdown boxes
│ └────┴────┴────┴────┘  │
│ Days  Hrs  Min  Sec    │
│                         │
│ ┌───────────────────┐   │
│ │ CLICK TO REGISTER │   │ ← Gradient button
│ └───────────────────┘   │
└─────────────────────────┘
```

---

## Size Specifications

### Container Widths
- **Overall container**: `max-w-[95%]` (95% of viewport)
- **Hexagons section**: `35%` of container
- **Event card**: `65%` of container

### Event Card Dimensions
- **Banner height**: `128px` (h-32)
- **Content padding**: `24px` (p-6)
- **Grid gap**: `24px` (gap-6)
- **Column spacing**: `12px` (space-y-3 and space-y-4)

### Typography Sizes
- **Section title**: `text-4xl md:text-5xl` (UPCOMING EVENTS)
- **Event name**: `text-xl` (~20px)
- **Labels**: `text-xs` (~12px)
- **Content text**: `text-sm` (~14px) and `text-base` (~16px)
- **Fee**: `text-2xl` (~24px)
- **Countdown digits**: `text-2xl` (~24px)

### Interactive Elements
- **Countdown boxes**: `50px` minimum width
- **Register button**: Full width with `p-4` padding
- **Navigation arrows**: `20px` icons in `40px` buttons
- **Poster toggle**: Rounded pill button at bottom center

---

## Color Scheme

### Backgrounds
- **Event card**: `from-[#1a1c3a] via-[#0d1b3d] to-[#1a1c3a]` (dark blue gradient)
- **Banner**: `from-[#F24DC2] to-[#2C97FF]` (pink to blue gradient)
- **Countdown boxes**: `bg-black/50` with red borders
- **Register button**: `from-[#F24DC2] to-[#2C97FF]` (gradient)

### Text Colors
- **Event name**: Gradient (pink → blue)
- **Labels**: `text-gray-400` (#9CA3AF)
- **Content**: `text-white` (#FFFFFF)
- **Description**: `text-gray-300` (#D1D5DB)
- **Fee**: `text-green-400` (#4ADE80)
- **Countdown**: `text-red-500` (#EF4444)

---

## Poster Modal

### When Opened
```
┌─────────────────────────────────────────────────────────────┐
│                    [X] Close                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │                                                         │  │
│  │              EVENT POSTER IMAGE                         │  │
│  │              (Large, centered)                          │  │
│  │                                                         │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│              [Blurred background overlay]                   │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Full-screen overlay with `bg-black/80` backdrop
- Blur effect on background (`backdrop-blur-sm`)
- Close button in top-right corner
- Click outside to close
- Smooth spring animation on open/close
- Max width: `4xl` (896px)
- Max height: `90vh`

---

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout (hexagons on top, event card below)
- Event card content: Single column
- Banner height: Same (h-32)
- Full width cards

### Tablet (768px - 1024px)
- Side-by-side layout begins
- Event card: Two columns
- Adjusted spacing

### Desktop (> 1024px)
- Full side-by-side layout (35% / 65%)
- Two-column event card grid
- Optimal spacing and typography

---

## Animation States

### Countdown Timer
- Updates every second
- Red glow effect (`textShadow`)
- Hover: Slight scale increase

### Register Button
- Hover: Scale to 1.02
- Click: Scale to 0.98
- Animated pointer (👆) moves left-right

### Navigation Arrows
- Hover: Scale to 1.1
- Click: Scale to 0.9
- Smooth transitions

### Poster Modal
- Open: Spring animation (scale + fade)
- Close: Reverse animation
- Backdrop: Fade in/out

---

## Best Practices Applied

✅ **No scrolling** - All content visible at once  
✅ **Clear hierarchy** - Important info stands out  
✅ **Proper spacing** - Breathing room between elements  
✅ **Readable fonts** - Increased from tiny to comfortable sizes  
✅ **Touch targets** - All buttons are adequately sized  
✅ **Accessibility** - Proper labels and ARIA-friendly  
✅ **Performance** - Smooth animations, efficient rendering  
✅ **Responsive** - Works on all screen sizes  

---

## User Flow

1. **Page loads** → See hexagons and first event card
2. **Read event details** → All info visible without scrolling
3. **View countdown** → Real-time countdown to event
4. **Click register** → Opens registration link in new tab
5. **View poster** → Click button → Modal opens
6. **Navigate events** → Use arrows or dots to switch
7. **Mobile experience** → Stack layout, same functionality
