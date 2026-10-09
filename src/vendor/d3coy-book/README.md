# D3COY book bundle

Includes the latest detective-diary book, handwriting, different evidence props
on each spread, red-string timeline, scroll motion, and editable hackathon data.
All artwork is generated in code. No texture downloads or model files are needed.

## Install into an existing npm project

Install the included tarball from your own project folder:

```sh
npm install ./path/to/d3coy-detective-book-1.0.0.tgz three@0.180.0
```

Or extract this folder and install it locally:

```sh
npm install ./path/to/d3coy-book three@0.180.0
```

You can also copy just `dist/d3coy-book.mjs` into your source directory and import
from its relative path. The built module bundles all local code and default
content into one file; Three.js remains a peer dependency so your project uses
one Three.js installation. The bundle does not download Three.js from a CDN.
The standalone HTML example uses a CDN import map for convenience.

## Mount the full scene

Create a tall section with a sticky, full-height viewport. Use the scoped CSS in
`examples/diary.css`; your host element must have a nonzero width and height.

```js
import { mountD3COYBook, hackathon } from 'd3coy-detective-book';

const instance = await mountD3COYBook(document.querySelector('#book-host'), {
  scrollElement: document.querySelector('#book-section'),
  event: hackathon,
});

// Optional section navigation: 0 About, 1 Timeline, 2 Domains, 3 final details.
instance.goToSection(1);

// On route change / component unmount:
instance.destroy();
```

This creates an isolated renderer, table, lights, reflection environment, book,
animation loop, ResizeObserver, and optional window-scroll listener. It changes
no body styles and creates no page header, navigation, or registration UI.
Call `destroy()` to release them. `maxPixelRatio` defaults to 2.
`scrollElement` maps that section's travel through the viewport to progress 0–1;
it supports ordinary document scrolling. For nested scrollers or GSAP/Lenis,
pass `autoScroll: false` and call `instance.setProgress(yourProgress)`.

## Use your existing Three.js scene

```js
import { createD3COYBook, hackathon } from 'd3coy-detective-book';

await document.fonts.load('32px "Segoe Print"');
await document.fonts.ready;
const book = createD3COYBook({ pageCount: 3, event: hackathon });
scene.add(book.group);
book.setView(camera); // camera must be a PerspectiveCamera

// Your existing animation loop, before renderer.render():
book.setProgress(scrollProgress); // normalized 0–1
book.update(deltaSeconds);

// After resizing your camera:
book.setView(camera);

// On removal:
book.dispose();
```

Supply lights and enable your renderer's shadows. This API creates no renderer,
camera, lights, listeners, or animation loop. It animates the book group's pose;
use a parent group if you need a separate placement transform. Three sheets
produce the intended four reading states; keep `pageCount: 3` for this content.
Reading stops are 0.36, 0.57, 0.77, and 0.98. The camera stays fixed.

## Edit the event

Pass a stable event object with the same fields as exported `hackathon`:

```js
const myEvent = {
  ...hackathon,
  name: 'D3COY',
  organizer: 'Your organization',
  prizePool: 'Your confirmed prize pool',
  venue: 'Your venue',
  date: 'Your date',
};
```

The timeline expects six `{ time, title, detail }` entries. Domains displays up
to four `{ title, detail }` entries. Keep titles and notes concise for the printed
page layout. Textures are painted at creation; recreate the book for new data.
The included schedule is marked draft and the domains proposed. Prize, venue,
date and organizer remain “To be announced” until you supply them.
Registration data is exported for your own page UI; mounting does not add a button.

## Examples and rebuild

- `examples/plain.html`: full-scene example; serve the extracted folder over HTTP.
- `examples/D3COYBook.jsx`: React component with asynchronous mount/unmount cleanup.
- Next.js: mark the example component `"use client"` and mount inside `useEffect`.
- `src/`: editable source and content.
- `dist/d3coy-book.mjs`: ready-to-import, unminified ESM bundle.

Run `npm run build` to regenerate the built file after editing source. No build
dependencies are needed. The ZIP also contains a standalone `preview.html` for
the full original event demo; it needs internet for its Three.js import map.

This is browser-only WebGL code. Font appearance depends on installed Segoe
Print / Bradley Hand / cursive fonts; load a licensed handwriting webfont before
creating the book for consistent typography across platforms. Springs and page
bends approximate physical motion. The bundle is code, not a GLB model.
