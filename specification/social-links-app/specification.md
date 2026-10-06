# Specification: social-links-app

> **Guidelines**: Read [../guidelines.md](../guidelines.md) before executing ANY tasks below.

Check off items as completed.

## Project Setup

- [x] Run `mkdir -p assets/social-links-app`
- [x] Invoke the `setup-solution` skill to create `solution.yaml` and `assets/social-links-app/asset.yaml`
- [x] Scaffold a new React + SAP UI5 Web Components app inside `assets/social-links-app/`
- [x] Verify the app runs locally with `npm run dev` from `assets/social-links-app/`

## Profile Section

- [x] Create a centred layout container that works on mobile (320px+) and desktop
- [x] Add a circular profile photo placeholder (96×96 px, centred horizontally)
- [x] Add a name / headline text (placeholder name + bio/tagline, visible above fold on 375px mobile)

## Social Buttons

- [x] Add a LinkedIn button (colour #0077B5, opens https://www.linkedin.com in new tab)
- [x] Add a Twitter button (colour #1DA1F2, opens https://www.twitter.com in new tab)
- [x] Add an SAP Community button (colour #0070F2, opens https://community.sap.com in new tab)
- [x] All three buttons stacked vertically, full-width on mobile, centred on desktop
- [x] Each button clearly labelled and visually distinct
- [x] All social URLs stored in `src/config.ts`

## Visual Design

- [x] White background (#FFFFFF)
- [x] Subtle, minimal styling — no heavy gradients or decorative elements
- [x] Consistent spacing between avatar, bio, and buttons
- [x] Clean system font stack
- [x] Page title set to "Find me online"

## Responsiveness

- [x] Single-column layout on mobile (≤768px)
- [x] Content centred on tablet/desktop (≥769px) with max-width 480px
- [x] No horizontal scrollbar at 320px viewport width
- [x] Tap-friendly buttons (min-height 52px)

## Acceptance Criteria Verification

- [x] Avatar, name, bio, and all 3 buttons visible above fold on 375px viewport (M3)
- [x] Each button opens correct URL in new tab (M2)
- [x] Build completes with no errors (`npm run build`)
- [x] All social URLs defined in `src/config.ts`

## Vercel Deployment

- [x] `package.json` contains a valid `build` script
- [x] `vercel.json` added with framework, buildCommand, and outputDirectory
- [x] App builds successfully with `npm run build` producing `dist/` folder
- [ ] Deploy to Vercel via the `deploy-solution` skill
- [ ] Confirm public Vercel URL returns landing page with status 200 (M1)
