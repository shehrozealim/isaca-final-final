# Journal scene review

Implemented from the supplied D3COY ZIP using the existing shared R3F canvas.
GSAP controls the scroll handoff, lift, opening, three page turns and exit;
the bundle's springs settle the cover and curled leaves. The original shutter
image remains in place. A masked companion plate clears its baked-in journal
under the moving 3D book, avoiding a duplicate during flight.

Browser review: 1920 Ã— 1080 desktop, 1440 Ã— 900 laptop and 390 Ã— 844 mobile.
Checked shutter handoff, closed-book flight, open evidence spread, curled-page
turn, reverse scroll and transition to subsequent bunker content. The reduced
effects route (`?effects=reduce#bunker-details`) uses the same preference branch
as the system setting: no canvas, no scroll runway, still evidence composition
and semantic event details. This route was checked; the operating system's
media preference was not changed during the review.

Corrections from review: canvas stacking, book/text overlap, mirrored inside
cover artwork, mobile caption framing, low-contrast static evidence note,
resize alignment and the duplicated book in the background photograph.

`npm run build` and `npm run lint` pass. The preview was restarted after a Vite
hot-reload cache error; fresh loads are used for final review. Three/R3F emits
dependency deprecation warnings for Clock and the soft-shadow-map alias; no
application console errors were observed on the fresh preview. Build retains
the existing warning about the size of the lazy Three.js chunk.

Screenshots are saved in `output/journal-qa/`. This is viewport/browser review,
not a frame-rate benchmark on physical mobile hardware. Decorative journal
printing complements the semantic HTML; confirmed event details remain in
`src/data/event.ts`, and unspecified details stay explicitly unannounced.

## Longer pages and evidence map

Extended desktop spread holds to 14â€“17 timeline units, separated by short
three-unit turns, and expanded only the journal/map portion of the overall
scroll range. Mobile journal runway increased to 600svh with explicit pauses.
Added a folded evidence sheet that rises from the right-hand table papers,
settles beside investigation content, and leaves before the clock camera move.
It uses the supplied aged-paper reference with a separate original route-ink
layer. Journal cover and reverse-page textures use the supplied cover and
aged-page JPEGs. Source references remain unchanged.

Reviewed the updated journal and map at 1920Ã—1080 desktop and 390Ã—844 mobile,
and the journal at 1440Ã—900 laptop. Native chapter navigation, forward/reverse
scroll, map-to-clock transition, texture loading and viewport resize checked.
Reduced-effects mobile has no canvas or animation runways and shows the
supplied papers with semantic content. No application console errors observed.
Corrected reference texture cropping caused by the painter's scaled canvas
context. Build and lint pass; existing lazy Three chunk warning remains.
New screenshots: desktop-map.jpg, mobile-map.jpg, longer-desktop-pages.jpg,
laptop-longer-pages.jpg, mobile-longer-pages.jpg, reduced-map.jpg,
supplied-cover-lift.jpg. No overhead/prize-pool camera sequence was added.

## Full-screen journal, overhead destination and bounty reveal

Replaced full-leaf low-resolution photos with original crisp canvas artwork
and small specimen crops. Desktop reading now fills the viewport; portrait
mobile focuses on the active recto. The journal settles onto a wood-textured
3D desk while a real perspective camera cranes into a vertical view. A new
SVG investigation schematic and 3D thread locate Dwarkadas J. Sanghvi College
of Engineering. Address checked against https://www.djsce.ac.in/index.php;
the schematic is labeled not to scale and its HTML directions link uses the
college's full name. The venue field now names the requested college.

The bounty sequence parts a wax seal and lifts four independently curled
sheets into opposing quadrants. A slow camera arc/push ends over the exposed
reward dossier. Prize text remains semantic HTML; amount remains unannounced.
Added a direct bounty chapter link. Mobile shares one continuous reading,
overhead-map and reward timeline; reduced effects display static HTML/SVG.

Browser review: full-screen journal, destination marker and reward at 1920Ã—1080;
reward framing at 1440Ã—900; recto reading, overhead map and prize readout at
390Ã—844; reduced-effects prize content with zero canvases and no animation
runway. Inspected reverse scrolling through the page peel, and chapter links.
Corrected camera aim direction and explicit camera-world-matrix refresh, then
raised the flying sheets to prevent intersections with the nearby journal.
Fresh-page application console checks were clean. Dependency Clock and soft
shadow-map deprecation warnings remain. Build/lint pass; lazy Three chunk size
warning remains. This is browser QA, not a physical-device frame-rate test.

Proof images: fullscreen-journal.jpg, overhead-djsce-map.jpg,
prize-dossier-revealed.jpg, prize-pages-peeling.jpg, laptop-prize-dossier.jpg,
mobile-crisp-journal.jpg, mobile-overhead-djsce.jpg, mobile-prize-dossier.jpg,
reduced-prize-dossier.jpg in output/journal-qa/.


## Rear vault and full-screen map revision

The original S03 room plate and its rear steel drawers remain the environment. A matching sampled drawer face opens in the registered room plane; the camera pushes toward the drawers and stained, crumpled papers travel forward. The generated standalone vault plate was abandoned after the user clarified the rear drawers. Only the generated crumpled-paper texture ships in this revision. Essential problem-statement text remains HTML; event.problemStatements is organizer-editable and empty until official cases are supplied.

Desktop choreography now spans 226 units / 1360svh. Vault establishing shot: 110–124; paper emergence: 124–140; reading hold: 140–168. Mobile vault has a 650svh sticky runway, with drawer opening, 24-unit paper travel and a 52-unit hold. Reduced motion presents the document in ordinary flow. Stopwatch component, chapter, imagery references and ticking audio were removed from the rendered experience. Schedule information remains in the journal and event briefing.

Map close-up hides the book, table props, chapter navigation, global menu, sound control and progress bar. A portrait crop of the investigation map keeps the college label legible on phones. Supporting props return for the neighboring prize scene.

Checked original rear-vault paper at 1920×1080, 1440×900 and 390×844; drawer-only entry, paper reading hold, map close-up and reduced effects. Build and lint pass. Console contains only existing Three.Clock / PCFSoftShadowMap dependency deprecation warnings. Problem statements are awaiting official content; no invented hackathon cases are presented as official.
