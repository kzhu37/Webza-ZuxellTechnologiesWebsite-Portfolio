# Webza x Zuxell Technologies

**A four-person real-client web project that combined client acquisition, audience-specific design, front-end development, business thinking, iteration, and team execution for an optical engineering company.**

<p align="center">
  <a href="https://webza-zuxell-technologies-portfolio.vercel.app/"><strong>Live Zuxell showcase</strong></a>
</p>

> **Showcase note:** The live Zuxell site is a sanitized public reconstruction. Personal details, location information, and proprietary client material have been removed, and company copy is limited to information supported by the retained project materials.

<table>
  <tr>
    <th width="50%">Zuxell Technologies</th>
    <th width="50%">Webza</th>
  </tr>
  <tr>
    <td><img src="docs/assets/screenshots/zuxell-home-current.png" alt="Current Zuxell Technologies public reconstruction homepage"></td>
    <td><img src="docs/assets/screenshots/webza-home.png" alt="Original spring 2026 Webza agency website homepage"></td>
  </tr>
  <tr>
    <td align="center"><sub>Current public reconstruction, shaped around the restrained and technical direction used for the client.</sub></td>
    <td align="center"><sub>Original spring 2026 Webza capture, intentionally bolder because the agency itself was being marketed.</sub></td>
  </tr>
</table>

<p align="center">
  <a href="#from-idea-to-real-client">Story</a> ·
  <a href="#two-products-two-audiences">Design</a> ·
  <a href="#feedback-to-revision">Iteration</a> ·
  <a href="#my-contribution">Contribution</a> ·
  <a href="#technical-evolution">Technical</a> ·
  <a href="#current-public-showcase">Showcase</a>
</p>

## At a glance

| | |
| --- | --- |
| **Project type** | Real-client web design and development |
| **Team** | Kevin Zhu, Vladimir Dukkardt, Michael Tetelbaum, Algasem Zabarah |
| **Development** | Late February to April 9, 2026 |
| **Client** | Zuxell Technologies |
| **Products** | Zuxell client website and Webza agency website |
| **Core stack** | HTML, CSS, JavaScript |
| **Client brief** | Home, About Us, Expertise, Services, Contact Us |
| **My role** | Client connection, shared implementation, business and service framing, coordination, revision, and project communication |

<p align="center">
  <img src="docs/diagrams/project-story.svg" alt="Webza and Zuxell development timeline from late February through the April 9 final pitch" width="100%">
</p>

## From idea to real client

Webza began as a small web-design agency concept. We wanted to build custom websites around the needs of individual businesses instead of creating another fictional brief where we could control every requirement ourselves.

We compiled a list of local businesses, divided outreach across the team, and dealt with repeated rejections or no response. That process mattered because it forced us to treat finding the problem as part of the project rather than assuming a client would already be waiting.

In early March, I connected the team with **Zuxell Technologies through my dad**. Zuxell worked in optical engineering and needed a website. The requirements note we received specified five core areas:

```text
Home
About Us
Expertise
Services
Contact Us
```

It also pointed us toward an established optics-industry website as a design reference. From that point on, the project had external constraints: understand an unfamiliar technical business, decide what technical visitors needed first, and make design decisions for somebody else's audience.

## Two products, two audiences

The project produced two connected websites, but they were intentionally not designed to look alike.

| | **Zuxell client site** | **Webza agency site** |
| --- | --- | --- |
| **Audience** | Engineering clients and technical visitors | Businesses looking for web-design help |
| **Goal** | Establish clarity and technical credibility | Show personality, capability, and service positioning |
| **Visual direction** | Restrained, precise, professional | Bold, expressive, pitch-driven |
| **Content focus** | Optical-engineering services and inquiry | Agency identity, services, team, and process |
| **Role in the project** | External client deliverable | Our own storefront and service showcase |

The Zuxell direction centered the three service areas preserved in the client materials: **laser manufacturing, lens design, and optical testing**. The landing page was treated as the key first impression, so the client site emphasized clarity, trust, and technical restraint.

