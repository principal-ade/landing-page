# Storybook Setup for Landing Page Components

Storybook has been successfully configured for your landing page! This allows you to develop and preview landing page sections in isolation, making it easier to add new sections without running the entire application.

## Quick Start

```bash
npm run storybook
```

This will start Storybook at [http://localhost:6006](http://localhost:6006)

## Available Stories

### 1. Section Component (Most Important!)

**Location:** `src/components/stories/Section.stories.tsx`

The `Section` component is the **primary building block** for adding new sections to your landing page. It provides a consistent layout with:
- Text content on the left or right
- Media content (images, videos, or custom components)
- Different background styles (primary, secondary, or grid)
- Mobile-responsive layouts

#### Stories Available:
- **TextLeft** - Basic section with text on the left
- **TextRight** - Section with text on the right
- **WithVideo** - Section with video media
- **GridBackground** - Section with technical grid background
- **MobileLayout** - Preview mobile responsive layout
- **WithRichContent** - Section with JSX/rich content

## How to Add a New Section to the Landing Page

1. **Start Storybook:**
   ```bash
   npm run storybook
   ```

2. **Navigate to "Landing Page/Section"** in the Storybook sidebar

3. **Choose a story that matches your needs** (e.g., TextLeft, WithVideo, etc.)

4. **Customize the content** in the story controls:
   - Change the `title` and `description`
   - Update `textPosition` (left or right)
   - Select a `background` style (primary, secondary, grid)
   - Replace the `media` placeholder with your content

5. **Copy the Section code** to your `LandingPage.tsx` component

### Example: Adding a New Feature Section

```tsx
<Section
  id="your-new-feature"
  textPosition="left"
  background="grid"
  title="Your New Feature Title"
  description="Explain your feature here. You can use plain text or JSX for rich content."
  media={
    <div
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
        <source src="/your-video.mov" type="video/mp4" />
      </video>
    </div>
  }
  isMobile={isMobile}
/>
```

## Section Component Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | string | Unique identifier for the section (used for scroll navigation) |
| `textPosition` | 'left' \| 'right' | Position of text relative to media |
| `background` | 'primary' \| 'secondary' \| 'grid' | Background style |
| `title` | string | Section title |
| `description` | string \| ReactNode | Section description (can be rich JSX) |
| `media` | ReactNode | Media content (images, videos, custom components) |
| `isMobile` | boolean | Enable mobile layout |

## Tips for Adding New Sections

1. **Alternate text position** - Use `textPosition="left"` and `textPosition="right"` alternately for visual variety

2. **Choose appropriate backgrounds:**
   - `primary` - Default background color
   - `secondary` - Slightly different shade for contrast
   - `grid` - Technical grid pattern (great for dev tools)

3. **Media content ideas:**
   - Static images using Next.js `Image` component
   - Looping videos (use `autoPlay loop muted playsInline`)
   - Interactive components (like the EngineeringContextSection)
   - Custom visualizations

4. **Add scroll navigation** - Use the `id` prop to enable smooth scrolling from the hero section's quick links

5. **Test mobile layout** - Toggle `isMobile` in Storybook to preview responsive behavior

## Scripts

- `npm run storybook` - Start Storybook dev server
- `npm run build-storybook` - Build Storybook for deployment

## Configuration

Storybook configuration is located in:
- `.storybook/main.ts` - Main configuration
- `.storybook/preview.ts` - Preview configuration (if needed)

## Troubleshooting

### Stories not loading?
Make sure you're using the correct import for `ClientThemeProvider`:
```tsx
import ClientThemeProvider from '../providers/ClientThemeProvider'; // default import
```

### Need to add more stories?
Create new `.stories.tsx` files in `src/components/stories/` following the pattern of existing stories.

## Next Steps

1. Open Storybook at http://localhost:6006
2. Explore the Section component stories
3. Start building your new landing page sections!
4. Test different layouts and content combinations
5. Copy the working code to your `LandingPage.tsx` component

Happy building! 🎉
