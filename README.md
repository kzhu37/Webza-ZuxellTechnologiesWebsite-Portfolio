# Webza x Zuxell Technologies | Client Website Project

<p align="center">
  <strong>A four-person client website project connecting outreach, an optical-engineering brief, stakeholder feedback, and implementation in a responsive static experience.</strong>
</p>

<p align="center">
  HTML · CSS · JavaScript · Node.js
</p>

<p align="center">
  <a href="https://webzacrew.netlify.app/"><strong>Original Webza site</strong></a>
  &nbsp;·&nbsp;
  <a href="https://webza-zuxell-technologies-portfolio.vercel.app/"><strong>Sanitized Zuxell showcase</strong></a>
  &nbsp;·&nbsp;
  <a href="#implementation"><strong>Implementation</strong></a>
</p>

## Project context

This was a real-client, four-person project involving outreach, external optical-engineering requirements, feedback, and revision. It produced two different audience-facing outcomes: a site presenting the Webza team and a Zuxell Technologies website concept. This repository contains the **Zuxell static-site portfolio showcase**, not the original Webza team's entire working history.

The engineering work here is intentionally different from the computational optics, algorithms, accessibility, and state-management work shown elsewhere in my portfolio. The core constraint was translating an external brief into a responsive, navigable product while balancing communication, visual presentation, and implementation.

## At a glance

| Area | Repository evidence |
| --- | --- |
| **Implementation** | Responsive single-page HTML, CSS, and vanilla JavaScript |
| **Navigation** | URL-hash-linked section views, browser history handling, desktop navigation, and mobile menu |
| **Interaction** | Dismissible lens intro, reduced-motion behavior, scroll/reveal effects, and a contact mailto flow |
| **Accessibility work** | Skip link, semantic landmarks, keyboard intro dismissal, mobile focus handling, and inactive-section inert states |
| **Local development** | Dependency-free Node HTTP server with MIME types, fallback ports, and path containment checks |
| **Verification** | JavaScript syntax checks, server smoke tests, and headless Chrome/Edge browser interaction checks |
| **Project scope** | Client-facing website showcase, not a backend platform, customer portal, or proof of business outcomes |

## Implementation

### Navigation without a framework

[`script.js`](script.js) maintains six named website views and maps URL fragments to the visible section. Switching views updates the navigation state, sets `aria-hidden`, and marks inactive panels `inert` so keyboard interactions do not enter hidden content. Hash changes are also handled when a visitor navigates through browser history or follows a deep link.

The mobile menu manages focus on opening and closing, supports Escape, and constrains Tab navigation while open. The animated lens introduction can be skipped by keyboard, automatically dismisses, respects reduced-motion preferences, and records dismissal in session storage.

These choices support a richer presentation while keeping the core site navigable without a frontend framework.

### Responsive design and small interaction details

[`style.css`](style.css) handles the responsive layouts and design language. [`index.html`](index.html) provides the site content, semantic navigation, section landmarks, and contact entry points. The contact form opens a prepared message in the visitor's email application rather than transmitting inquiries to an invented server or database.

Animation is progressive rather than required for basic access. The site also supplies a skip link, reduced-motion handling, and a no-JavaScript fallback for the introductory overlay.

### Lightweight local tooling and verification

[`dev-server.js`](dev-server.js) serves local files without external packages. It supports GET and HEAD, handles content types, rejects traversal outside the project, and picks an alternative local port if the default is in use.

The [server smoke test](tests/server-smoke.js) checks HTTP status codes, content types, unavailable paths, unsupported methods, and traversal rejection. The [browser smoke test](tests/browser-smoke.js) uses Chrome DevTools Protocol to exercise navigation, responsive layouts, form validation, accessibility state, resource failures, and browser-console behavior.

The tests verify the current showcase implementation; they do not establish customer acquisition, commercial results, or the truth of marketing figures.

## Content and contribution boundaries

The Zuxell deployment is a **sanitized portfolio showcase**, not a source of independently verified claims about client totals, projects delivered, corporate endorsements, or current commercial operations. Any numerical marketing copy, illustrative testimonials, and logos within the showcase should be treated as presentation content unless supported by independent client-approved evidence.

This repository represents one outcome of a four-person project. It is not an assertion that I independently authored every contribution to both websites. The original Webza team site is linked above so the two products are not conflated.

## Run locally

Requires Node.js and a current Chrome or Edge installation for the browser smoke test.

```bash
npm start
```

The server normally starts at `http://127.0.0.1:8080`; if the port is occupied, it tries nearby ports and reports the selected URL.

In VS Code, select **Run website in Chrome** or **Run website in Edge** from Run and Debug.

### Validate

```bash
npm test
```

This runs syntax, server, and browser checks. To run subsets, use `npm run test:server` or `npm run test:browser`. Browser tests require a supported local browser, and `CHROME_PATH` may be set explicitly.
