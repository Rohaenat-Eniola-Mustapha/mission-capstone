# InfraTour Design System

## Brand Identity

**Project Name:** InfraTour Nigeria
**Tagline:** Enhancing Tourism Infrastructure Accessibility

**Mission:** To provide Nigerian tourists with real-time infrastructure insights, AI-powered recommendations, and community-driven feedback for safe and informed travel decisions.

---

## Color Palette

### Primary Colors
- **Emerald Green** `#059669` (emerald-600) - Primary brand color, represents growth and nature
- **Teal** `#14b8a6` (teal-500) - Secondary accent, fresh and modern
- **Deep Emerald** `#047857` (emerald-700) - Darker variant for hover states

### Alert Colors
- **Red** `#dc2626` (red-600) - High severity alerts
- **Red Light** `#fee2e2` (red-50) - High alert backgrounds
- **Amber** `#f59e0b` (amber-500) - Medium severity alerts
- **Amber Light** `#fef3c7` (amber-50) - Medium alert backgrounds
- **Blue** `#3b82f6` (blue-500) - Low severity alerts
- **Blue Light** `#dbeafe` (blue-50) - Low alert backgrounds

### AI/Intelligence Colors
- **Indigo** `#6366f1` (indigo-500) - AI features primary
- **Purple** `#a855f7` (purple-500) - AI features secondary
- **Gradient:** `from-indigo-500 via-purple-500 to-blue-500` - AI recommendation panels

### Neutral Colors
- **White** `#ffffff` - Background, cards
- **Gray 50** `#f9fafb` - Page backgrounds
- **Gray 100** `#f3f4f6` - Light backgrounds
- **Gray 200** `#e5e7eb` - Borders
- **Gray 600** `#4b5563` - Secondary text
- **Gray 900** `#111827` - Primary text

---

## Typography

### Font Family
- **Primary:** System font stack (default Tailwind)
- **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Font Sizes
- **4xl** (36px) - Page headers, hero titles
- **2xl** (24px) - Section headers
- **xl** (20px) - Subheaders
- **lg** (18px) - Card titles, prominent text
- **base** (16px) - Body text
- **sm** (14px) - Secondary text, labels
- **xs** (12px) - Captions, meta information

### Font Weights
- **Bold** (700) - Headlines, primary CTAs
- **Semibold** (600) - Subheadings, card titles
- **Medium** (500) - Navigation items, buttons
- **Normal** (400) - Body text

---

## Component Specifications

### Buttons

**Primary Button (CTA)**
```
Background: emerald-600 (#059669)
Hover: emerald-700 (#047857)
Text: white
Padding: px-8 py-4
Border Radius: rounded-lg (8px)
Font: font-semibold
Shadow: shadow-lg
Transition: all 200ms
```

**Secondary Button**
```
Background: white
Border: 1px solid gray-300
Hover: bg-gray-50
Text: gray-700
Padding: px-4 py-2
Border Radius: rounded-md (6px)
```

### Cards

**Site Card**
```
Background: white
Border: 1px solid gray-200
Border Radius: rounded-lg (8px)
Shadow: shadow-sm
Hover Shadow: shadow-lg
Hover Border: emerald-300
Padding: p-5
Image Height: h-48 (192px)
Transition: all 200ms
```

**Alert Panel**
```
Background: white
Border: 1px solid gray-200
Border Radius: rounded-lg (8px)
Padding: p-6
Shadow: shadow-sm
```

### Alert Badges

**High Severity**
```
Background: red-100
Text: red-800
Border: 1px solid red-200
Icon: AlertTriangle
```

**Medium Severity**
```
Background: amber-100
Text: amber-800
Border: 1px solid amber-200
Icon: AlertCircle
```

**Low Severity**
```
Background: blue-100
Text: blue-800
Border: 1px solid blue-200
Icon: Info
```

### Navigation Bar

```
Background: white
Border Bottom: 1px solid gray-200
Height: h-16 (64px)
Shadow: shadow-sm
Logo Size: 32px (h-8 w-8)
Active Link: emerald-700 bg + emerald-50
Inactive Link: gray-700, hover:emerald-600
```

### AI Recommendation Panel

