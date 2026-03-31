# Ice Tangerine Font Changes QA Checklist

## Migration Status

**Completed (headings use Space Grotesk):**
- ✅ `src/app/blog/page.tsx`
- ✅ `src/app/product/page.tsx`
- ✅ `src/components/GetEarlyAccess.tsx`
- ✅ `src/components/SimpleCTA.tsx`
- ✅ `src/components/AgentShift.tsx`
- ✅ `src/components/LivingDocHomepage.tsx` (home page hero)
- ✅ `src/components/TelemetryVisualization.tsx` (home page section)
- ✅ `src/app/globals.css` (blog post styles)

**Still need headings updated to Space Grotesk:**
- [ ] `src/components/DownloadADE.tsx`
- [ ] `src/components/LogToEventDecomposition.tsx`
- [ ] `src/components/ANewMedium.tsx`
- [ ] `src/components/WhyTeamsUse.tsx`
- [ ] `src/components/LivingDocumentationSection.tsx`
- [ ] `src/app/community/page.tsx`
- [ ] `src/app/about/page.tsx` (if exists)

**No changes needed (no headings or already correct):**
- ✅ `src/components/Header.tsx`
- ✅ `src/components/Footer.tsx`
- ✅ `src/components/CompleteLivingDocWebsite.tsx` (wrapper only)

---

## Typography System
- **Headlines/Headings**: `var(--font-space-grotesk)` (Space Grotesk)
- **Body text**: `var(--font-inter)` (Inter)
- **Monospace/Code**: `monospace` or `var(--font-fira-code)`

---

## Pages/Components to QA

### ✅ Home Page (DONE - ready for QA)
**LivingDocHomepage** - Hero section
- [ ] "Story-Based Monitoring" - **Space Grotesk**
- [ ] "for the Agent Era" - **Space Grotesk**
- [ ] Benefit list items - Inter

**TelemetryVisualization** - Why we built this
- [ ] "Monitoring starts from the wrong end." - **Space Grotesk**
- [ ] "Traditional Monitoring" card title - **Space Grotesk**
- [ ] "Story-Based Monitoring" card title - **Space Grotesk**
- [ ] Body text - Inter

**AgentShift** - Three features section
- [ ] "Three features. One platform." - **Space Grotesk**
- [ ] Body text - Inter

**SimpleCTA** - Final CTA
- [ ] "Ready to see the story?" - **Space Grotesk**
- [ ] Body text - Inter

### ✅ Blog Page (DONE - ready for QA)
- [ ] Blog card titles - **Space Grotesk**
- [ ] Blog card date - Inter (primary color)
- [ ] Blog card excerpt - Inter

### ✅ Product Page (DONE - ready for QA)
- [ ] "Story-based software" headline - **Space Grotesk**
- [ ] All section headings (h1, h2) - **Space Grotesk**
- [ ] Body paragraphs - Inter
- [ ] Buttons - Inter

### ✅ Early Access Page (DONE - ready for QA)
- [ ] "Get Early Access" headline - **Space Grotesk**
- [ ] "You're in." success message - **Space Grotesk**
- [ ] Form labels/inputs - Inter

### ⏳ Still Need Heading Updates
**DownloadADE.tsx**
- [ ] Headings need Space Grotesk

**ANewMedium.tsx**
- [ ] "A new workflow..." headline needs Space Grotesk
- [ ] Step numbers/titles need Space Grotesk

**WhyTeamsUse.tsx**
- [ ] Section headings need Space Grotesk

**LivingDocumentationSection.tsx**
- [ ] Section headings need Space Grotesk

**community/page.tsx**
- [ ] Page headings need Space Grotesk

---

## Global Styles (`src/app/globals.css`)
- [ ] Blog post H1 - **Space Grotesk**
- [ ] Blog post H2 - **Space Grotesk**
- [ ] Blog post H3 - **Space Grotesk**
- [ ] Blog post body - Inter (implicit via font-family inheritance)

---

## Summary of Changes
| Element Type | Old Font | New Font |
|-------------|----------|----------|
| Headlines | SF Pro Display / system | Space Grotesk |
| Body text | SF Pro Display / system | Inter |
| Code/Terminal | JetBrains Mono / various | monospace |
| Navigation | Geist Sans / system | Inter |

---

## Notes
- Components currently use `theme.colors.xxx` via `useTheme()` hook
- Remote commit used hardcoded `COLORS.xxx` constants
- Our approach: theme object provides colors, CSS vars provide fonts
- Fonts load via Next.js `next/font/google` in `layout.tsx`
