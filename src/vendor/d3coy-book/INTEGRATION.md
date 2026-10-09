# THE HUNT journal integration

Source: the user-provided `d3coy-book-bundle.zip`. `OccultBook.mjs` and its
default data retain the original procedural geometry, texture painter, springs,
and bending leaves. The full-scene mount API is not used: rendering belongs to
the site's shared React Three Fiber canvas.

Local adaptations: THE HUNT event copy, table-aligned starting pose, responsive
reading framing, 1152 × 1536 textures, corrected inside-cover UV orientation,
brass binder rings, fabric bookmark, and an original horned specimen drawing.
The supplied leather-cover JPEG is mapped onto the cover, and the supplied
aged-paper illustration JPEG supplies small specimen inserts only. Crisp
canvas-drawn ephemera fill the inside cover and reverse leaves, avoiding
enlarged low-resolution reference artwork. Collage photographs with actor
likenesses are not shipped. The evidence map is a new 2048×1280 SVG schematic
marking DJSCE in Vile Parle West; a separate 3D cotton thread traces the route
and ends in a brass destination pin. It is explicitly labeled not to scale.

`public/s03/textures/bunker-table-cleared.webp` is a built-in imagegen edit of
the supplied bunker image, encoded without resizing. Its saved prompt is beside
the asset. Only a feathered region around the old journal is composited into
the room during lift; the shutter still reveals the original supplied image.

Scene brief: one journal is the hero. The shutter frame establishes foreground
depth, the table is the starting subject plane, and the existing bunker remains
the background. A warm desk-lamp key and restrained cool fill light the book.
The 38-degree desktop camera lets the journal occupy the reading viewport,
then rises into a vertical view of a textured 3D desk. The original photo
stays still during the initial book flight, then falls into shadow.
GSAP owns the macro scroll timeline; the bundle's springs settle the lid/leaves.
Mobile uses 48-degree framing focused on the active recto, no dynamic shadows,
and a dedicated scroll runway. Reduced effects (`?effects=reduce` or the system preference)
use semantic content and a still leather/evidence composition without WebGL.

Reading spreads now hold for 15, 14, 14 and 17 timeline units, with short
three-unit turns between them. The desktop timeline is 188 units over 1134svh.
The book settles to the left of the 3D desk as the camera reaches overhead.
The map rises from the desk, the thread traces to the college, and semantic
location/directions content remains HTML. The scene leaves for the clock.
At the bounty chapter, the camera returns to the desk and pushes toward a
sealed packet. Two wax-seal halves part; four curled sheets lift and fan into
opposing quadrants, exposing the central reward dossier. The camera makes a
restrained arc before settling vertically. Prize wording is semantic HTML and
uses the actual organizer data; no amount has been invented.
Mobile uses one continuous timeline across 600svh journal, 260svh map and
320svh bounty ranges; reduced motion skips the cinematic runway entirely.
The canvas is portaled into the bunker viewport, keeping shades behind 3D and
semantic overlays above it. It remains the existing single shared canvas.
