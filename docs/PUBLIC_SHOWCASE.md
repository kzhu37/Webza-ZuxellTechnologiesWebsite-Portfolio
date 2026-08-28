# Later Public Showcase

This page documents the later sanitized Zuxell reconstruction at the repository root. It is supporting portfolio work, not part of the original Spring 2026 project chronology.

## Why a reconstruction exists

No untouched Spring screenshot of the original Zuxell site survives in the retained materials. The original development source also contains client material and early placeholder claims that should not be republished as verified company information.

Instead of presenting that source publicly as though every statement were historical fact, this repository keeps the original source checkpoints private for provenance and provides a later sanitized reconstruction for inspection.

The reconstruction:

- keeps the original lightweight HTML, CSS, and JavaScript direction;
- limits public company copy to service areas and background information supported by retained materials;
- removes unsupported statistics, certifications, client logos, testimonials, and similar placeholder claims;
- removes the blocking entrance screen and several generic motion effects;
- keeps an optics-inspired visual identity while making the client-facing copy more direct;
- adds responsive and keyboard-operable navigation;
- adds focus restoration, visible focus states, and reduced-motion support;
- changes the inquiry interface so entries are validated locally and never transmitted;
- adds syntax, content, server, and browser smoke checks.

The point of the reconstruction is inspectability, not historical substitution. It shows how the client-facing direction can be presented publicly without blurring the boundary between retained Spring evidence and later portfolio cleanup.

## Current reconstruction media

<table>
  <tr>
    <td width="50%">
      <img src="assets/screenshots/zuxell-services-current-mobile.png" alt="Later sanitized Zuxell reconstruction showing the services page on mobile">
    </td>
    <td width="50%">
      <img src="assets/screenshots/zuxell-contact-current-mobile.png" alt="Later sanitized Zuxell reconstruction showing the contact inquiry interface on mobile">
    </td>
  </tr>
  <tr>
    <td align="center"><sub><strong>Services:</strong> a focused path through the three supported optical-engineering service areas.</sub></td>
    <td align="center"><sub><strong>Inquiry:</strong> responsive form-style interaction that validates locally and sends no information.</sub></td>
  </tr>
</table>

These are later reconstruction captures, not untouched Spring 2026 screenshots.

The repository also retains `assets/screenshots/zuxell-home-current.png`, an earlier reconstruction homepage capture used in the README's opening visual comparison. That image contains a founding-year statement that the retained public record does not support consistently, so it is preserved for visual presentation only and is not evidence for that claim. The current live reconstruction omits the statement.

## Verification

Run the repository root with:

```bash
npm start
```

Run the complete verification path with:

```bash
npm test
```

The browser checks cover desktop through narrow-mobile layouts, navigation, focus behavior, inquiry validation, image alternative text, placeholder links, metadata, overflow, and console errors.

The content audit also rejects long-dash characters and broken local documentation references.

## Boundary with the original project

The original Spring work is documented through the surviving Webza deployment and capture, the client requirements note, project journal and presentation materials, and dated Zuxell source checkpoints.

The reconstruction should not be read as untouched Spring source or used to infer exact Spring authorship. For the original chronology, use [`DEVELOPMENT_HISTORY.md`](DEVELOPMENT_HISTORY.md). For sanitized original source excerpts, use [`ORIGINAL_TECHNICAL_EVIDENCE.md`](ORIGINAL_TECHNICAL_EVIDENCE.md). For collaboration and media provenance, use [`../ATTRIBUTION.md`](../ATTRIBUTION.md).
