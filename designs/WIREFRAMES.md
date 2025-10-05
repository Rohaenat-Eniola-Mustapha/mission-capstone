# InfraTour Wireframes

This document describes the wireframe layouts for all major pages. In a production environment, these would be exported as PNG images from Figma or similar design tools.

---

## 1. Home Page Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] InfraTour                         Home | Tourist Sites   │
│ Nigeria Tourism Platform                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                      [MapPin Icon]                               │
│                                                                   │
│                   InfraTour Nigeria                              │
│                                                                   │
│    A digital framework enhancing tourism infrastructure          │
│    accessibility across Nigeria. Get real-time alerts,           │
│    AI-powered recommendations, and community insights.           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ [Brain Icon] AI-Powered Travel Insights                         │
│                                                                   │
│ Our intelligent system analyzes infrastructure alerts and        │
│ visitor feedback to provide personalized recommendations...      │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │      3      │  │      4      │  │      5      │            │
│  │ Safe Sites  │  │Total Destin.│  │Active Alerts│            │
│  │   Today     │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘

┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ [Shield Icon] │  │  [Brain Icon] │  │[TrendUp Icon] │
│ Real-Time     │  │      AI       │  │  Community    │
│   Alerts      │  │Recommendations│  │   Insights    │
│               │  │               │  │               │
│ Stay informed │  │ Get intelligent│ │ Access verified│
│ about infra...│  │ suggestions...│  │ visitor reviews│
└───────────────┘  └───────────────┘  └───────────────┘

[!] High Priority Alerts (if any)
• Site Name: Alert message here...

                    [Explore Tourist Sites]
```

**Key Elements:**
- Hero section with branding and mission statement
- AI insights panel with metrics (gradient background)
- Three feature cards highlighting core capabilities
- High priority alerts section (conditional)
- Primary CTA to explore sites
- Clean, modern layout with ample whitespace

---

## 2. Tourist Sites List Page Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] InfraTour                         Home | Tourist Sites   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│              Nigerian Tourist Sites                              │
│                                                                   │
│    Explore Nigeria's diverse attractions with real-time          │
│    infrastructure insights and AI-powered recommendations.       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ [Search Icon] Search by name, state, or description...          │
└─────────────────────────────────────────────────────────────────┘

Showing 4 of 4 sites

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│              │  │              │  │              │
│  [Image or]  │  │  [Image or]  │  │  [Image or]  │
│  [Gradient]  │  │  [Gradient]  │  │  [Gradient]  │
│              │  │  [2 Alerts]  │  │              │
│──────────────│  │──────────────│  │──────────────│
│ Site Name    │  │ Site Name    │  │ Site Name    │
│              │  │              │  │              │
│ [Pin] State  │  │ [Pin] State  │  │ [Pin] State  │
│              │  │              │  │              │
│ Description  │  │ Description  │  │ Description  │
│ truncated... │  │ truncated... │  │ truncated... │
│              │  │              │  │              │
│ View Details→│  │ View Details→│  │ View Details→│
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐
│              │
│  [Image or]  │
│  [Gradient]  │
│              │
│──────────────│
│ Site Name    │
│              │
│ [Pin] State  │
│              │
│ Description  │
│ truncated... │
│              │
│ View Details→│
└──────────────┘
```

**Key Elements:**
- Header with page title and description
- Search bar with icon (full-width)
- Result count display
- Grid of site cards (3 columns on desktop, responsive)
- Each card shows:
  - Hero image or gradient placeholder
  - Alert badge (if active alerts exist)
  - Site name (bold)
  - Location with pin icon
  - Truncated description
  - "View Details" link
- Cards have hover effects (shadow, border color change)

---

