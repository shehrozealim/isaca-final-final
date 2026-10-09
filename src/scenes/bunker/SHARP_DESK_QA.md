# Sharp desk refinement — 9 October 2026

Creative direction: a sharp, densely dressed tungsten research desk, with clean text columns and eerie engraved margins. Keep the full open folder stationary while reading; motivate motion through page hinges and artifact placement.

Changes:
- Removed optical depth-of-field blur. Diary and paper canvases now render at 1536 × 2048, with texture anisotropy 8. Desktop DPR is capped at 2, mobile at 1.5. Removed enlarged low-resolution reference photo thumbnails.
- Added bottles, wax candles, keys, a letter opener, coins, twine, notebooks and marked research slips. Reduced table dimensions and brought parked artifacts closer.
- Parked the complete map inside the camera frame. The bottom chapter rail remains visible during map focus and document choreography.
- Cases now occupy three individual leaves, with sample objectives and deliverables. The camera stays fixed during their reading holds. Separate front/back materials, consistent stacking and full-spread centering prevent mirrored text, clipping and surface fighting.
- Added engraved study backs and an illustrated inside cover. Small wards live in outer gutters; essential text remains HTML. Folder pages close together when parked, and the finished mobile folder moves above the FAQ sheet.
- Moved the broken wax halves outside the reading area; reduced reward leaves to two and separated them from the final sheet. Sample prizes are ₹50,000 / ₹30,000 / ₹20,000, total ₹1,00,000, labelled as preview values.
- Mobile physical sheets are larger so complete briefs and footnotes fit. Desktop ink width follows viewport height to match the physical paper. Reduced-effects content uses normal flow, no canvas, and clipped decorative overflow.

Validation:
- Production build and ESLint pass. Vite retains its existing lazy WebGL chunk-size warning.
- Reviewed laptop 1440×900, wide desktop 1920×1080 and mobile 390×844: journal pages, folder cover, page turns, sample briefs, parked map, bounty and FAQ transition.
- Reduced-effects mobile exposes all three sample cases and prizes as semantic HTML, with zero WebGL canvases and no horizontal overflow.
- Browser logs contain no application errors; Three.js Clock and shadow-map deprecation warnings remain.
- Screenshots are in `output/journal-qa/sharp-*.png`.

Scope of verification: browser visual checks and compilation, not a measured frame-rate benchmark or testing on physical mobile hardware. Sample event content is editable in `src/data/site-content.json`.
