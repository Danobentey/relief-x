# style_guide.md

## Colors
primary_turquoise: "#40E0D0"
neutral_white: "#FFFFFF"
text_primary: "#333333"
text_secondary: "#666666"
success_green: "#4CAF50"
error_red: "#F44336"

### Semantic Mapping (to use in code)
- brandPrimary -> primary_turquoise
- background -> neutral_white
- textPrimary -> text_primary
- textSecondary -> text_secondary
- success -> success_green
- error -> error_red

## Typography
heading: { font: "Roboto", size: 20-24px, weight: "bold" }
body: { font: "Roboto", size: 16px, weight: "regular" }
small: { font: "Roboto", size: 14px, weight: "regular" }
button: { font: "Roboto", size: 16px, weight: "semibold" }

### Guidance
- Line height: heading 1.3x, body 1.45x, small 1.4x.
- Do not reduce body below 14px for accessibility.

## Components
### Buttons
- primary_cta: turquoise_bg + white_text + 8px_radius
- secondary: white_bg + turquoise_border + turquoise_text
- text_button: turquoise_text only

States (all): default, pressed (reduce opacity 0.85), disabled (reduce opacity 0.5), loading (spinner replaces label, preserve height).

### Cards
white_bg + subtle_shadow + 8px_radius + 16px_padding
Shadow (iOS): { color: #000, opacity: 0.06, radius: 6, offset: {0,2} }
Elevation (Android): 2

### Forms
8px_radius + floating_labels + red_error_state
Error text: error_red, size small.
Focus ring: 1px border primary_turquoise.

### Navigation
bottom_tab_nav: home, videos, progress, profile
active_color: primary_turquoise
inactive_color: #999999 (medium gray)
Icon size: 24px
Label size: 12px (optional, if used)

## Interaction
- loading: skeleton_loader (pulse shimmer base: #E0E0E0 highlight: #F5F5F5)
- errors: friendly_text (avoid technical jargon)
- success: subtle_green_check (success_green icon, no intrusive modal)
- transitions: native_default (avoid custom heavy animations MVP)

## Spacing Scale
0,4,8,12,16,20,24,32 (base unit 4px)

## Border Radius Scale
sm:4 md:8 lg:16 pill:999

## Accessibility Notes
- Minimum contrast ratio 4.5:1 for body text.
- Tap targets min 44x44.
- Support dynamic type up to +2 steps.

## Naming Conventions (Code)
Export tokens in camelCase: primaryTurquoise, textPrimary, successGreen.
Use semantic aliases where possible: brandPrimary, error, success.

## Implementation TODO
- Extract final hex values from Figma tokens if they differ.
- Confirm heading exact sizes per each screen variant.
- Add dark mode palette (post-MVP if required).

## Versioning
Style guide version: 1.0 (2025-09-18)
Change Log:
- 1.0: Finalized color + typography tokens (Task 2); added state colors & disabled variants; locked scale.
- 0.2: Added full typography scale (H1–H5, body variants, caption), semantic palette mapping, contrast verification results (Tasks 3,4,5).
- 0.1: Initial draft created from provided values.

---

## Final Tokens (Reference)
Colors (semantic): brandPrimary(#40E0D0), brandPrimaryPressed(#27B5A8), brandPrimarySubtle(#E0FBF8), background(#FFFFFF), surface(#FFFFFF), surfaceAlt(#F5F7F8), borderDefault(#E2E5E7), borderStrong(#C7CBCE), divider(#E9ECEE), focusRing(#40E0D0), textPrimary(#333333), textSecondary(#666666), textDisabled(#A0A6AA), textInverted(#FFFFFF), success(#4CAF50), successBg(#E6F7E7), warning(#FFB300), warningBg(#FFF4D6), error(#F44336), errorBg(#FDECEA), overlayScrim(rgba(0,0,0,0.40)), skeletonBase(#E0E0E0), skeletonHighlight(#F5F5F5).

State Colors:
- Button Primary BG: default #40E0D0 / pressed #27B5A8 / disabled #A0EDE4
- Button Secondary Border: default #40E0D0 / pressed #27B5A8 / disabled #A0EDE4
- Input Border: default #C7CBCE / focus #40E0D0 / error #F44336
- Input BG: default #FFFFFF / disabled #F0F2F3
- Slider: track #E2E5E7 / active #40E0D0 / thumb #40E0D0

Typography Tokens:
H1 24/32 700, H2 22/30 700, H3 20/28 600, H4 18/24 600, Body 16/24 400, BodyBold 16/24 600, Small 14/20 400, SmallBold 14/20 600, Caption 12/16 400, Button 16/20 600.

Accessibility: Same rules as prior; white-on-brand restricted to large/semibold text.
