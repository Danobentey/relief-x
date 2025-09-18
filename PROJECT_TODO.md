# Project TODO (Relief X)
Priority scale: P0 (blocker), P1 (high), P2 (normal), P3 (later). Execute mostly top-to-bottom, respecting dependencies.

## Phase 0: Alignment / Foundations
1. P0 SPEC-LOCK: Freeze spec versions (build-spec 1.1, agent guide 1.1) — record hash/commit once repo initialized.  
2. P0 TOKENS-EXTRACT: Extract final color + typography tokens from Figma (all states: primary, primaryHover, primaryPressed, outline, focusRing, divider).  STATUS: Done (final tokens locked 2025-09-18)
3. P0 TYPO-SCALE: Define exact heading sizes (H1..H5), line heights, weight mapping; update style_guide.md.  STATUS: Done (style guide 1.0)
4. P0 PALETTE-SEMANTIC: Map raw colors → semantic (brandPrimary, surface, surfaceAlt, borderMuted, overlay, dangerBg, successBg).  STATUS: Done (style guide 1.0)
5. P0 ACCESSIBILITY-VERIFY: Contrast check all text on surfaces (≥4.5:1) using final palette.  STATUS: Done (contrast table added 2025-09-18)

## Phase 1: Design System Implementation
6. P1 THEME-FILES: Create src/theme/{colors.ts,spacing.ts,typography.ts,radii.ts, index.ts}.  
7. P1 THEME-PROVIDER: Implement ThemeProvider & hook useTheme().  
8. P1 COMPONENT-BUTTON: Build <Button /> variants (primary, secondary, text) w/ loading + disabled states + accessibility labels.  
9. P1 COMPONENT-CARD: Implement Card container (shadow/elevation tokens).  
10. P1 COMPONENT-FORMFIELD: TextInput with floating label, error, focus ring.  
11. P1 COMPONENT-SKELETON: Generic Skeleton loader (width/height/variant).  
12. P1 STORYBOOK-SETUP (optional if time) or simple showcase screen.

## Phase 2: Data & Security
13. P0 FIRESTORE-RULES-DRAFT: Write full Firestore security rules file matching schema (users, painLogs, videos, videoCompletions).  STATUS: In-Review (logic fixed & enhanced tests 2025-09-18)
14. P0 FIRESTORE-RULES-TESTS: Emulator tests for allowed/denied operations (owner vs other user, score range).  STATUS: In-Review (additional negative & entitlement tests 2025-09-18)
15. P1 CLOUD-FNS-SPEC: List any Cloud Functions (e.g., onTrialExpired, onRevenueCatWebhook, cleanupUser). Define triggers & I/O contracts.  
16. P1 CLOUD-FNS-STUBS: Create placeholder functions with logging + TODO.  
17. P1 SUBS-ENTITLEMENT-SYNC: Implement subscription sync service (RevenueCat → user doc update).  

## Phase 3: Analytics & Monitoring
18. P0 ANALYTICS-EVENT-ENUM: analytics/events.ts enumerating events & required params.  STATUS: Done (events.ts added 2025-09-18)
19. P0 ANALYTICS-VALIDATOR: Runtime assert missing/extra params; unit tests.  STATUS: Done (track validation & tests added 2025-09-18)
20. P1 ANALYTICS-HOOK: useAnalytics() hook wrappers.  
21. P1 ERROR-PIPELINE: Central error boundary + Sentry integration + pr_error emit.  
22. P2 PERFORMANCE-METRICS: Add basic app start timing log (dev only).  

## Phase 4: Auth & Onboarding
23. P0 AUTH-SCREEN: Email + third-party buttons (Apple/Google placeholders).  STATUS: In-Progress (UI scaffold AuthScreen.tsx added 2025-09-18)
24. P1 AUTH-INTEGRATION: Firebase Auth (modular) + provider flows.  
25. P1 ONBOARDING-FLOW: Screens sequence + progress indicator + state persistence.  
26. P1 ONBOARDING-ANALYTICS: Emit step_view & completed events.  

## Phase 5: Video Feature
27. P1 VIDEOS-LIST: Fetch videos + loading/error/empty states.  
28. P1 VIDEO-PLAYER: expo-av integration + controls (play/pause, progress, complete).  
29. P1 VIDEO-COMPLETION: Mark complete updates videoCompletions doc + analytics.  
30. P2 PREMIUM-GATE: Conditional lock overlay & paywall trigger.  

