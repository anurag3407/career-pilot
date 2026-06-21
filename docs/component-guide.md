````md
# Frontend Component Style Guide

## Overview

This document defines reusable frontend UI patterns, styling conventions, and component usage guidelines used throughout the project. The goal is to maintain consistency, scalability, accessibility, and a cohesive user experience across the application.

## Purpose

This guide serves as a centralized reference for reusable frontend components and interaction patterns used across the application. It helps maintain consistency in design, accessibility, and developer experience.

---

## Button Component

### File Reference

```text
frontend/src/components/Button.jsx
```

### Supported Variants

- `primary`
- `secondary`
- `danger`
- `outline`
- `ghost`
- `gradient`

### Supported Sizes

- `sm`
- `default`
- `lg`
- `xl`

### Features

- Loading state support
- Disabled state handling
- Framer Motion animations
- Hover and tap scaling interactions
- Reusable styling through `className`
- Consistent rounded design system

### Example Usage

```jsx
<Button variant="primary" size="default">
  Submit
</Button>
```

### Styling Guidelines

- Use `primary` for major actions
- Use `secondary` for optional actions
- Use `danger` for destructive actions
- Use `ghost` for minimal emphasis actions
- Maintain consistent spacing and typography
- Prefer reusable variants over inline styles

### Animation Patterns

Buttons use subtle motion interactions:

```jsx
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}
```

Transitions are configured using spring animations for smoother interaction feedback.

---

## Input Component

### File Reference

```text
frontend/src/components/Input.jsx
```

### Features

- Label support
- Required field indicators
- Error state handling
- Disabled state support
- Focus ring styling
- Reusable class extension support

### Example Usage

```jsx
<Input label="Email" type="email" name="email" placeholder="Enter your email" />
```

### Validation Guidelines

- Always provide meaningful labels
- Use validation messages for errors
- Highlight invalid fields clearly
- Maintain accessible form structures

### Styling Patterns

The component uses:

- `rounded-2xl`
- smooth transitions
- muted backgrounds
- focus ring indicators
- destructive styling for validation errors

---

## Card Component

### File Reference

```text
frontend/src/components/Card.jsx
```

### Features

- Reusable container wrapper
- Consistent spacing and shadows
- Glassmorphism-inspired backdrop blur
- Extendable through `className`

### Example Usage

```jsx
<Card>
  <h2>Dashboard Content</h2>
</Card>
```

### Styling Guidelines

Cards use:

- `rounded-[2rem]`
- `shadow-2xl`
- `backdrop-blur-xl`
- consistent border styling

Maintain consistent spacing between cards and avoid excessive nesting.

---

## Floating Action Button (FAB)

### File Reference

```text
frontend/src/components/FAB.jsx
```

### Features

- Expandable quick-action menu
- Framer Motion animations
- Scroll visibility handling
- Keyboard accessibility support
- Action-based floating menu system

### Supported Actions

- Create Portfolio
- Upload Resume
- Search Jobs
- Start Interview

### Accessibility Patterns

The component includes:

- `aria-label`
- `aria-expanded`
- keyboard escape handling
- menu roles

### Animation Guidelines

The FAB uses:

- scale transitions
- fade/slide animations
- smooth menu expansion patterns

Maintain subtle motion and avoid excessive animation complexity.

---

## General Frontend Guidelines

### Component Reusability

- Reuse shared components whenever possible
- Avoid duplicate UI implementations
- Extend existing components before creating new ones

### Styling Consistency

- Use utility-first styling consistently
- Maintain spacing and typography standards
- Prefer reusable variants over inline styling

### Accessibility

- Use semantic HTML elements
- Provide labels and ARIA attributes
- Ensure keyboard navigation support

### Animation Principles

- Keep transitions smooth and lightweight
- Use motion to improve UX, not distract users
- Maintain consistent animation timing across components

### Recommended Practices

- Keep components modular
- Use descriptive prop names
- Maintain consistent file structure
- Keep UI responsive and accessible
````
