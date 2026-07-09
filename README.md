PROJECT

Build a fresh, modern homepage for Shapla Foundation, a nonprofit that helps sponsor underprivileged children's education in Bangladesh. This is a full rebuild of the existing homepage — not an edit. Use HTML5 + Bootstrap 5 (via CDN) + a modular custom CSS file on top of Bootstrap. Do not use any JS framework (no React/Vue) — vanilla JS only, and only where needed (carousel, mobile nav, counter animation).

TECH STACK & FILE STRUCTURE


index.html
css/variables.css — all design tokens (see Design System below)
css/style.css — component/section styles, references variables only, never hardcoded values
js/main.js — small vanilla JS (stat counter animation on scroll, testimonial carousel init, mobile nav toggle)
Bootstrap 5 via CDN (CSS + bundle JS)
Use Bootstrap's grid (container, row, col-*) and utility classes for layout/spacing wherever possible; use custom CSS only for things Bootstrap can't do (custom card styles, section backgrounds, typography, buttons, icons)
Icons: use Bootstrap Icons (CDN) or lucide-style inline SVGs — no icon images
Fully responsive: mobile-first, test at 375px, 768px, 1024px, 1440px
Semantic HTML (<header>, <nav>, <section>, <footer>, proper heading hierarchy h1→h2→h3)
Accessible: alt text on all images, sufficient color contrast, focus states on buttons/links, aria-labels on icon-only buttons


DESIGN SYSTEM (css/variables.css)

Color Palette — Rationale (read this before coding)

This is a children's education/sponsorship nonprofit, so the palette needs to feel hopeful and warm (it's about children's futures) while still reading as modern, credible, and professional (donors are trusting you with recurring money). Avoid the generic "charity green + pastel pink" look of the old site — instead use:


Deep Teal/Emerald as the primary brand color — more distinctive than a plain green, reads as trustworthy, growth-oriented, and calmer/more modern than a bright NGO green.
Warm Amber/Coral as the single accent color — used sparingly for highlights, badges, and secondary CTAs. This is what carries the "warmth, hope, children" feeling without resorting to pastel pink or rainbow colors.
One neutral off-white/cream background tint instead of alternating multiple pastel section colors — this is what makes the page feel modern and calm rather than busy.
Charcoal (not pure black) for text — softer, more contemporary than #000.


Build this as CSS custom properties on :root so every color, font, spacing, and radius can be changed from one file:

css:root {
  /* ---- Brand Colors ---- */
  --color-primary: #0E6B5C;        /* deep teal/emerald — CTAs, links, headings accent, main brand color */
  --color-primary-dark: #094F44;   /* hover states, dark sections */
  --color-primary-light: #E5F2EF;  /* pale teal tint for section backgrounds */
  --color-accent: #F4934A;         /* warm amber/coral — secondary CTAs, badges, highlights ONLY, used sparingly */
  --color-accent-dark: #D9752B;    /* accent hover state */
  --color-accent-light: #FDECDD;   /* pale accent tint, e.g. badge backgrounds */
  --color-dark: #1B2622;           /* charcoal — body text, not pure black */
  --color-gray-700: #4E5B57;       /* secondary text */
  --color-gray-400: #9AA8A4;       /* muted text, placeholders, borders */
  --color-light: #ffffff;
  --color-bg-alt: #F7FAF9;         /* single neutral alternating section background (cream/off-white, not pastel) */

  /* ---- Typography ---- */
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
  --fs-h1: clamp(2rem, 4vw, 3rem);
  --fs-h2: clamp(1.5rem, 3vw, 2.25rem);
  --fs-h3: 1.25rem;
  --fs-body: 1rem;
  --fs-small: 0.875rem;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-bold: 700;
  --lh-heading: 1.2;
  --lh-body: 1.6;

  /* ---- Spacing ---- */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;
  --space-2xl: 6rem;   /* section vertical padding */

  /* ---- Radius & Shadow ---- */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 24px;
  --shadow-card: 0 4px 20px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 8px 30px rgba(0,0,0,0.10);

  /* ---- Buttons ---- */
  --btn-radius: 999px; /* pill style, matches existing brand */
  --btn-padding-y: 0.75rem;
  --btn-padding-x: 1.75rem;

  /* ---- Section Backgrounds (map each section to a variable, not a hardcoded color) ---- */
  --bg-section-hero: var(--color-primary-light);
  --bg-section-stats: var(--color-primary);
  --bg-section-values: var(--color-light);
  --bg-section-programs: var(--color-bg-alt);
  --bg-section-stories: var(--color-light);
  --bg-section-testimonials: var(--color-primary-light);
  --bg-section-cta: var(--color-primary);
  --bg-section-partners: var(--color-light);
}

Every section, card, and button in the CSS must consume these variables — no hardcoded hex codes, px font sizes, or one-off colors anywhere in style.css. If a new value is needed, add it to variables.css first.

GLOBAL COMPONENTS TO BUILD


