# Fancy Buttons

This guide covers the two button components in `components/`:

- `FancyButton` (button with arrow icon)
- `FancyButtonNoIcon` (label only, no icon)

Both components are styled with Tailwind CSS utilities, so ensure Tailwind is enabled in the project.

## FancyButton

Default export from `components/FancyButton.tsx`.

### Props

- `label` (string, required): Text inside the button.
- `color` ("navy" | "orange", optional): Color variant. Default is `"navy"`.
- `className` (string, optional): Additional classes merged into the button.
- All standard `button` attributes (for example `onClick`, `disabled`, `type`).

### Usage

```tsx
import FancyButton from "@/components/FancyButton";

<FancyButton label="Get Started" onClick={() => console.log("clicked")} />

<FancyButton
  label="Learn More"
  color="orange"
  className="w-full"
/>
```

### Notes

- The component sets `type="button"` by default. Pass `type="submit"` when used inside a form.
- The arrow icon is built in and inherits the text color.

## FancyButtonNoIcon

Default export from `components/FancyButtonNoIcon.tsx`.

### Props

- `label` (string, required): Text inside the component.
- `color` ("navy" | "orange", optional): Color variant. Default is `"navy"`.
- `borderRadius` ("full" | "lg" | "md" | "sm" | "none", optional): Corner radius. Default is `"full"`.
- `className` (string, optional): Additional classes merged into the element.
- All standard `span` attributes (for example `onClick`, `role`, `tabIndex`).

### Usage

```tsx
import Link from "next/link";
import FancyButtonNoIcon from "@/components/FancyButtonNoIcon";

<Link href="/get-started">
  <FancyButtonNoIcon label="Get Started" />
</Link>

<FancyButtonNoIcon
  label="Learn More"
  color="orange"
  borderRadius="lg"
  className="w-full"
/>
```

### Notes

- This component renders a `span`, so it does not provide button semantics on its own.
- If you need keyboard and accessibility behavior, wrap it in a `Link` or use `FancyButton`.
