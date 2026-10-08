# Accessibility (WCAG 2.2 AA) & Legal Compliance Specification

> **Engineering Mandate**: Complete WCAG 2.2 Level AA conformance and legal compliance with India's Digital Personal Data Protection (DPDP) Act 2023.

---

## 1. WCAG 2.2 Level AA Conformance Checklist

### 1.1 Non-Text Content (WCAG 1.1.1 - Level A)
- **Problem in Old Code**: Image alt tags contained unedited, truncated image-generation prompts (e.g. `alt="cinematic shot of robotic arm in dark background 8k resolution..."`).
- **Standard**: All non-decorative images and SVG graphics must have concise, human-authored text descriptions. Decorative icons must include `aria-hidden="true" focusable="false"`.
- **Implementation**:
  - Hero SVG Graphic: `role="img" aria-label="Schematic rendering of TRAIC autonomous rover platform"`.
  - Icon `<svg>` tags: `<svg class="icon" aria-hidden="true"><use href="#icon-robot"/></svg>`.
  - Project Cards: Explicit titles and specs in semantic DOM nodes.

---

### 1.2 Info and Relationships (WCAG 1.3.1 - Level A)
- **Problem in Old Code**: Zero `<label>` tags (placeholder-only form). Heading levels jumped directly from `<h2>` to `<h4>` in the footer. No `<main>`, `<header>`, or landmark regions.
- **Standard**: Semantic HTML structure conveying document hierarchy to assistive tech.
- **Implementation**:
  - Full landmark markup: `<header>`, `<nav>`, `<main id="main-content">`, `<section aria-labelledby="...">`, `<article>`, `<footer>`.
  - Heading hierarchy: Exactly one `<h1>` per page, followed by logical `<h2>`, `<h3>`, and `<h4>` nesting.
  - Every form input is strictly paired with an explicit `<label for="...">`:
    ```html
    <div class="form-group">
      <label for="applicant-name" class="form-label">Full Name</label>
      <input type="text" id="applicant-name" name="name" class="form-input" autocomplete="name" required aria-describedby="err-name">
      <span class="form-error" id="err-name" role="alert"></span>
    </div>
    ```

---

### 1.3 Bypass Blocks (WCAG 2.4.1 - Level A)
- **Standard**: A mechanism must be available to bypass blocks of content that are repeated on multiple web pages (such as navigation).
- **Implementation**:
  - A hidden-until-focused skip link at the top of the body:
    ```html
    <a href="#main-content" class="skip-link">Skip to main content</a>
    ```
  - Keyboard users pressing `Tab` immediately see the skip link jump down into view.

---

### 1.4 Name, Role, Value & ARIA States (WCAG 4.1.2 - Level A)
- **Standard**: Assistive technologies must programmatically determine name, role, value, and dynamic state changes.
- **Implementation**:
  - Navigation links reflect active section via `aria-current="page"`.
  - Invalid inputs receive `aria-invalid="true"` and associate with their error message via `aria-describedby="err-[id]"`.
  - Error messages receive `role="alert"`.
  - Form status feedback container has `role="status" aria-live="polite"`.
  - Project cards trigger dialogs with `aria-haspopup="dialog"`.

---

### 1.5 Target Size (Minimum 44×44px - Apple HIG & WCAG 2.5.8)
- **Standard**: Touch and mouse targets must be large enough to prevent accidental mis-taps.
- **Implementation**:
  - Buttons (`.btn`): `min-height: 44px; padding: 0 24px;`.
  - Nav links: `min-height: 44px; padding: 0 16px;`.
  - Footer links: `min-height: 44px; display: inline-flex; align-items: center;`.
  - Form inputs: `min-height: 48px;`.
  - Gallery previous/next buttons: `width: 44px; height: 44px;`.

---

### 1.6 Native `<dialog>` Modal Accessibility
- **Implementation**:
  - Uses the HTML5 native `<dialog>` element.
  - Opened via `dialog.showModal()`, which automatically implements:
    1. Built-in background inertness (locks focus inside modal).
    2. Native `Escape` key cancellation.
    3. Click-outside backdrop dismissal.
    4. Focus restoration to the invoking button on close.

---

## 2. Legal Compliance: India’s Digital Personal Data Protection (DPDP) Act 2023

As a collegiate organization operating at COER University in Uttarakhand, India, digital forms collecting personally identifiable information (PII) must comply with statutory notice and consent guidelines.

### DPDP Act 2023 Mandatory Requirements:
1. **Notice Before Collection**: State the specific purpose for which personal data is collected.
2. **Explicit Consent**: Consent must be free, specific, informed, unconditional, and unambiguous with clear affirmative action (no pre-checked boxes).
3. **No Secondary Marketing**: Explicit guarantee that applicant data is never sold, shared, or utilized for non-club activities.

### Implementation in Recruitment Form:
```html
<div class="form-group">
  <div class="consent-wrapper">
    <input type="checkbox" id="consent-dpdp" name="consent" required aria-describedby="err-consent">
    <label for="consent-dpdp">
      I consent to TRAIC collecting my name and email solely for orientation updates under India's DPDP Act 2023. Data is never shared or marketed.
    </label>
  </div>
  <span class="form-error" id="err-consent" role="alert"></span>
</div>
```
