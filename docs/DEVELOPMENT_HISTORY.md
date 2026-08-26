# Spring 2026 Development History

This page preserves how the original Webza x Zuxell Technologies project developed. The current repository includes later cleanup and a public reconstruction of the client site, so the spring 2026 work and the later public-release work are separated below.

<p align="center">
  <img src="diagrams/project-story.svg" alt="Development timeline from late February through the April 9 presentation" width="100%">
</p>

## 1. Original project journal

The retained project journal covers the development sequence from late February through the final preparation days in April 2026. It records the following parts of the project:

- The original team was Kevin Zhu, Vladimir Dukkardt, Michael Tetelbaum, and Algasem Zabarah.
- We moved from general brainstorming toward a small web-agency concept because we wanted the project to be useful outside the assignment.
- We made a list of local businesses, divided outreach, and received repeated rejections or no response before finding a client.
- I connected the team with Zuxell Technologies through my dad.
- We built the first Zuxell version before March Break.
- We wanted the client site to feel clean, precise, trustworthy, and appropriate for optical engineering.
- After March Break, we returned to the client site, reviewed it, clarified sections, and polished design choices.
- Michael and Vladimir were unavailable for stretches after March Break, which made coordination more difficult.
- We developed Webza's own agency site while revising the Zuxell site.
- The two sites were intentionally different: Zuxell was restrained and professional, while Webza could be bolder and more creative.
- The final presentation followed the full project story: forming the agency, finding Zuxell, building the first client site, revising it, building the Webza site, working through challenges, and reflecting on what we learned.
- The presentation used a light and optics theme connected to Zuxell's field.
- Most full-group rehearsal and final story organization happened in the last preparation days before the April 9 presentation.

## 2. Client requirements note

An early-March requirements note for the Zuxell website listed the requested sections as:

```text
Home
About us
Expertise
Services
Contact us
```

The same note pointed us toward `https://www.opticsforhire.com/` as a design reference.

That gave us an external structure to work from instead of letting us invent the entire brief ourselves. Personal contact information and identifying details from the original client communication are not republished.

## 3. Preserved source history

The original development copy remains private because it contains client material and early placeholder copy. The source history includes these useful snapshots:

| Date | Commit | What it records |
| --- | --- | --- |
| **March 9, 2026** | `bde22b5493beb27e1f03b3ad58e7e760992073dd` | First complete client interface, with most structure, styling, and interaction concentrated in one large `index.html` |
| **April 4, 2026** | `7b11eac10f6d15a3bb5e4272626994a80412621b` | Landing-page and interaction revision, including separate `style.css` and `script.js` files |
| **April 4, 2026** | `c6cf279d2bbc925c4d6098f9fce915988c4fc4cd` | Image path repair after the larger revision |

The March 9 commit introduced a large single-file implementation. By April 4, structure, styling, and interaction had been separated into focused files. The April interaction layer included an optics-themed entrance, tab navigation, mobile navigation, contact interaction, scroll reveals, a navbar scroll effect, rotating headline text, animated counters, card tilt, parallax movement, a scroll-progress indicator, and staggered reveal behavior.

The point of preserving this history is not to claim that every added effect improved the product. It shows that the project genuinely changed. The current public reconstruction keeps the useful optics identity while deliberately removing several generic effects that made the site feel less restrained than the design goal suggested.

<p align="center">
  <img src="diagrams/implementation-evolution.svg" alt="Implementation evolution from first client build through spring revision and public reconstruction" width="100%">
</p>

## 4. Original and later media

The README uses both original project material and later public captures:

- `docs/assets/screenshots/webza-home.png` is an original spring 2026 capture of the Webza agency website.
- `docs/assets/screenshots/home-desktop.png` is a preserved capture of an earlier public Zuxell reconstruction, before the latest cleanup.
- `docs/assets/screenshots/services-mobile.png` and `docs/assets/screenshots/contact-mobile.png` are preserved mobile captures from that earlier public reconstruction.
- `docs/diagrams/project-story.svg` was created later from the original project journal, client requirements note, and source-history dates.
- `docs/diagrams/implementation-evolution.svg` was created later from the preserved March 9 and April 4 source snapshots plus the current public implementation.

I do not have a surviving spring screenshot of the original Zuxell site. I use preserved source history rather than labeling a newly rendered reconstruction as an original screenshot.

## 5. Public reconstruction decisions

The current site is not presented as an untouched spring artifact. It is a public reconstruction built from the surviving project direction while respecting privacy and the limits of the surviving materials.

The later cleanup intentionally:

- removes unsupported company statistics, certifications, client logos, testimonials, and other claims that appeared in early placeholder content;
- limits company copy to service areas and background information supported by the project materials;
- removes the blocking entrance screen and several generic motion effects;
- keeps the optics-inspired visual identity while making the client-facing copy less self-referential;
- improves keyboard navigation, mobile focus handling, and reduced-motion behavior;
- changes the inquiry interface so there is no HTML form submission endpoint;
- adds local and browser smoke tests for repeatable checks.

These changes improve the public presentation, but they are not retroactively described as original spring work.

## 6. What the surviving record does not tell me

Some details were never tracked closely enough to give a reliable number or quotation. I do not have:

- an exact count of every business contacted before Zuxell;
- a final client testimonial or exact final-feedback quotation;
- a record of formal final client approval before the April presentation;
- traffic, conversion, revenue, retention, sales, or measured business-growth results;
- a module-by-module breakdown of exactly what each teammate authored during the original project.

Rather than guess at those details later, I leave them out and focus on the parts of the project that are still clearly documented.

## 7. Why this history matters

The strongest part of the project is the process behind it: deciding to find a real client, working from someone else's requirements, learning enough about an unfamiliar technical business to design for it, building two sites for two different audiences, revising the first version, and coordinating a team while the project was moving.

Keeping that history separate from the later public cleanup makes it possible to show both the original project and the quality improvements that came afterward without blurring them together.
