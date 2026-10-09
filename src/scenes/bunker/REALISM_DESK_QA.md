# Photographic desk refinement — 2026-10-09

## Resolved art direction

Use the supplied house, apparition, car, and timber references to replace drawn evidence with photographic prints. Keep the warm tungsten desk lighting, dark timber background, aged paper, and foreground investigation props. One active document is the focal point. Illustrated spreads contain three or four varied prints; text pages reserve a clear reading area and use smaller photographic details. Keep reading holds still and motivate motion through page hinges and returning documents. Preserve semantic HTML and the reduced-effects path.

## Implementation

- Generated an original six-photo evidence atlas and weathered wood surface with the built-in imagegen tool. Exact prompts, reference inputs, dimensions, and asset paths are recorded in `public/s03/textures/REALISM_ASSET_PROMPTS.md`.
- Distinct page recipes replace the repeated drawn sigils and field sketches. Prints use subtle rotation, tape, cream borders, and contact shadows.
- Problem and FAQ documents use a closer fixed reading scale. Sample briefs are shortened in the central content JSON to fit the physical leaves.
- Prize readouts have no internal scrolling. The exit reverses the loose sheets and seal geometry as the packet parks on the desk.

## Browser review

Reviewed the production preview at 1920×1080, 1440×900, and 390×844. Inspected the main diary, problem cover and case turns, prize reveal, prize-to-FAQ transition, FAQ cover and answer spread. The desktop spread remains fully framed; mobile uses the single readable leaf. Briefs and FAQ answers fit their paper, evidence does not obscure the text, and chapter navigation remains visible.

Confirmed the prize readout has matching client/scroll heights (371px laptop, 281px mobile) and `overflow-y: visible`. Verified the wax halves return to one seal on the parked packet during the FAQ approach. Reviewed the mobile `?effects=reduce` FAQ: all answers remain available in normal document flow.

Screenshots are saved under `output/journal-qa/realism-*`, including wide/laptop/mobile case pages, laptop/mobile FAQ, laptop prizes, and reduced-effects FAQ.

## Technical validation and limits

`npm run build` and `npm run lint` pass. Browser console contains no application errors. Existing Three.js Clock and PCFSoftShadowMap deprecation warnings remain, as does Vite's large WebGL chunk advisory. This review checks rendered composition and navigation, not measured frame-rate performance on physical phones. Atlas cells are 512×512 and the wood image is 1254×1254, retained at native resolution in high-quality WebP rather than artificially enlarged.
