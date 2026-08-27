# Spring 2026 Development History

This page preserves how the original Webza x Zuxell Technologies project developed. The current repository also contains later public-release work, so the spring project and the later reconstruction are kept separate.

<p align="center">
  <img src="diagrams/project-story.svg" alt="Development timeline from late February through the April 9 final pitch" width="100%">
</p>

## 1. Original project journal

The retained project journal covers the development sequence from late February through the final preparation days in April 2026. It records the following parts of the project:

- The original team was Kevin Zhu, Vladimir Dukkardt, Michael Tetelbaum, and Algasem Zabarah.
- We moved from general brainstorming toward a small web-agency concept because we wanted the project to have a purpose outside the original brief.
- Webza was framed around custom websites for businesses rather than generic templates.
- We made a list of local businesses, divided outreach, and received repeated rejections or no response before finding a client.
- I connected the team with Zuxell Technologies through a family connection.
- Zuxell worked in optical engineering and needed a website.
- We built the first complete Zuxell version before March Break.
- We wanted the client site to feel clean, precise, trustworthy, and appropriate for optical engineering.
- The landing page was treated as the key first impression.
- After March Break, we returned to the client site, reviewed feedback, clarified sections, and polished design choices.
- We developed Webza's own agency site while revising the Zuxell site.
- The two sites were intentionally different: Zuxell was restrained and professional, while Webza could be bolder and more promotional.
- Team availability changed after March Break, which made coordination and handoffs more important.
- The final pitch followed the full project story: forming the agency, pursuing a client, finding Zuxell, building the first site, revising it, building Webza's own site, working through challenges, and reflecting on what we learned.
- The presentation used a light and optics theme connected to Zuxell's field.
- Most full-group rehearsal and final story organization happened in the last preparation days before the April 9 pitch.

The retained role notes describe **Michael and Kevin as handling much of the coding**, **Vladimir as leading much of the UI, design, and visual consistency**, and **Algasem as concentrating more heavily on presentation work**. Kevin also handled much of the business, pricing, and client framing. These are broad areas of contribution, not a reliable file-by-file authorship record.

## 2. Client requirements note

An early-March requirements note for the Zuxell website listed the requested sections as:

```text
Home
About Us
Expertise
Services
Contact Us
```

The same note pointed us toward `https://www.opticsforhire.com/` as a design reference.

That gave us an external information structure instead of letting us invent the entire brief ourselves. Personal contact information and identifying details from the original client communication are not republished.

## 3. Webza agency framing

The retained project materials describe Webza as a small web-design agency offering **custom websites for businesses** and helping clients strengthen their online presence.

The proposed service framing included areas such as:

- design;
- speed and performance;
- mobile responsiveness;
- security;
- strategy;
- support.

The project record also says Kevin worked on the pricing model and service framing. The surviving material does **not** document a specific price, subscription structure, payment from Zuxell, or revenue earned, so none of those are claimed in the public repository.

## 4. Feedback and revision

The first Zuxell version was intentionally provisional. After March Break, the team returned to the client site rather than treating the first complete build as finished.

The retained journal records feedback-driven work that included:

- clarifying sections and content structure;
- polishing the visual direction;
- strengthening the landing-page experience;
- continuing Webza's own agency site at the same time.

The record does not preserve a final client quotation, so the public documentation describes the feedback themes and resulting changes without inventing a testimonial.

## 5. Preserved source history

The original development copy remains private because it contains client material and early placeholder copy. The source history includes these useful snapshots:

| Date | Commit | What it records |
| --- | --- | --- |
| **March 9, 2026** | `bde22b5493beb27e1f03b3ad58e7e760992073dd` | First complete client interface, with most structure, styling, and interaction concentrated in one large `index.html` |
| **April 4, 2026** | `7b11eac10f6d15a3bb5e4272626994a80412621b` | Landing-page and interaction revision, including separate `style.css` and `script.js` files |
| **April 4, 2026** | `c6cf279d2bbc925c4d6098f9fce915988c4fc4cd` | Image path repair after the larger revision |

The March 9 snapshot introduced a large single-file implementation. By April 4, structure, styling, and interaction had been separated into focused files.

The April interaction layer included an optics-themed entrance, tab navigation, mobile navigation, contact interaction, scroll reveals, a navbar scroll effect, rotating headline text, animated counters, card tilt, parallax movement, a scroll-progress indicator, and staggered reveal behavior.

The purpose of preserving this history is not to claim that every effect improved the product. It shows genuine iteration. The current public reconstruction keeps the optics identity while deliberately removing several generic effects that competed with the more restrained client direction.

<p align="center">
  <img src="diagrams/implementation-evolution.svg" alt="Implementation evolution from the first client build through the spring revision and current public reconstruction" width="100%">
</p>

## 6. Original and current media

The public repository distinguishes between original project media and later documentation:

- `assets/screenshots/webza-home.png` is an original spring 2026 capture of the Webza agency website.
- `assets/screenshots/zuxell-home-current.png` is a current capture of the sanitized Zuxell reconstruction.
- `assets/screenshots/zuxell-services-current-mobile.png` and `assets/screenshots/zuxell-contact-current-mobile.png` are current mobile captures of the sanitized reconstruction.
- `diagrams/project-story.svg` was created later from the project journal, client requirements note, and source-history dates.
- `diagrams/implementation-evolution.svg` was created later from the March 9 and April 4 source snapshots plus the current public implementation.

I do not have a surviving spring screenshot of the original Zuxell site. I therefore use the preserved source history for the original implementation and clearly label the newer captures as a reconstruction.

## 7. Public reconstruction decisions

The current site is not presented as an untouched spring artifact. It is a public reconstruction built from the surviving project direction while respecting privacy and the limits of the retained materials.

The later cleanup intentionally:

- removes unsupported company statistics, certifications, client logos, testimonials, and other claims that appeared in early placeholder content;
- limits company copy to service areas and background information supported by the project materials;
- removes the blocking entrance screen and several generic motion effects;
- keeps the optics-inspired visual identity while making the client-facing copy more direct;
- improves keyboard navigation, mobile focus handling, and reduced-motion behavior;
- changes the inquiry interface so there is no HTML form submission endpoint;
- adds local and browser smoke tests for repeatable checks.

These changes improve the public presentation, but they are not retroactively described as original spring work.

## 8. What the surviving record does not tell me

Some details were never tracked closely enough to give a reliable number or quotation. I do not have:

- an exact count of every business contacted before Zuxell;
- a final client testimonial or exact final-feedback quotation;
- a record of formal final client approval before the April pitch;
- traffic, conversion, revenue, retention, sales, or measured business-growth results;
- a precise module-by-module breakdown of exactly what each teammate authored during the original project.

Rather than guess at those details later, I leave them out and focus on the parts of the project that are clearly documented.

## 9. Why this history matters

The strongest part of the project is the process behind it: deciding to pursue a real client, working from someone else's requirements, learning enough about an unfamiliar technical business to design for it, building two sites for two different audiences, revising the first version, and coordinating a team while the project was moving.

Keeping the original spring work separate from the later public cleanup makes it possible to show both the real development process and the quality improvements that came afterward without blurring them together.
