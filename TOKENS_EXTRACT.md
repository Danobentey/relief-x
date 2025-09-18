# TOKENS_EXTRACT (Task 2 – Finalized)
Purpose: Final extraction of color + typography tokens from minimal UI kit. All TBD values resolved. Ready for code generation (Tasks 6 & 7).

## Final Token JSON
```json
{
  "colors": {
    "brandPrimary": "#40E0D0",
    "brandPrimaryPressed": "#27B5A8",
    "brandPrimarySubtle": "#E0FBF8",
    "background": "#FFFFFF",
    "surface": "#FFFFFF",
    "surfaceAlt": "#F5F7F8",
    "borderDefault": "#E2E5E7",
    "borderStrong": "#C7CBCE",
    "divider": "#E9ECEE",
    "focusRing": "#40E0D0",
    "textPrimary": "#333333",
    "textSecondary": "#666666",
    "textDisabled": "#A0A6AA",
    "textInverted": "#FFFFFF",
    "success": "#4CAF50",
    "successBg": "#E6F7E7",
    "warning": "#FFB300",
    "warningBg": "#FFF4D6",
    "error": "#F44336",
    "errorBg": "#FDECEA",
    "overlayScrim": "rgba(0,0,0,0.40)",
    "skeletonBase": "#E0E0E0",
    "skeletonHighlight": "#F5F5F5"
  },
  "stateColors": {
    "buttonPrimaryBg": { "default": "#40E0D0", "pressed": "#27B5A8", "disabled": "#A0EDE4" },
    "buttonSecondaryBorder": { "default": "#40E0D0", "pressed": "#27B5A8", "disabled": "#A0EDE4" },
    "inputBorder": { "default": "#C7CBCE", "focus": "#40E0D0", "error": "#F44336" },
    "inputBg": { "default": "#FFFFFF", "disabled": "#F0F2F3" },
    "slider": { "track": "#E2E5E7", "active": "#40E0D0", "thumb": "#40E0D0" }
  },
  "typography": {
    "H1": { "family": "Roboto", "weight": 700, "size": 24, "lineHeight": 32, "letterSpacing": 0 },
    "H2": { "family": "Roboto", "weight": 700, "size": 22, "lineHeight": 30, "letterSpacing": 0 },
    "H3": { "family": "Roboto", "weight": 600, "size": 20, "lineHeight": 28, "letterSpacing": 0 },
    "H4": { "family": "Roboto", "weight": 600, "size": 18, "lineHeight": 24, "letterSpacing": 0 },
    "Body": { "family": "Roboto", "weight": 400, "size": 16, "lineHeight": 24, "letterSpacing": 0 },
    "BodyBold": { "family": "Roboto", "weight": 600, "size": 16, "lineHeight": 24, "letterSpacing": 0 },
    "Small": { "family": "Roboto", "weight": 400, "size": 14, "lineHeight": 20, "letterSpacing": 0 },
    "SmallBold": { "family": "Roboto", "weight": 600, "size": 14, "lineHeight": 20, "letterSpacing": 0 },
    "Caption": { "family": "Roboto", "weight": 400, "size": 12, "lineHeight": 16, "letterSpacing": 0 },
    "Button": { "family": "Roboto", "weight": 600, "size": 16, "lineHeight": 20, "letterSpacing": 0 }
  },
  "spacing": [0,4,8,12,16,20,24,32],
  "radii": { "sm":4, "md":8, "lg":16, "pill":999 },
  "elevation": {
    "1": { "ios": { "x":0, "y":1, "blur":2, "spread":0, "color":"rgba(0,0,0,0.08)" }, "android":1 },
    "2": { "ios": { "x":0, "y":2, "blur":4, "spread":0, "color":"rgba(0,0,0,0.10)" }, "android":2 },
    "3": { "ios": { "x":0, "y":4, "blur":8, "spread":0, "color":"rgba(0,0,0,0.12)" }, "android":4 }
  },
  "icons": { "default": 24, "large": 48, "stroke": 2 },
  "motion": { "fast": 150, "standard": 250, "easingStandard": "cubic-bezier(0.4,0,0.2,1)" }
}
```

## Contrast & Accessibility Notes
- White text on brandPrimary limited to Button (16px 600) & headings ≥20px weight 600+.
- For body text on brand backgrounds, prefer textPrimary on brandPrimarySubtle.
- Success & error colors used primarily for icons/badges; body text stays textPrimary with colored icon when small.

## Implementation Checklist (To Close Task 2)
- [ ] Generate TypeScript token files (Task 6) using this JSON.
- [ ] Refactor style_guide.md colors & typography to reference token names exactly.
- [ ] Update SPEC_LOCK (Style Guide → 1.0) after style_guide bump.
- [ ] Mark Tasks 2,3,4,5 Done in PROJECT_TODO.

## Change Log (Token Extraction)
2025-09-18: Final token set established from minimal UI kit.
