# Accessibility Guidelines for Next.js Frontend (AODA + WCAG 2.1 AA)

This document defines the accessibility standards that must be followed when building the frontend for our platform designed for people with disabilities.
Compliance with AODA (Ontario) and WCAG 2.1 Level AA is mandatory.

These rules apply to every component, page, and interaction.

---

## 1. Core Principles

We follow the four WCAG principles:

- Perceivable - Users can see/hear the content.
- Operable - Users can use the interface with keyboard or assistive tech.
- Understandable - Content and interactions are clear.
- Robust - Works with screen readers and future technologies.

---

## 2. Keyboard Accessibility (MANDATORY)

- Every interactive element must work using:
  - Tab, Shift + Tab
  - Enter, Space
  - Arrow keys (where applicable)
- Never remove focus outline. If styling it, ensure it is clearly visible.
- No keyboard traps.
- Focus order must be logical and follow visual layout.

---

## 3. Semantic HTML Rules

Always use proper HTML elements:

| Purpose        | Correct Element              |
|---------------|------------------------------|
| Button        | `<button>`                   |
| Navigation    | `<a>`                        |
| Input field   | `<input>` + `<label>`        |
| Section title | `<h1>` to `<h6>`             |
| Page layout   | `<header>`, `<nav>`, `<main>`, `<footer>` |

Never use `<div>` or `<span>` for clickable actions.

---

## 4. Screen Reader Support

### Labels

- Every input must have a `<label htmlFor="id">`.
- Icon-only buttons must have an accessible name:

```tsx
<button aria-label="Close dialog">
  <CloseIcon />
</button>
```

### Live Messages

Use:

- `role="alert"` for critical errors.
- `role="status"` for informational updates.

---

## 5. Forms Accessibility

Each form field must have:

- Label
- Helper text (if any) -> `aria-describedby`
- Error message connected via `aria-describedby`

On submit:

- Focus moves to the first error OR
- Error summary appears at top

Bad:

```html
<input placeholder="Email" />
```

Good:

```html
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

---

## 6. Color and Contrast

- Text contrast must be at least 4.5:1.
- Do not use color alone to show errors. Use icon + text + color.

Example:

- Bad: red border only
- Good: red border + error icon + message

---

## 7. Images

Informative images:

```tsx
<Image alt="User profile picture" />
```

Decorative images:

```tsx
<Image alt="" />
```

---

## 8. Motion and Animation

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
    transition: none;
  }
}
```

Avoid flashing content.

---

## 9. Navigation

Include skip link:

```html
<a href="#main" className="skip-link">Skip to main content</a>
```

Main content container:

```html
<main id="main">
```

Active page link:

```html
<a aria-current="page">Dashboard</a>
```

---

## 10. Modals / Dialogs

Must:

- Trap focus inside
- Close on ESC
- Return focus to trigger button

Have:

```html
role="dialog"
aria-modal="true"
aria-labelledby="dialog-title"
```

---

## 11. Dropdowns / Menus

- Keyboard accessible
- Arrow navigation
- ESC closes menu
- Focus returns to trigger
- Prefer Radix UI / React Aria components

---

## 12. Next.js Specific Rules

### Page Titles

Each route must have a unique title using metadata.

### Route Change Focus

On navigation, move focus to page `<h1>` or `<main>`.

Example:

```tsx
useEffect(() => {
  document.getElementById("main-heading")?.focus();
}, []);
```

---

## 13. ARIA Rules

Use ARIA only when HTML is insufficient.

Common:

- `aria-expanded`
- `aria-controls`
- `aria-invalid`
- `aria-describedby`

Never:

- Add ARIA to replace proper HTML
- Fake buttons using `<div>`

---

## 14. Testing Checklist (Required in Every PR)

- Keyboard test
- Screen reader test (NVDA or VoiceOver)
- Lighthouse accessibility audit
- Color contrast verification

---

## 15. Definition of Done (Accessibility)

A feature is done only if:

- Fully keyboard accessible
- Screen reader friendly
- Visible focus styles
- Proper HTML semantics
- Error states announced
- Motion reduced when requested
- Tested manually

---

## 16. Recommended Libraries

Use only accessible-first libraries:

- Radix UI
- React Aria
- shadcn/ui (built on Radix)

Avoid custom UI unless reviewed.