Webza could be more promotional because the agency itself was the product being marketed. The retained project materials describe our offer around **custom websites for businesses**, with service ideas spanning design, speed, mobile responsiveness, security, strategy, and support.

That contrast became one of the clearest lessons from the project: **design should respond to audience, purpose, and context instead of applying one preferred style everywhere.**

## Feedback to revision

The first complete Zuxell version was built before March Break and was not treated as final. After reviewing the first version and receiving feedback, we returned to the client site, clarified sections, polished the design, and strengthened the landing-page direction.

The surviving source history shows the implementation changing at the same time. A **March 9** snapshot kept most structure, styling, and interaction in one large `index.html`. By the **April 4** revision, the site had been reorganized into `index.html`, `style.css`, and `script.js`, alongside a larger interaction layer.

| Observation or constraint | Decision | Result |
| --- | --- | --- |
| A fictional client would have been easier but less meaningful | Keep pursuing a real organization despite unsuccessful outreach | The project gained external requirements and a real stakeholder context |
| The first client build was useful but still provisional | Return to the site after March Break and revise instead of treating the first complete version as finished | Sections became clearer and the landing-page direction was polished |
| Zuxell and Webza served different audiences | Give each product its own visual identity and content priorities | Zuxell became restrained and technical while Webza became bolder and more promotional |
| The early client implementation was tightly coupled | Separate structure, styling, and interaction during revision | The codebase became easier to reason about and continue refining |
| Michael and Vladimir were unavailable for stretches after March Break | Reprioritize work and keep the client site, agency site, and pitch moving | Coordination became a practical project constraint rather than an abstract teamwork lesson |
| The agency, client, revision work, and two sites risked feeling disconnected | Rebuild the final pitch around one chronological story | The final presentation connected outreach, client work, design decisions, challenges, revision, and reflection |

The detailed chronology is preserved in [`docs/DEVELOPMENT_HISTORY.md`](docs/DEVELOPMENT_HISTORY.md).

## My contribution

This was collaborative work, and the retained project record is much stronger at describing **areas of work** than assigning exact files to individual people. I therefore do not reconstruct module-by-module authorship after the fact.

My contribution crossed both implementation and the client-facing side of the project:

| Area | My contribution |
| --- | --- |
| **Project direction** | Helped push the group toward a real-client engagement instead of stopping at a hypothetical brief |
| **Client acquisition** | Participated in outreach and ultimately connected the team with Zuxell Technologies through my dad |
| **Implementation** | Worked on coding and revision alongside Michael, while Vladimir led much of the UI, design, and visual-consistency work |
| **Business framing** | Helped shape how Webza described its services, pricing thinking, and value to a real client without treating the work as only a coding exercise |
| **Coordination** | Helped keep the two websites and the final project story moving while teammate availability changed |
| **Communication** | Helped shape the startup-style pitch, chronology, challenge explanations, audience contrast, and final lessons |

The team's strengths overlapped. The retained notes describe **Michael and me as handling much of the coding**, **Vladimir as leading much of the interface and visual direction**, and **Algasem as more presentation-focused**, while I also carried much of the business and client framing. That division is useful context, but it is not a claim that any one person exclusively owned a specific module.

## Technical evolution

The project used browser fundamentals rather than a front-end framework. The technical work was therefore about responsive layout, navigation, interaction, presentation, and keeping two different site identities coherent in a small codebase.

<p align="center">
  <img src="docs/diagrams/implementation-evolution.svg" alt="Implementation evolution from the March 9 client build to the April 4 revision and current public reconstruction" width="100%">
</p>

### Original spring implementation

The **March 9** client snapshot concentrated most of the interface in one large `index.html`. By **April 4**, structure, styling, and interaction had been separated into focused files:

```text
index.html  -> structure and content
style.css   -> visual system and responsive layout
script.js   -> navigation and interaction
```

The spring interaction layer experimented with an optics-themed entrance, desktop and mobile navigation, contact interaction, scroll reveals, a navbar scroll effect, rotating headline text, animated counters, card tilt, parallax, progress indication, and staggered reveal behavior.

Not every effect survived later review, and that is part of the engineering lesson. More interaction is not automatically better interaction. The client direction called for precision and credibility, so the public showcase now keeps the optics identity while removing motion that competed with the content.

