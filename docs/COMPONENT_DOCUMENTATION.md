# Component Documentation

## Overview
This document provides comprehensive documentation for all UI components, including React, Vue, Angular, and other framework components.

## Table of Contents
- [React Components](#react-components)
- [Vue Components](#vue-components)
- [Angular Components](#angular-components)
- [Web Components](#web-components)
- [Component Guidelines](#component-guidelines)
- [Props/Properties](#propsproperties)
- [Events](#events)
- [Slots/Content Projection](#slotscontent-projection)
- [Styling](#styling)
- [Accessibility](#accessibility)
- [Testing](#testing)

## React Components

### Button Component
A reusable button component with various styles and states.

**File:** `components/Button/Button.jsx`

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button component for user interactions
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  const handleClick = (event) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  const className = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      <span className="btn__content">{children}</span>
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
};

export default Button;
```

**Usage Examples:**
```javascript
// Basic usage
<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>

// Different variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Different sizes
<Button size="small">Small Button</Button>
<Button size="medium">Medium Button</Button>
<Button size="large">Large Button</Button>

// States
<Button disabled>Disabled Button</Button>
<Button loading>Loading Button</Button>

// With icon
<Button>
  <Icon name="plus" />
  Add Item
</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `string` | `'primary'` | Button style variant (`'primary'`, `'secondary'`, `'danger'`, `'ghost'`) |
| `size` | `string` | `'medium'` | Button size (`'small'`, `'medium'`, `'large'`) |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `loading` | `boolean` | `false` | Whether the button is in loading state |
| `children` | `node` | - | Button content |
| `onClick` | `function` | - | Click event handler |

### Modal Component
A flexible modal component for displaying content in an overlay.

**File:** `components/Modal/Modal.jsx`

```javascript
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Modal component for displaying content in an overlay
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size
 * @param {boolean} props.closeOnBackdropClick - Whether to close on backdrop click
 * @returns {JSX.Element|null} Modal component
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdropClick = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal--${size}`}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  closeOnBackdropClick: PropTypes.bool
};

export default Modal;
```

**Usage Examples:**
```javascript
const [isModalOpen, setIsModalOpen] = useState(false);

// Basic modal
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
  <div className="modal-actions">
    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>

// Large modal
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="User Profile"
  size="large"
>
  <UserProfileForm />
</Modal>
```

## Vue Components

### VButton Component
A Vue.js button component with composition API.

**File:** `components/VButton.vue`

```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>

<script>
import { computed } from 'vue';

/**
 * Button component for user interactions
 * 
 * @component VButton
 * @param {string} variant - Button style variant
 * @param {string} size - Button size
 * @param {boolean} disabled - Whether button is disabled
 * @param {boolean} loading - Whether button is in loading state
 * @emits click - Emitted when button is clicked
 */
export default {
  name: 'VButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonClasses = computed(() => [
      'btn',
      `btn--${props.variant}`,
      `btn--${props.size}`,
      props.disabled && 'btn--disabled',
      props.loading && 'btn--loading'
    ].filter(Boolean));

    const handleClick = (event) => {
      if (!props.disabled && !props.loading) {
        emit('click', event);
      }
    };

    return {
      buttonClasses,
      handleClick
    };
  }
};
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--primary {
  background-color: #007bff;
  color: white;
}

.btn--secondary {
  background-color: #6c757d;
  color: white;
}

.btn--danger {
  background-color: #dc3545;
  color: white;
}

.btn--ghost {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn--small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn--medium {
  padding: 8px 16px;
  font-size: 14px;
}

.btn--large {
  padding: 12px 24px;
  font-size: 16px;
}

.btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--loading {
  position: relative;
  pointer-events: none;
}

.btn__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
```

**Usage Examples:**
```vue
<template>
  <!-- Basic usage -->
  <VButton @click="handleClick">Click Me</VButton>

  <!-- Different variants -->
  <VButton variant="primary">Primary</VButton>
  <VButton variant="secondary">Secondary</VButton>
  <VButton variant="danger">Danger</VButton>
  <VButton variant="ghost">Ghost</VButton>

  <!-- Different sizes -->
  <VButton size="small">Small</VButton>
  <VButton size="medium">Medium</VButton>
  <VButton size="large">Large</VButton>

  <!-- States -->
  <VButton disabled>Disabled</VButton>
  <VButton loading>Loading</VButton>
</template>

<script>
import VButton from './components/VButton.vue';

export default {
  components: {
    VButton
  },
  methods: {
    handleClick() {
      console.log('Button clicked!');
    }
  }
};
</script>
```

## Angular Components

### Button Component
An Angular button component with proper typing and accessibility.

**File:** `components/button/button.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Button component for user interactions
 * 
 * @example
 * <app-button 
 *   variant="primary" 
 *   size="medium" 
 *   (click)="handleClick()">
 *   Click Me
 * </app-button>
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  /**
   * Button style variant
   * @default 'primary'
   */
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';

  /**
   * Button size
   * @default 'medium'
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Whether button is disabled
   * @default false
   */
  @Input() disabled: boolean = false;

  /**
   * Whether button is in loading state
   * @default false
   */
  @Input() loading: boolean = false;

  /**
   * Click event emitter
   */
  @Output() click = new EventEmitter<MouseEvent>();

  /**
   * Button CSS classes
   */
  get buttonClasses(): string[] {
    return [
      'btn',
      `btn--${this.variant}`,
      `btn--${this.size}`,
      this.disabled ? 'btn--disabled' : '',
      this.loading ? 'btn--loading' : ''
    ].filter(Boolean);
  }

  constructor() {}

  ngOnInit(): void {}

  /**
   * Handle button click
   * @param event - Mouse event
   */
  onButtonClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
}
```

**Template:** `components/button/button.component.html`

```html
<button
  [class]="buttonClasses.join(' ')"
  [disabled]="disabled || loading"
  (click)="onButtonClick($event)"
  [attr.aria-disabled]="disabled || loading"
>
  <span *ngIf="loading" class="btn__spinner" aria-hidden="true"></span>
  <span class="btn__content">
    <ng-content></ng-content>
  </span>
</button>
```

**Styles:** `components/button/button.component.scss`

```scss
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 14px;
  position: relative;

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  &--primary {
    background-color: #007bff;
    color: white;

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
  }

  &--secondary {
    background-color: #6c757d;
    color: white;

    &:hover:not(:disabled) {
      background-color: #545b62;
    }
  }

  &--danger {
    background-color: #dc3545;
    color: white;

    &:hover:not(:disabled) {
      background-color: #c82333;
    }
  }

  &--ghost {
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;

    &:hover:not(:disabled) {
      background-color: #007bff;
      color: white;
    }
  }

  &--small {
    padding: 4px 8px;
    font-size: 12px;
  }

  &--medium {
    padding: 8px 16px;
    font-size: 14px;
  }

  &--large {
    padding: 12px 24px;
    font-size: 16px;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--loading {
    pointer-events: none;
  }

  &__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__content {
    display: inline-block;
  }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
```

**Usage Examples:**
```html
<!-- Basic usage -->
<app-button (click)="handleClick()">Click Me</app-button>

<!-- Different variants -->
<app-button variant="primary">Primary</app-button>
<app-button variant="secondary">Secondary</app-button>
<app-button variant="danger">Danger</app-button>
<app-button variant="ghost">Ghost</app-button>

<!-- Different sizes -->
<app-button size="small">Small</app-button>
<app-button size="medium">Medium</app-button>
<app-button size="large">Large</app-button>

<!-- States -->
<app-button [disabled]="true">Disabled</app-button>
<app-button [loading]="isLoading">Loading</app-button>
```

## Web Components

### Custom Button Web Component
A framework-agnostic web component using vanilla JavaScript.

**File:** `components/custom-button.js`

```javascript
/**
 * Custom Button Web Component
 * 
 * @element custom-button
 * @attr {string} variant - Button style variant (primary, secondary, danger, ghost)
 * @attr {string} size - Button size (small, medium, large)
 * @attr {boolean} disabled - Whether button is disabled
 * @attr {boolean} loading - Whether button is in loading state
 * @fires click - Fired when button is clicked
 * 
 * @example
 * <custom-button variant="primary" size="medium">Click Me</custom-button>
 */
class CustomButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.shadowRoot.querySelector('button').addEventListener('click', this.handleClick.bind(this));
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('button').removeEventListener('click', this.handleClick.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get variant() {
    return this.getAttribute('variant') || 'primary';
  }

  get size() {
    return this.getAttribute('size') || 'medium';
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  get loading() {
    return this.hasAttribute('loading');
  }

  handleClick(event) {
    if (!this.disabled && !this.loading) {
      this.dispatchEvent(new CustomEvent('click', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    const classes = [
      'btn',
      `btn--${this.variant}`,
      `btn--${this.size}`,
      this.disabled && 'btn--disabled',
      this.loading && 'btn--loading'
    ].filter(Boolean).join(' ');

    this.shadowRoot.innerHTML = `
      <style>
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 14px;
          position: relative;
        }

        .btn:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        .btn--primary {
          background-color: #007bff;
          color: white;
        }

        .btn--primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn--secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn--secondary:hover:not(:disabled) {
          background-color: #545b62;
        }

        .btn--danger {
          background-color: #dc3545;
          color: white;
        }

        .btn--danger:hover:not(:disabled) {
          background-color: #c82333;
        }

        .btn--ghost {
          background-color: transparent;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .btn--ghost:hover:not(:disabled) {
          background-color: #007bff;
          color: white;
        }

        .btn--small {
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn--medium {
          padding: 8px 16px;
          font-size: 14px;
        }

        .btn--large {
          padding: 12px 24px;
          font-size: 16px;
        }

        .btn--disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn--loading {
          pointer-events: none;
        }

        .btn__spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      </style>
      <button 
        class="${classes}"
        ${this.disabled || this.loading ? 'disabled' : ''}
        aria-disabled="${this.disabled || this.loading}"
      >
        ${this.loading ? '<span class="btn__spinner" aria-hidden="true"></span>' : ''}
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('custom-button', CustomButton);
```

**Usage Examples:**
```html
<!-- Basic usage -->
<custom-button>Click Me</custom-button>

<!-- Different variants -->
<custom-button variant="primary">Primary</custom-button>
<custom-button variant="secondary">Secondary</custom-button>
<custom-button variant="danger">Danger</custom-button>
<custom-button variant="ghost">Ghost</custom-button>

<!-- Different sizes -->
<custom-button size="small">Small</custom-button>
<custom-button size="medium">Medium</custom-button>
<custom-button size="large">Large</custom-button>

<!-- States -->
<custom-button disabled>Disabled</custom-button>
<custom-button loading>Loading</custom-button>

<!-- Event handling -->
<custom-button id="myButton">Click Me</custom-button>
<script>
  document.getElementById('myButton').addEventListener('click', () => {
    console.log('Button clicked!');
  });
</script>
```

## Component Guidelines

### 1. Naming Conventions
- Use PascalCase for component names (e.g., `UserProfile`, `NavigationBar`)
- Use descriptive names that clearly indicate the component's purpose
- Avoid abbreviations unless they're widely understood

### 2. Props/Properties Design
- Use clear, descriptive prop names
- Provide default values for optional props
- Use TypeScript or PropTypes for type validation
- Document all props with JSDoc comments

### 3. Component Structure
```
components/
├── Button/
│   ├── Button.jsx
│   ├── Button.test.js
│   ├── Button.stories.js
│   ├── Button.css
│   └── index.js
├── Modal/
│   ├── Modal.jsx
│   ├── Modal.test.js
│   ├── Modal.stories.js
│   ├── Modal.css
│   └── index.js
```

### 4. Documentation Standards
- Include JSDoc comments for all public methods and props
- Provide usage examples in component documentation
- Document accessibility features and keyboard interactions
- Include visual examples using Storybook or similar tools

### 5. Testing Requirements
- Unit tests for component behavior
- Integration tests for component interactions
- Accessibility tests using tools like axe-core
- Visual regression tests for UI consistency

## Props/Properties

### Common Prop Patterns

#### Size Props
```javascript
// Good: Enumerated values
size: PropTypes.oneOf(['small', 'medium', 'large'])

// Better: With defaults
size: {
  type: String,
  default: 'medium',
  validator: (value) => ['small', 'medium', 'large'].includes(value)
}
```

#### Variant Props
```javascript
// Style variants
variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger'])

// Behavioral variants
type: PropTypes.oneOf(['button', 'submit', 'reset'])
```

#### Boolean Props
```javascript
// Simple boolean
disabled: PropTypes.bool

// With default
disabled: {
  type: Boolean,
  default: false
}
```

#### Function Props
```javascript
// Event handlers
onClick: PropTypes.func
onSubmit: PropTypes.func.isRequired

// With validation
onClick: {
  type: Function,
  required: false
}
```

## Events

### Event Naming
- Use descriptive event names (e.g., `userSelected`, `itemDeleted`)
- Prefix with component context when needed (e.g., `modalClosed`, `tabChanged`)
- Use consistent naming patterns across components

### Event Payloads
```javascript
// Simple event
this.$emit('click', event);

// With additional data
this.$emit('userSelected', {
  user: selectedUser,
  index: selectedIndex,
  originalEvent: event
});

// Angular EventEmitter
this.userSelected.emit({
  user: selectedUser,
  index: selectedIndex
});
```

## Slots/Content Projection

### React Children
```javascript
// Simple content
<Button>Click Me</Button>

// Multiple content areas
<Modal>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>Actions</ModalFooter>
</Modal>
```

### Vue Slots
```vue
<!-- Default slot -->
<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<!-- Named slots -->
<template>
  <div class="card">
    <header class="card-header">
      <slot name="header"></slot>
    </header>
    <main class="card-body">
      <slot></slot>
    </main>
    <footer class="card-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

### Angular Content Projection
```html
<!-- Single projection -->
<div class="card">
  <ng-content></ng-content>
</div>

<!-- Multiple projections -->
<div class="card">
  <header class="card-header">
    <ng-content select="[slot=header]"></ng-content>
  </header>
  <main class="card-body">
    <ng-content></ng-content>
  </main>
  <footer class="card-footer">
    <ng-content select="[slot=footer]"></ng-content>
  </footer>
</div>
```

## Styling

### CSS Architecture
- Use BEM methodology for CSS classes
- Implement CSS custom properties for theming
- Use CSS modules or styled-components for scoped styles
- Provide consistent spacing and typography scales

### Example BEM Structure
```css
/* Block */
.button {
  display: inline-block;
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
}

/* Element */
.button__icon {
  margin-right: var(--spacing-sm);
}

/* Modifier */
.button--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.button--large {
  padding: var(--spacing-lg);
  font-size: var(--font-size-lg);
}
```

## Accessibility

### ARIA Attributes
```html
<!-- Button with aria-label -->
<button aria-label="Close modal">×</button>

<!-- Button with aria-describedby -->
<button aria-describedby="help-text">Submit</button>
<div id="help-text">This will submit the form</div>

<!-- Toggle button -->
<button aria-pressed="false">Toggle</button>
```

### Keyboard Navigation
```javascript
// Handle keyboard events
const handleKeyDown = (event) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      handleClick(event);
      break;
    case 'Escape':
      handleClose();
      break;
  }
};
```

### Focus Management
```javascript
// Focus trap for modals
useEffect(() => {
  if (isOpen) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTabKey = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }
}, [isOpen]);
```

## Testing

### Component Testing Examples

#### React Testing Library
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

#### Vue Test Utils
```javascript
import { mount } from '@vue/test-utils';
import VButton from './VButton.vue';

describe('VButton', () => {
  test('renders button with text', () => {
    const wrapper = mount(VButton, {
      slots: {
        default: 'Click Me'
      }
    });

    expect(wrapper.find('button').text()).toBe('Click Me');
  });

  test('emits click event when clicked', async () => {
    const wrapper = mount(VButton);
    
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  test('does not emit click when disabled', async () => {
    const wrapper = mount(VButton, {
      props: {
        disabled: true
      }
    });
    
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
```

#### Angular Testing
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit click event', () => {
    spyOn(component.click, 'emit');
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(component.click.emit).toHaveBeenCalled();
  });

  it('should not emit click when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    spyOn(component.click, 'emit');
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(component.click.emit).not.toHaveBeenCalled();
  });
});
```