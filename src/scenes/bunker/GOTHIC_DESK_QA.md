# Gothic diary and printed archive — 9 October 2026

Implemented the latest request within the existing shutter and shared Three Fiber canvas:

- Removed the shutter's concluding room/frame zoom. The rendered room transform remains `none` after opening.
- Added decoded-asset progress and retry, then waited for actual book/page images, Three TextureLoader completion and shader compilation before playing the shutter.
- Generated a warm, cracked-leather cover from the supplied diary photograph, retaining the eye, raised vines and lace while replacing the central emblem with the existing circular pentacle badge. Generated a transparent 2K sheet of six original gothic engravings from the supplied symbol references. Both web assets are under 750 KB.
- Book, map, folder, reward packet, loose papers and FAQ sheets have persistent table resting poses. Completed reward leaves and broken seal pieces settle on the table. Reading focus moves between artifacts.
- Problem and FAQ pages hinge about their spines, curl in depth and stack on the opposite side. Ink fades during turns and appears when pages settle. Cases paginate two per sheet and FAQs three per sheet; their reading time grows with page count.
- FAQ starts with a separate title page, then printed questions and answers. Removed the frequency scene, associated navigation entry, radio models and radio loop.
- Centralized displayed copy in `src/data/site-content.json`, including map SVG labels and canvas diary printing. Editing guidance is in `src/data/CONTENT_EDITING.md`.
- Desktop focus follows the active artifact with restrained depth of field. Mobile avoids post-processing; reduced motion exposes normal-flow printed content with no WebGL canvas.

## Actually verified

- `npm run build`: passed. Existing lazy WebGL chunk-size warning remains.
- `npm run lint`: passed.
- `git diff --check`: passed.
- Content-key audit: no missing keys for literal `copy()` references.
- Browser inspection at 1920×1080: journal reading, new cover during emergence, problem cover, curled page turn and settled case page. Navigation reverses smoothly through the same timeline.
- Browser inspection at 1440×900: FAQ title page and printed answer spread, persistent surrounding documents, final camera focus. Cold fragment entry shows preparation, opens the shutter and reaches the requested chapter.
- Browser inspection at 390×844: FAQ title and answer pages fit; no horizontal overflow and zero FAQ accordion controls. Static document copies remain visible after the cinematic sequence.
- Reduced-effects mobile: no canvas; FAQ cover and answers both visible in normal flow, zero radio components, no console errors.
- Fresh desktop and mobile sessions: no console errors. Three's existing Clock/PCFSoftShadowMap deprecation warnings remain. Transient Vite hot-reload errors during adding the existing post-processing dependency were cleared by clean reloads; final sessions are error-free.

Screenshots: `output/journal-qa/gothic-faq-desktop.png`, `gothic-faq-mobile.png`, `gothic-faq-reduced.png`, `gothic-case-turn.png`, `gothic-cover-desktop.png`.

No confirmed problem statements, dates or prize amounts were supplied; those remain marked as awaiting announcement.