```
Background: gradient from blue-50 via indigo-50 to purple-50
Border: 1px solid indigo-200
Border Radius: rounded-lg (8px)
Shadow: shadow-md
Padding: p-6
Icon: Brain (indigo-600)
Confidence Badge: Dynamic color based on score
  - High (≥80%): emerald-700 bg + emerald-100
  - Medium (≥60%): amber-700 bg + amber-100
  - Low (<60%): gray-700 bg + gray-100
```

### Feedback Form

```
Background: white
Border: 1px solid gray-200
Border Radius: rounded-lg (8px)
Shadow: shadow-sm
Padding: p-6
Input Border: gray-300
Focus Ring: 2px emerald-500
Star Rating: yellow-400 (filled), gray-300 (empty)
Submit Button: emerald-600 bg, white text
```

---

## Layout & Spacing

### Container
- **Max Width:** 7xl (1280px)
- **Padding:** px-4 sm:px-6 lg:px-8

### Grid Systems
- **Site Cards Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Feature Cards:** `grid-cols-1 md:grid-cols-3 gap-8`
- **Site Detail Layout:** `grid-cols-1 lg:grid-cols-3 gap-8` (2/3 content, 1/3 sidebar)

### Spacing Scale (Tailwind)
- **xs:** 1 (4px)
- **sm:** 2 (8px)
- **md:** 4 (16px)
- **lg:** 6 (24px)
- **xl:** 8 (32px)
- **2xl:** 12 (48px)

---

## Icons

**Library:** Lucide React
**Default Size:** h-5 w-5 (20px) for inline, h-6 w-6 (24px) for section headers

**Primary Icons:**
- MapPin - Location, sites, branding
- AlertTriangle - High severity alerts
- AlertCircle - Medium severity alerts
- Info - Low severity alerts
- Brain - AI recommendations
- Shield - Safety features
- TrendingUp - Analytics, confidence scores
- MessageSquare - Feedback
- Star - Ratings
- Send - Submit actions
- Search - Search functionality
- ArrowLeft - Back navigation
- Loader2 - Loading states (animated spin)

---

## Responsive Design

### Breakpoints
- **sm:** 640px - Small tablets
- **md:** 768px - Tablets
- **lg:** 1024px - Laptops
- **xl:** 1280px - Desktops

### Mobile-First Approach
- Stack cards vertically on mobile
- Single column layouts on small screens
- Hamburger menu (if needed in future iterations)
- Touch-friendly tap targets (min 44px)

---

## Animation & Transitions

### Standard Transitions
- **Duration:** 200ms
- **Easing:** ease-in-out (default)

### Hover Effects
- **Cards:** Scale slight (transform), shadow increase, border color change
- **Buttons:** Background color darkening, slight lift (translateY -1px)
- **Links:** Color change to emerald-600

### Loading States
- **Spinner:** Rotating border animation
- **Skeleton:** Pulse animation on gray-200 backgrounds

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum for body text)
- Alert colors provide sufficient contrast against backgrounds

### Focus States
- **Ring:** 2px solid emerald-500
- **Offset:** 2px from element

### Screen Readers
- Semantic HTML (nav, main, article, section)
- Alt text for all images
- ARIA labels where necessary

---

## User Experience Patterns

### Information Hierarchy
1. **Primary:** Site name, alerts, AI recommendations
2. **Secondary:** Location, ratings, feedback
3. **Tertiary:** Timestamps, metadata

### Call-to-Action Priority
1. **Primary CTA:** "Explore Tourist Sites" (homepage), "Submit Feedback" (site detail)
2. **Secondary CTA:** "View Details" links, navigation items

### Feedback Mechanisms
- Success messages: emerald-50 background, emerald-700 text, 3-second auto-dismiss
- Error messages: red-50 background, red-700 text, manual dismiss
- Loading indicators: Spinner with descriptive text

---

## Design Inspiration

**Style:** Modern, clean, trustworthy with vibrant accents
**Feel:** Professional yet accessible, data-driven but human-centered
**Mood:** Optimistic, empowering, informative

**Similar Sites for Reference:**
- Airbnb (card layouts, imagery)
- TripAdvisor (reviews, ratings)
- Government service sites (trust, clarity)
- Travel apps (exploration, discovery)