## Phase 6: Pain Logging & Progress
31. P1 PAIN-SLIDER: Slider component (1–10) w/ accessibility.  
32. P1 PAIN-SUBMIT: Mutation + analytics event.  
33. P1 PAIN-DEDUP: Prevent multiple entries same date (rule + client guard).  
34. P1 PROGRESS-CHART: 7-day line chart (consider victory-native / lightweight library) + loading states.  

## Phase 7: Subscription & Paywall
35. P0 REVENUECAT-SDK: Integrate public SDK wrapper (service isolation).  STATUS: In-Progress (skeleton revenueCat service added 2025-09-18)
36. P1 TRIAL-STATE-HANDLER: Set trial start/end timestamps (initial login).  
37. P1 PAYWALL-COMPONENT: UI (plans, trial highlight, restore purchases).  
38. P1 ENTITLEMENT-GUARD: Navigation guard & inline checks for premium videos.  
39. P2 GRACE-BANNER: Banner for grace state with manage link.  

## Phase 8: Navigation & App Shell
40. P1 NAV-STRUCTURE: Stack + Tabs + Modals scaffolding.  
41. P1 NAV-GUARDS: Redirect logic (onboarding, entitlement).  
42. P1 SPLASH-SCREEN: Managed splash (expo-splash-screen) hold until theme + auth + entitlement ready.  
42. P2 DEEP-LINKING: Configure scheme & test (optional MVP).  

## Phase 9: CI/CD & Tooling
43. P0 SCRIPT-VERIFY: yarn verify (lint + type + test).  STATUS: Done (verify script added 2025-09-18)
44. P0 SCRIPT-CHECK-ENV: Implement env validation; fail if missing.  STATUS: Done (scripts/check-env.js added 2025-09-18; .env.example added, placeholder detection 2025-09-18)
45. P1 CI-WORKFLOW: GitHub Actions YAML (install cache, verify, test, build).  
46. P1 SENTRY-SOURCE-MAPS: Upload step (prod builds).  
47. P1 COVERAGE-GATE: Fail CI if coverage < 70%.  
48. P2 BUNDLE-ANALYZE: Optional workflow job.  

## Phase 10: QA & Release
49. P1 SMOKE-TEST-DOC: Checklist (auth, video play, log pain, paywall).  
50. P1 RELEASE-CHECKLIST: Template markdown in repo.  
51. P2 ROLLBACK-PROC: Document quick rollback & feature flag usage.  

## Phase 11: Style Guide Enhancements
52. P1 COMPONENT-STATES-MATRIX: Document states for each component (default, hover, pressed, disabled, loading, error).  
53. P2 MOTION-GUIDELINES: Define durations (fast 150ms, standard 250ms) & easing.  
54. P2 ICONOGRAPHY-SPEC: List icon sizes & stroke weights.  
55. P2 DARK-MODE-PALETTE: Draft (post-MVP).  

## Phase 12: Documentation & Governance
56. P1 CONTRIBUTING.md: Branch, commit, PR standards.  
57. P1 CODEOWNERS: Define reviewers (placeholder until team set).  
58. P2 ENGINEERING-METRICS: Decide tracking (lead time, failed deploys).  
59. P2 DATA-RETENTION: Policy draft (how long keep pain logs).  

## Phase 13: Risk & Open Questions Closure
60. P1 CLOSE-OPEN-QUESTIONS: Resolve color tokens (1), offline queue decision (2), pricing differences (3), DRM requirement (4).  
61. P2 DRY-RUN-ENTITLEMENT: Simulate expiration & grace flows.  

## Backlog / Post-MVP (Not Now)
- Offline video caching strategy.
- Gamification architecture.
- Community features data model.
- AI personalization pipeline.

## Tracking Format
For each task when started: add Issue ID, owner, start date, status (Todo/In-Progress/Blocked/Review/Done), and link PR(s).

## Suggested Weekly Cadence
- Monday: Prioritize upcoming slice (select 5–7 tasks).  
- Daily: Standup + update statuses.  
- Friday: Review metrics (build success, coverage), adjust priorities.

## Dependencies Summary
- Tokens (2–5) before theme & components (6–11).
- Security rules (13–14) before broad data write features (27,32).  
- Analytics enum (18) before adding most feature events (24,27,32).  
- Subscription integration (35–38) before premium gating (30).  
- CI scripts (43–45) before enforcing coverage gate (47).  

Version: 2025-09-18 v0.1
