# Original Spring Technical Evidence

This page exposes a small sanitized view of the original collaborative Spring 2026 Zuxell implementation. The full development source remains private because it contains client material and early placeholder claims that should not be republished as verified company information.

The evidence below records implementation structure and revision. It is not an individual-authorship claim.

## Retained checkpoints

| Checkpoint | Date | What it records |
| --- | --- | --- |
| `bde22b5493beb27e1f03b3ad58e7e760992073dd` | March 9, 2026 | First complete client interface, with most structure, styling, and interaction concentrated in one `index.html` |
| `7b11eac10f6d15a3bb5e4272626994a80412621b` | April 3, 2026 | Revised landing page and interaction work, with structure, styling, and behavior separated across `index.html`, `style.css`, and `script.js` |

A direct checkpoint comparison records the scale of the revision:

| File | Change from March 9 to April 3 |
| --- | --- |
| `index.html` | 210 additions and 1,306 deletions, for 1,516 changed lines |
| `style.css` | Added with 911 lines |
| `script.js` | Added with 245 lines |
| Logo asset | Reorganized into `assets/LOGOZuxell.png` |

These counts show how much source changed. They do not, by themselves, establish quality.

<p align="center">
  <img src="diagrams/source-architecture.svg" alt="Original Zuxell source architecture comparison between the March 9 single-document build and April 3 separated implementation" width="100%">
</p>

## Before: structure, styling, and behavior were tightly coupled

The March 9 checkpoint kept the visual system inside `index.html`. This short excerpt is reproduced without client copy or private material:

```html
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --blue-deep: #143d5c;
  --blue-mid: #1a6fa0;
  --blue-light: #2a8fcf;
  --green-main: #5cb553;
  --text-primary: #1a2633;
  --text-secondary: #4a5d6f;
  --radius: 12px;
  --radius-lg: 20px;
}
</style>
```

The significance is not the particular CSS variables. The first complete interface still carried page structure, styling, and interaction in one large document, so continued client-facing changes meant working inside a tightly coupled file.

## After: responsibilities were separated during active revision

By April 3, structure, styling, and behavior had moved into separate files. Navigation and other behavior lived in `script.js`. This short excerpt shows the original tab-switching structure:

```javascript
function switchTab(tabName) {
  document.querySelectorAll('.tab-page').forEach(function(p) {
    p.classList.remove('active');
  });

  var target = document.getElementById('page-' + tabName);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }

  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
    if (a.getAttribute('data-tab') === tabName) a.classList.add('active');
  });
}
```

The same April interaction layer also included mobile navigation, contact behavior, scroll reveals, navbar scroll behavior, animated content, card motion, parallax experiments, and a scroll-progress indicator.

## How feedback mapped to implementation decisions

The retained journal and presentation materials preserve three main post-break feedback themes: clearer sections, a more polished visual direction, and a stronger landing-page experience. The source comparison does not let us attribute every changed line to one feedback comment, but it does show where the team created more room to revise.

| Product need | Implementation response | Why it mattered |
| --- | --- | --- |
| Refine the landing-page experience | Major `index.html` revision while preserving the requested client sections | Structure could change without treating the first complete build as final |
| Improve visual polish | Move the visual system into a dedicated `style.css` | Layout and styling changes no longer had to remain embedded in the page document |
| Expand and revise interaction | Move behavior into `script.js` | Navigation and motion logic became easier to inspect and change separately |
| Maintain media cleanly | Reorganize the logo into an `assets/` path | Client-facing assets gained a clearer place in the project structure |
| Continue development while Webza was also moving | Separate concerns instead of expanding the single file further | Cleaner boundaries reduced the amount of unrelated code touched during iteration |

This was still a browser-fundamentals project rather than a framework-heavy application. The technical value lies in the revision process, separation of responsibilities, and judgment used while the client product was changing, not in treating multiple files as inherently advanced.

## Interaction judgment became part of the engineering

The Spring version experimented with entrance effects, animated counters, rotating text, card tilt, parallax movement, scroll progress, and other motion. Implementing those effects expanded the interaction layer, but client work introduced a second question: **does this interaction improve the experience enough to justify itself?**

That distinction became one of the most useful technical lessons from the project. A richer effect can increase code and visual activity while still reducing clarity, comfort, or credibility. The later reconstruction therefore removes or simplifies several Spring motion experiments rather than preserving every effect as though more animation automatically meant better engineering.

## Why the revision matters

The important change was not simply that three files replaced one. The revision happened while the team was responding to feedback about clarity, visual polish, and the landing-page experience.

Separating structure, styling, behavior, and assets made continued refinement easier to reason about while the product itself was still changing. That is the practical engineering story supported by the retained checkpoints.

## Evidence boundary

These excerpts come from the original collaborative Spring source checkpoints. They are intentionally narrow and omit client-specific copy, contact information, unsupported statistics, testimonials, logos beyond the client identity already documented publicly, and other material that should not be republished.

The repository-root `index.html`, `style.css`, and `script.js` are a later sanitized public reconstruction. They should not be read as the untouched Spring source or used to infer exact Spring authorship.

For the complete chronology, see [`DEVELOPMENT_HISTORY.md`](DEVELOPMENT_HISTORY.md). For collaboration and media provenance, see [`../ATTRIBUTION.md`](../ATTRIBUTION.md).
