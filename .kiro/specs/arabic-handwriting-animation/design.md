# Design Document

## Overview

The Arabic handwriting animation will replace the current typewriter effect with a more culturally authentic handwritten animation. This will be implemented using SVG path animations combined with CSS transforms to create the illusion of text being written by hand from right to left, following Arabic writing conventions.

## Architecture

### Component Structure
- **ArabicHandwritingText**: New component replacing ArabicWritingText
- **SVG-based animation**: Using stroke-dasharray and stroke-dashoffset for path drawing
- **Framer Motion integration**: For additional transform animations and accessibility controls
- **Fallback mechanism**: Static text for users with motion preferences disabled

### Animation Approach
1. **SVG Path Generation**: Convert Arabic text to SVG paths that can be animated
2. **Stroke Animation**: Use CSS animations to draw paths progressively
3. **Right-to-Left Flow**: Ensure animation direction matches Arabic writing direction
4. **Timing Control**: Stagger individual character/word animations for natural flow

## Components and Interfaces

### ArabicHandwritingText Component
```typescript
interface ArabicHandwritingTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  strokeColor?: string;
}
```

### Animation States
```typescript
type AnimationState = 'idle' | 'writing' | 'complete';

interface AnimationConfig {
  pathLength: number;
  duration: number;
  delay: number;
  easing: string;
}
```

## Data Models

### SVG Path Data
```typescript
interface ArabicCharacterPath {
  character: string;
  path: string;
  viewBox: string;
  strokeOrder: number[];
}

interface TextPathData {
  characters: ArabicCharacterPath[];
  totalWidth: number;
  totalHeight: number;
  rtlPositions: number[];
}
```

## Implementation Strategy

### Phase 1: SVG Path Generation
- Research Arabic font SVG conversion libraries
- Evaluate options like:
  - `opentype.js` for font path extraction
  - `svg-path-commander` for path manipulation
  - Custom Arabic calligraphy SVG paths
- Create utility functions to convert text to animatable paths

### Phase 2: Animation Engine
- Implement stroke-dasharray animation for path drawing
- Add proper RTL positioning and timing
- Integrate with Framer Motion for enhanced controls
- Add accessibility considerations (prefers-reduced-motion)

### Phase 3: Integration
- Replace existing ArabicWritingText component
- Update Header component to use new animation
- Ensure responsive behavior across screen sizes
- Test performance and optimize if needed

## Technical Considerations

### Font Handling
- The current implementation uses a custom Arabic font (`font-arabic`)
- Need to either:
  - Extract paths from the existing font file
  - Use a pre-made Arabic calligraphy SVG font
  - Create custom SVG paths for the specific text

### Performance
- SVG animations are hardware-accelerated
- Use `will-change: transform` for optimization
- Implement animation cleanup to prevent memory leaks
- Consider using `requestAnimationFrame` for complex timing

### Browser Compatibility
- SVG stroke animations are well-supported
- Fallback to CSS transforms for older browsers
- Ensure graceful degradation

## Error Handling

### Animation Failures
- Fallback to static text if SVG generation fails
- Graceful handling of missing font data
- Error boundaries around animation components

### Performance Issues
- Timeout mechanisms for long-running animations
- Reduced complexity fallbacks for low-end devices
- Memory cleanup after animation completion

## Testing Strategy

### Unit Tests
- SVG path generation accuracy
- Animation timing calculations
- Accessibility feature compliance
- Component prop handling

### Integration Tests
- Header component integration
- Responsive behavior testing
- Cross-browser animation consistency
- Performance benchmarking

### Accessibility Tests
- Screen reader compatibility
- Reduced motion preference handling
- Keyboard navigation impact
- Color contrast in different states

## Dependencies

### New Dependencies
- `opentype.js` or similar for font path extraction (if needed)
- Potentially a specialized Arabic text-to-SVG library

### Existing Dependencies
- Framer Motion (already installed) for enhanced animations
- React hooks for state management
- Tailwind CSS for styling

## Migration Plan

1. Create new ArabicHandwritingText component alongside existing one
2. Test thoroughly in isolation
3. Update Header component to use new component
4. Remove old ArabicWritingText component
5. Update any other usages if they exist