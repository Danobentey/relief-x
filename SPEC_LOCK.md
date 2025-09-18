# SPEC_LOCK

Purpose: Record the locked baseline of product & engineering specifications for the Relief X MVP. Any change requires a version bump + CHANGE LOG entry + reviewer approval.

## Locked Documents (Baseline)
| Document | Current Version | Source File | Notes |
|----------|-----------------|-------------|-------|
| Product Specification | 1.1 | build-spec.md | Extended specs included (data model, analytics, subscriptions, etc.) |
| Agent Operating Guide | 1.1 | agents.md | Execution & workflow guidance |
| Style Guide | 1.0 | style_guide.md | Final tokens locked (2025-09-18) |
| Project TODO | 0.1 | PROJECT_TODO.md | Task tracking framework |

## Git Baseline
Repository not yet initialized. After `git init` + initial commit:
1. Capture initial commit SHA
2. Replace `<PENDING_SHA>` below
3. Create lightweight tag `spec-baseline-v1` pointing to SHA

Baseline Commit SHA: <PENDING_SHA>

## Change Control Process
1. Propose update (issue titled: `Spec Update: <area>`)
2. Describe rationale + impact (data model, analytics, UI, etc.)
3. Apply changes in branch; bump only the affected doc version (semantic minor if additive, patch if clarifying, major if breaking)
4. Update this table if new doc added or version changes
5. Merge via PR with reviewer approval
6. Tag new aggregate baseline if major shifts: `spec-baseline-v<major>`

## Versioning Guidelines
- Major: Breaking data model or feature scope shift
- Minor: New feature section added, tokens added, new events
- Patch: Copy clarifications, typos, non-substantive wording

## Pending Actions
- [x] Task 2: Extract final color & typography tokens; then bump Style Guide to 1.0
- [x] Task 3: Add full typography scale (H1–H5) -> Style Guide minor bump
- [x] Task 4: Semantic palette mapping -> Style Guide minor bump
- [x] Task 5: Accessibility contrast verification
- [ ] After tasks 2–5 complete, re-lock (tag `spec-baseline-v1` once repo initialized with SHA)

## Audit Log
| Date | Doc | Old Ver | New Ver | Reason | PR/Issue |
|------|-----|---------|---------|--------|----------|
| 2025-09-18 | (initial) | - | build-spec 1.1 / agents 1.1 / style_guide 0.1 / PROJECT_TODO 0.1 | Baseline creation | - |
| 2025-09-18 | style_guide | 0.2 | 1.0 | Final tokens locked | - |

