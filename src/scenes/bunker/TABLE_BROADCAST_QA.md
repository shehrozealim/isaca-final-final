# Table and registration review — 2026-10-09

## Composition
The investigation advances from an open journal to a full wooden tabletop. A static original silver sword anchors the upper edge. The skull and burning candle are photographic overhead cutouts with warm light and close contact shadows. Documents occupy separate parked positions and slide above the table into the reading spread. Supporting clutter and repeated photos were reduced. Pencil sketches use multiply compositing directly on the notebook paper; photographs retain instant-print borders.

The tabletop TV remains at the center. After the FAQ pages, it crossfades into a larger semantic HTML broadcast with RGB phosphor texture, scanlines and slow interference. Additional scroll fades the desk and reveals the retained room. The brass registration shortcut remains available after the intro. Buttons use event.registrationUrl when supplied, otherwise /register displays the existing announced and pending event details. No form, backend, or invented registration destination was introduced.

## Verified
- npm run build passed after the final implementation; no TypeScript errors.
- npm run lint passed after the final implementation.
- Browser screenshots inspected at 1440x900, 1920x1080 and 390x844.
- Inspected FAQ entry, tabletop broadcast, mobile broadcast and desktop room return. Corrected lamp/candle overlap, stretched skull/sword proportions, TV centering and mobile schedule duration.
- Clicked the mobile CRT registration link and verified /register and event details.
- Inspected the mobile effects=reduce finale and static TV. Confirmed computed interference animationName is none and registration stays accessible.
- Clean browser sessions reported no console errors. Three.js dependency deprecation warnings for Clock and PCFSoftShadowMap remain. Development HMR export errors during the constant extraction disappeared on clean reload.
- Build retains the existing large shared WebGL chunk warning.
- Browser screenshots were captured inline in the review session; no standalone screenshot files were exported.

## Remaining content dependency
The official registration URL is blank in src/data/site-content.json. The local registration page clearly shows REGISTRATION OPENS SOON until that destination is supplied. New prop assets are camera-matched photographic planes, intended for the fixed overhead desk composition, rather than freely orbitable 3D models.
