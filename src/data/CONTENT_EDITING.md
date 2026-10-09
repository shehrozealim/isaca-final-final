# Edit the website

All displayed copy lives in **site-content.json**. Changes are picked up by Vite while developing, or by the next production build.

- `event`: details, registration URL, problem statements, rules, prizes and FAQs. A problem statement has `title`, `description`, `objective` and `deliverables`; a prize has `place` and `amount`; an FAQ has `question` and `answer`. Current challenges and prizes are clearly labelled samples.
- `journal`: the diary's about text, timeline, domains, prize pool and printed details.
- `chapters`: the six navigation labels. Keep IDs unchanged so links continue to work.
- `copy`: headings, buttons, loading messages, accessible descriptions, decorative ink and fallback text. Keys identify the original wording; change the **values**, leaving keys unchanged.
- `map`: editable labels in the landscape and portrait map templates. Keep keys unchanged. The SVG labels are filled from this file at runtime.

Problem statements paginate one per sheet. FAQs paginate three per sheet, after a separate FAQ title page. Additional sheets automatically extend the scroll timeline. Keep answers concise enough to read on mobile. Essential information is HTML, including the static reduced-motion version.

The `{number}` token is substituted automatically in exhibit labels. Leave tokens intact when changing their surrounding text. Texture images contain no essential event copy. The original supplied images are preserved outside the project; generated web textures and their prompts are in `public/s03/textures`.
