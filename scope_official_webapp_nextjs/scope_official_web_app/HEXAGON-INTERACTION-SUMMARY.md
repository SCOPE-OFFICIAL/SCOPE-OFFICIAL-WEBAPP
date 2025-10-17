# Hexagon Interactive Selection Feature

## Overview
Implemented interactive hexagon functionality where each hexagon cell represents an upcoming event and clicking it displays that event's details in the event container.

## Features Implemented

### 1. **Interactive Hexagon Grid**
- **Total hexagons**: 8 cells arranged in honeycomb pattern
  - Row 1: 3 hexagons (indices 0, 1, 2)
  - Row 2: 2 hexagons (indices 3, 4)
  - Row 3: 3 hexagons (indices 5, 6, 7)
- Each hexagon represents one upcoming event
- Empty hexagons (no event data) are not clickable and greyed out

### 2. **Random Initial Selection**
- On page load, a random upcoming event is automatically selected
- The corresponding hexagon shows pink highlight
- Event container displays that event's details

### 3. **Click-to-Select Functionality**
- Click any hexagon with event data to select it
- Selected hexagon shows:
  - **Full opacity pink border** (`opacity-100`)
  - Brighter visual indication
- Unselected hexagons show:
  - **Semi-transparent pink border** (`opacity-35`)
  - Dimmer appearance

### 4. **Visual Feedback**
- **Cursor changes**:
  - `cursor-pointer` on clickable hexagons (with events)
  - `cursor-not-allowed` on empty hexagons
- **Hover effects**:
  - Only active on hexagons with events
  - Scale animation on hover
- **Smooth transitions**:
  - Border opacity transitions with `duration-300`

### 5. **Event Container Integration**
- Event container shows content for selected event
- Includes all event details:
  - Banner image
  - Event name, date/time, speaker, venue