## 3. Site Detail Page Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] InfraTour                         Home | Tourist Sites   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                     [Hero Image or Gradient]                     │
│                     [Large Background Image]                     │
│                                                                   │
│  ← Back to sites                                                 │
│  Site Name (Large, Bold, White Text)                            │
│  [Pin] State Name    [Star] 4.5 / 5.0                           │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┐  ┌────────────────────────┐
│                                   │  │                        │
│  About This Site                  │  │  [Brain] AI            │
│  ─────────────────               │  │  Recommendation        │
│                                   │  │  ──────────────────    │
│  Full description of the tourist  │  │  Confidence: 92%       │
│  site with comprehensive details  │  │                        │
│  about amenities, history, and    │  │  [Recommendation text] │
│  attractions...                   │  │  [Detailed suggestion] │
│                                   │  │  [with analysis...]    │
│  ─────────────────────────────────│  │                        │
│                                   │  │  Generated: timestamp  │
│  [!] Active Alerts                │  └────────────────────────┘
│  ─────────────────               │
│                                   │
│  [High] Road Condition            │
│  Date: 2025-01-15                 │
│  Message: Road access affected... │
│                                   │
│  [Medium] Facility                │
│  Date: 2025-01-10                 │
│  Message: Cable car reduced...    │
│                                   │
│  ─────────────────────────────────│
│                                   │
│  [Chat] Visitor Feedback          │
│  ─────────────────               │
│                                   │
│  John Doe   ★★★★★   Jan 5, 2025  │
│  Amazing experience! The site...  │
│                                   │
│  Sarah Lee  ★★★★☆   Jan 3, 2025  │
│  Great location but roads need... │
│                                   │
│  ─────────────────────────────────│
│                                   │
│  Share Your Experience            │
│  ─────────────────               │
│                                   │
│  Rating (Optional)                │
│  ☆ ☆ ☆ ☆ ☆                       │
│                                   │
│  Your Feedback *                  │
│  ┌──────────────────────────────┐│
│  │                              ││
│  │ [Text area]                  ││
│  │                              ││
│  └──────────────────────────────┘│
│                                   │
│  [Submit Feedback]                │
│                                   │
└───────────────────────────────────┘
```

**Key Elements:**

**Hero Section:**
- Full-width hero image (or gradient)
- Overlay with site name, location, rating
- Back navigation link

**Two-Column Layout:**

**Left Column (2/3 width):**
1. About section with full description
2. Active Alerts panel (if any)
   - Severity badges
   - Alert type and message
   - Timestamp
3. Visitor Feedback section
   - User name, star rating, date
   - Feedback message
   - Limited to 5 recent entries
4. Feedback Form
   - Optional star rating selector
   - Required text area
   - Submit button

**Right Column (1/3 width - Sticky):**
- AI Recommendation Panel
  - Brain icon
  - Confidence percentage
  - Recommendation text
  - Generation timestamp

**Responsive:** Stacks to single column on mobile devices

---

## 4. Component: Alert Badge

```
┌─────────────────────┐
│ [!] High            │  Red background
└─────────────────────┘

┌─────────────────────┐
│ [!] Medium          │  Amber background
└─────────────────────┘

┌─────────────────────┐
│ [i] Low             │  Blue background
└─────────────────────┘
```

---

## 5. Component: Site Card (Detailed)

```
┌─────────────────────────────┐
│                             │
│   [Image: 192px height]     │
│   or Gradient Placeholder   │
│        [Alert Badge]        │  (top-right if alerts)
│                             │
├─────────────────────────────┤
│ Site Name (Large, Bold)     │
│                             │
│ [MapPin] State Name         │
│                             │
│ Short description of the    │
│ site truncated to 2 lines..│
│                             │
│ View Details →              │
│                             │
└─────────────────────────────┘
```

**States:**
- Default: white background, gray border, subtle shadow
- Hover: emerald border, larger shadow, scale content
- With Alerts: red badge in top-right corner

---

## 6. Component: Navbar

```
┌─────────────────────────────────────────────────────────────────┐
│ [MapPin]  InfraTour                         Home | Tourist Sites│
│           Nigeria Tourism Platform                              │
└─────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Left: Logo (MapPin icon) + Brand name + Tagline
- Right: Navigation links (Home, Tourist Sites)
- Active link: emerald background highlight
- Height: 64px
- Border bottom, subtle shadow

---

## Notes for Designers

1. **Imagery:** Use placeholder gradients (emerald to teal) if actual site photos unavailable
2. **Icons:** All from Lucide React library, consistent 20-24px sizing
3. **Spacing:** 8px base unit, generous padding for readability
4. **Typography:** Clear hierarchy with 4xl headers down to xs captions
5. **Mobile:** All layouts should gracefully collapse to single column
6. **Interactions:** Smooth transitions (200ms) on all interactive elements
7. **Loading States:** Include spinner animations for async operations
8. **Empty States:** Provide friendly messages when no data exists

---

These wireframes represent the functional layout and content hierarchy. The actual visual design incorporates the color palette, typography, and component styles defined in DESIGN_OVERVIEW.md.