Sticky header: logo left, nav center/right (Home, Sponsor a Child, Sponsor a Project, Blog, About Us), phone number with icon, and a pill-shaped "Donate" button in --color-primary, always visible on scroll. Collapses into a Bootstrap offcanvas/hamburger menu on mobile.
Button styles: .btn-primary-pill (solid --color-primary teal, white text, pill radius), .btn-outline-pill (outline teal, transparent bg), and .btn-accent-pill (solid --color-accent amber, white text, pill radius — reserve for one standout CTA per page, e.g. the main hero button or giving CTA band, so the amber stays special) — used consistently everywhere, no other button variants.
Section wrapper: .section class with padding: var(--space-2xl) 0 and a .section-title component (centered, --fs-h2, small accent underline/icon above it) reused across all sections.
Card component: .card-custom with --radius-md, --shadow-card, hover state lifting to --shadow-card-hover, used for program cards, value-prop cards, and testimonial cards so they all share one base style.


SECTIONS TO BUILD (in this exact order)

1. Header

As described above.

2. Hero — Mission Statement


Background: --bg-section-hero
Left: H1 "Give a Child in Bangladesh a Future" (placeholder, refine wording as needed), one sub-paragraph: "Shapla Foundation connects generous sponsors with underprivileged children across Bangladesh — funding their education, health, and hope for a better future, for as little as $30/month."
Two buttons: "Sponsor a Child" (primary pill) and "Donate Once" (outline pill)
Right: a photo or simple photo-grid of children/students (use a placeholder <img> with a descriptive alt text and a comment <!-- replace with real photo -->)
Small nonprofit trust badge under the buttons: "501(c)(3) Nonprofit · Tax ID 45-2586741"


3. Impact Stats Band


Background: --bg-section-stats (solid deep teal --color-primary), white text
4 stat blocks in a Bootstrap row of col-6 col-md-3: big number + label, e.g. "600+ Children Sponsored", "10+ Years Active", "95% Donation Reaches the Child", "4 Students Passed SSC This Year"
Numbers should animate/count up on scroll into view (vanilla JS in main.js)


4. Why Sponsor With Us (Trust / Value Props)


Background: --bg-section-values
Section title: "Why Donors Trust Shapla Foundation"
6 cards in a row-cols-1 row-cols-md-3 grid, each with an icon, short title, one-line description: Transparency, Direct Impact, Passionate Team, Efficiency, Family & Community, Regular Updates
Use .card-custom


5. Our Programs


Background: --bg-section-programs
Section title: "Current Programs We're Working With"
3-4 cards in equal-weight grid: Sponsor a Child's Education, Shapla Foundation Library, Health & Wellbeing Programs, Community Project Sponsorship — each: icon, title, 1-2 sentence description, one "Learn More" link
Use .card-custom, identical height/structure for every card (use Bootstrap h-100 and flex column so descriptions of different lengths don't break card alignment)


6. Impact Stories Carousel


Background: --bg-section-stories
Section title: "Recent Impact Stories"
Bootstrap carousel with 3 slides, each: photo, short headline, 2-line teaser, "Read More" link to blog. Content: (1) SSC exam success story, (2) a program milestone, (3) a donor thank-you story — written as short teasers, not full paragraphs


7. Testimonials


Background: --bg-section-testimonials
Section title: "What Our Sponsors Say"
3 testimonial cards in a row: circular photo, name, role (e.g. "Monthly Sponsor since 2022"), 2-3 line quote, star rating (Bootstrap Icons stars)
"View All Reviews" outline button centered below the row


8. Giving CTA Band


Background: --bg-section-cta (solid deep teal --color-primary), white text, centered
Headline: "Your Support Can Change a Life" (no exclamation marks)
3 giving options as buttons or small cards side by side: "$30/month — Sponsor a Child", "One-Time Donation", "Sponsor a Project"


9. Partners & Corporate Sponsors


Background: --bg-section-partners
Section title: "Our Partners & Corporate Sponsors"
Logo row, grayscale by default with color on hover (filter: grayscale(100%) → filter: none on :hover), responsive wrap using Bootstrap flex utilities


10. Footer


4-column Bootstrap footer: About Shapla Foundation (short blurb + social icons), Quick Links (Blogs, Our Team, FAQ), Contact — Bangladesh Office, Contact — USA Office
Bottom bar: copyright, Terms of Use, Privacy Policy, "Non-profit 501(c)(3) Organization | Tax ID: 45-2586741"


CONTENT RULES


No exclamation-mark-heavy copy anywhere ("Only $30!!!" style is banned) — keep tone warm, direct, and professional.
Every card in a grid must have the same content structure and length so the grid stays visually balanced (icon → title → 1-2 sentences → link).
Use placeholder text only where I haven't given exact copy above, and mark it clearly with an HTML comment like <!-- TODO: replace placeholder copy --> so I can spot what still needs real content.
All images should be <img> placeholders (e.g. via https://placehold.co/) with descriptive alt text, never left blank.


WHAT NOT TO DO


Don't bring back the old alternating pink/green/mint section backgrounds — background colors must come from the mapped --bg-section-* variables only.
Don't use more than two font families total.
Don't create more than the 10 sections listed above on this homepage — anything else (like the Menstrual Health program feature or a single-donor spotlight) belongs on other pages, not this one.
Don't hardcode any color, font-size, spacing, or radius value directly in style.css — always reference a variable from variables.css.


Build the full index.html, css/variables.css, css/style.css, and js/main.js now.