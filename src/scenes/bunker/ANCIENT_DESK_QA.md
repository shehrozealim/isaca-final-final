# Ancient desk sequence - 9 October 2026

## Direction
An investigation becomes tangible, one artifact at a time. The foreground journal
and curling papers occlude a warm wood desk, with the bunker receding into shadow.
Tungsten side lighting supplies paper relief with restrained cool fill. The
38-degree desktop / 48-degree mobile camera cranes from reading to vertical
inspection. Each reading hold stays centered; hinged covers, a broken seal and
turning pages motivate short camera arcs that resolve before the text appears.
Oxblood wax and ink provide accents; no particles or autoplay audio were added.

## Implementation
The closed book retains its table orientation throughout its rise, then eases
separately into reading. Springs have more damping and the lift lasts longer.
The waiting caption, drawer/vault animation and drawer sound cues are removed.
Chapter navigation now eases over 2.2-8 seconds, with an immediate reduced-motion
path. The native fallback cancels its seek when the user scrolls or touches.

Built-in image generation edited four supplied references into clean diary paper,
map parchment, stitched folder stock and an original transparent wax seal. Bottom
writing and watermarks are removed. Prompts/source paths: public/s03/textures/
ANCIENT_ASSET_PROMPTS.md. Final WebP textures are capped at 2048 pixels. All journal
leaves, folder papers, prize sheets and FAQ use ancient-paper.webp. Essential
facts and interactive answers remain semantic HTML; official unknowns remain TBA.

Desktop: 344 units / 1980svh. Mobile: 311 units / 1790svh followed by normal-flow
accessible dossiers. Journal holds: 24-38,42-56,60-74,78-88; map 122-136; cases
174-196; reward 240-260; FAQ 278-302. The map fits its complete sheet on both
orientations, clears the journal, returns to the desk and slides aside before
the folder opens. A hinged stitched cover exposes a subtly crumpled raised page.
The wax seal parts, four curled sheets peel outward and settle on the table.
A final leaf turns away to expose the FAQ, which uses native details/summary.

## Browser review
1920x1080: entry, lift, journal, complete map, folder, wax, reward, FAQ interaction.
1440x900: FAQ and finale. 390x844: journal, lift, map, folder, reward and FAQ
interaction. Reduced effects: static desktop/mobile FAQ, zero canvases, no long
runway, no horizontal overflow. Inspected chapter navigation, reverse scrolling,
shutter handoff and outgoing content. No physical-device FPS benchmark performed.

The portrait SVG had an encoding error caught in the browser; converted it to
UTF-8, validated both map SVGs as XML and rechecked the complete portrait map.
Fresh browser console checks found no application errors. Existing Three.Clock
and PCFSoftShadowMap dependency warnings, plus the lazy Three chunk-size warning,
remain. Build and lint pass. Proof screenshots: output/journal-qa/ancient-*.png.