### Current browser behavior

The current public site keeps the lightweight HTML, CSS, and JavaScript stack while adding:

- semantic section structure and hash-based navigation;
- responsive desktop, tablet, and mobile layouts;
- keyboard-operable navigation with focus management;
- visible focus states and reduced-motion support;
- a browser-only inquiry demonstration that validates data without transmitting it;
- dependency-free local serving and repeatable browser smoke checks.

<table>
  <tr>
    <td width="50%"><img src="docs/assets/screenshots/zuxell-services-current-mobile.png" alt="Current Zuxell services page on a mobile viewport"></td>
    <td width="50%"><img src="docs/assets/screenshots/zuxell-contact-current-mobile.png" alt="Current Zuxell inquiry interface on a mobile viewport"></td>
  </tr>
  <tr>
    <td align="center"><sub>Responsive services layout on a narrow viewport.</sub></td>
    <td align="center"><sub>Browser-only inquiry interface with no submission endpoint.</sub></td>
  </tr>
</table>

## What I would change next time

**Formalize client onboarding earlier.** We had a requirements note, but a stronger engagement would define scope, content ownership, revision expectations, and a feedback schedule before development accelerated.

**Make outreach more systematic.** We created a list and divided calls, but the process was improvised. A simple outreach tracker and clearer follow-up process would have made client acquisition more deliberate.

**Define ownership and handoffs earlier.** When availability changed after March Break, responsibility became less predictable. Clearer ownership would have reduced coordination friction.

**Review the story while building, not only before presenting.** The final pitch forced us to connect the agency, client, design choices, challenges, and revisions into one understandable sequence. Doing that earlier would have improved both the product process and the explanation of our decisions.

The biggest lesson was that software becomes more demanding when the constraints come from real people. Technical implementation still matters, but so do trust, scope, communication, audience, revision, and the ability to explain why a design decision exists.

## Current public showcase

The live site in this repository is a **sanitized reconstruction**, not an untouched spring artifact. The original development copy contains client material and early placeholder claims that should not be public.

The current version deliberately:

- keeps the documented client structure and supported service areas;
- removes unsupported statistics, certifications, client logos, testimonials, and other placeholder claims;
- reduces generic motion so the interface better matches the restrained client direction;
- improves keyboard, mobile, focus, and reduced-motion behavior;
- keeps inquiry validation entirely in the browser, with no submission endpoint;
- adds lightweight automated checks for layout, navigation, accessibility state, content hygiene, and console failures.

Those later improvements are useful public-release work, but they are not retroactively described as original spring work. The distinction is documented in [`docs/DEVELOPMENT_HISTORY.md`](docs/DEVELOPMENT_HISTORY.md).

## Run locally

### Requirements

- Node.js 20 or newer
- No install step
- No runtime package dependencies

```bash
npm start
```

Open the local URL printed in the terminal.

To run the verification checks:

```bash
npm test
```

## Repository map

- `index.html`: current public Zuxell reconstruction
- `style.css`: responsive visual system
- `script.js`: navigation, focus behavior, and inquiry validation
- `dev-server.js`: dependency-free local server
- `tests/`: content, server, and browser smoke checks
- `docs/DEVELOPMENT_HISTORY.md`: original project chronology and public-release boundaries
- `docs/diagrams/`: project timeline and implementation-evolution visuals
- `docs/assets/screenshots/`: current Zuxell captures and original Webza capture
- `ATTRIBUTION.md`: collaboration, media, and source notes

## Collaboration and attribution

The original spring 2026 project was collaborative work by **Kevin Zhu, Vladimir Dukkardt, Michael Tetelbaum, and Algasem Zabarah**.

The current Zuxell reconstruction references demonstration photography from Pexels and loads DM Sans and Playfair Display through Google Fonts. See [`ATTRIBUTION.md`](ATTRIBUTION.md) for the detailed media and collaboration notes.

The project does not claim details that the surviving record cannot support, including an exact final client quotation, formal final approval before the April pitch, traffic, conversion, revenue, or a precise module-by-module authorship breakdown.
