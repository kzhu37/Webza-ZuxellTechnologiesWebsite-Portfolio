# Spring 2026 Development History

This page preserves the evidence trail for the original Webza x Zuxell Technologies project. It focuses on what happened during Spring 2026. The later public reconstruction is documented separately in [`PUBLIC_SHOWCASE.md`](PUBLIC_SHOWCASE.md).

<p align="center">
  <img src="diagrams/project-story.svg" alt="Development timeline from late February through the April 9 final pitch" width="100%">
</p>

## Evidence and provenance

| Evidence | Period | What it supports |
| --- | --- | --- |
| Original project journal and presentation materials | Spring 2026 | Team roles, outreach, client acquisition, Webza service framing, challenges, feedback themes, final pitch, and reflections |
| Zuxell requirements note | Early March 2026 | The five requested site sections and the optics-industry reference supplied for the project |
| Zuxell source checkpoint `bde22b5...` | March 9, 2026 | First complete client interface with most structure, styling, and interaction in one large `index.html` |
| Zuxell source checkpoint `7b11eac...` | April 3, 2026 | Major landing-page and interaction revision with separate `index.html`, `style.css`, and `script.js` |
| Zuxell source checkpoint `c6cf279...` | April 3, 2026 | Image-path repair immediately after the larger revision |
| Original Webza capture and surviving agency site | Spring 2026 | The second product and its intentionally more promotional visual direction |

The original Zuxell development copy remains private because it contains client material and early placeholder claims that should not be republished. The hashes above are retained as provenance rather than public links.

## 1. From assignment idea to real-client project

The retained journal records the project sequence from late February through the final presentation on April 9, 2026.

The original team was **Kevin Zhu, Vladimir Dukkardt, Michael Tetelbaum, and Algasem Zabarah**. Early brainstorming produced ideas that felt too generic or too controlled by the team. The group moved toward a web-design agency concept because it created a path to work for a real organization rather than inventing every requirement internally.

Webza was framed around custom websites for businesses. The team compiled local businesses, divided outreach, and dealt with repeated rejection or no response. In early March, Kevin connected the group with **Zuxell Technologies through a family connection**.

Zuxell worked in optical engineering and needed a stronger online presence. This gave the project an external stakeholder, an unfamiliar technical domain, and a reason to treat communication and trust as part of the work.

## 2. Client requirements

The retained Zuxell requirements note listed five requested areas:

```text
Home
About Us
Expertise
Services
Contact Us
```

The same note pointed the team toward `https://www.opticsforhire.com/` as a design reference.

That created an external information structure instead of allowing the team to invent the entire brief. Personal contact details and identifying information from the original client communication are not republished.

## 3. First client build

The first complete Zuxell version was built before March Break. The journal and presentation material describe the intended direction as clean, precise, trustworthy, and appropriate for optical engineering. The landing page was treated as the most important first impression.

The March 9 checkpoint records that first complete interface. At that stage, most structure, styling, and interaction were concentrated in one `index.html` of about 87 KB.

This mattered because the team had moved from a general agency idea to a concrete product shaped by somebody else's business and audience.

## 4. Feedback and post-break revision

March Break slowed coordination. After the break, the team returned to Zuxell with feedback rather than treating the first build as final.

The surviving notes support three main revision themes:

- make some sections clearer;
- polish the visual direction;
- strengthen the landing-page experience.

At the same time, the team continued building Webza's separate agency website.

The record does not preserve a final client quotation, so the public documentation describes the feedback themes and resulting changes without inventing a testimonial.

## 5. Source-backed technical revision

The April 3 checkpoint provides concrete evidence that the revision was not only cosmetic.

A direct comparison from the March 9 checkpoint to the April 3 revision records:

| File | Change |
| --- | --- |
| `index.html` | 210 additions and 1,306 deletions, for 1,516 changed lines |
| `style.css` | Added with 911 lines |
| `script.js` | Added with 245 lines |
| Logo asset | Reorganized into `assets/LOGOZuxell.png` |

The resulting revision separated the interface into roughly 52 KB of HTML, 49 KB of CSS, and 8 KB of JavaScript. These numbers establish the scale of the revision, not its quality.

The April interaction layer included:

- an optics-themed entrance;
- desktop and mobile tab navigation;
- contact interaction;
- scroll reveals;
- navbar scroll behavior;
- rotating headline text;
- animated counters;
- card tilt;
- parallax movement;
- a scroll-progress indicator;
- staggered reveal behavior.

The stronger lesson was that technical capability and appropriate interaction are not the same thing. More motion or more code does not automatically make a client product better.

<p align="center">
  <img src="diagrams/implementation-evolution.svg" alt="Spring 2026 implementation evolution from the March 9 first build through post-break feedback to the April 3 revision" width="100%">
</p>

## 6. Two products for two audiences

While revising Zuxell, the team also built Webza's own agency site.

Zuxell needed to communicate technical credibility to engineering clients and technical visitors. Webza needed to market the team's service, so its direction could be bolder and more promotional.

The surviving Webza site presents service ideas around design, speed, mobile responsiveness, security, strategy, and support.

This contrast became one of the project's clearest design lessons: visual identity should follow audience and purpose rather than one preferred style.

The original Webza deployment remains available at `https://webzacrew.netlify.app/`.

## 7. Business-model and service thinking

The Spring presentation materials explored a proposed **$500 initial website build plus $30 per month maintenance** model and included a classroom **$1,000 for 10% investment ask**.

Those figures show business-model and pitch thinking. They are not evidence that Zuxell paid those amounts, that Webza earned revenue, or that the proposed investment structure existed outside the classroom presentation.

The value of the exercise was broader: the team had to think about what a client was buying, what continued maintenance could mean, how to price a service, and how to explain value beyond writing code.

## 8. Team execution

Team availability changed after March Break. The journal records Michael and Vladimir being unavailable for stretches, which made coordination and handoffs more difficult while the team was revising Zuxell, building Webza, and preparing the final presentation.

The retained role notes describe **Michael and Kevin as handling much of the coding**, **Vladimir as leading much of the UI, design, and visual consistency**, and **Algasem as concentrating more heavily on presentation work**.

Kevin also handled much of the client connection, business framing, pricing thinking, coordination, and project communication. These are broad responsibility areas, not a file-by-file authorship claim.

## 9. Final presentation

Preparation continued on April 7, rehearsal took place on April 8, and the final presentation was delivered on April 9.

The presentation was rebuilt around one chronological story:

```text
Webza idea
client search
Zuxell acquisition
first client build
feedback and revision
separate Webza site
challenges
business framing
lessons
```

The slideshow used a light and optics theme to connect the presentation visually with Zuxell's field. Sections such as "Why Webza?", "Webspiration", project challenges, skills learned, tools, and the business pitch were organized around that larger progression rather than presented as disconnected features.

## 10. Claim boundaries

Some details were never tracked closely enough to support a reliable number or quotation. The surviving record does not provide:

- an exact count of every business contacted before Zuxell;
- a final client testimonial or exact final-feedback quotation;
- a record of formal final client approval before the April 9 pitch;
- traffic, conversion, revenue, retention, sales, or measured business-growth results;
- a precise module-by-module breakdown of exactly what each teammate authored.

Rather than guess at those details later, the public documentation focuses on the parts of the project that are directly supported.

## Why this history matters

The project history centers on a sequence of concrete constraints and decisions: pursuing a real client, working from somebody else's requirements, learning enough about an unfamiliar technical business to design for it, building two products for two audiences, revising the first client version, coordinating a team under changing availability, and explaining the result as both software and a service.

The later public reconstruction is documented separately so it does not blur what happened during the original Spring project.
