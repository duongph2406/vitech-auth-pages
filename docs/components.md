# Component Documentation

## Core Components

### AuthForm

The main authentication component that handles both login and signup.

**Props:**
- `mode` - 'login' or 'signup'
- `onSubmit` - Function called on form submission
- `onSwitchMode` - Function to switch between login/signup
- `error` - Error message to display
- `formData` - Form data object
- `setFormData` - Function to update form data
- `isLoading` - Loading state

**Usage:**
```jsx
<AuthForm
  mode="login"
  onSubmit={handleLogin}
  onSwitchMode={switchToSignUp}
  error={authError}
  formData={formData}
  setFormData={setFormData}
  isLoading={isLoading}
/>
```

### AccountProfile

User profile management component with tabs for different sections.

**Props:**
- `onLogout` - Function called when user logs out

**Features:**
- Personal information editing
- Password change
- Address management
- Payment method management

### PerformanceMonitor

Development-only component for monitoring app performance.

**Features:**
- Render time tracking
- Memory usage monitoring
- DOM node counting
- Only visible in development mode

## UI Components

### Button

Reusable button component with different variants.

**Props:**
- `variant` - 'primary', 'secondary', 'danger'
- `size` - 'small', 'medium', 'large'
- `disabled` - Boolean
- `loading` - Boolean
- `onClick` - Click handler

### LoadingSpinner

Loading indicator component.

**Props:**
- `size` - 'small', 'medium', 'large'
- `color` - Spinner color

### Modal

Modal dialog component.

**Props:**
- `isOpen` - Boolean to control visibility
- `onClose` - Function called when modal closes
- `title` - Modal title
- `size` - 'small', 'medium', 'large'

## Layout Components

### AppLayout

Main application layout wrapper.

**Props:**
- `className` - Additional CSS classes
- `children` - Child components

## Form Components

### FormField

Reusable form field with label and validation.

**Props:**
- `label` - Field label
- `error` - Error message
- `required` - Boolean
- `children` - Input component

### Input

Enhanced input component with validation.

**Props:**
- `type` - Input type
- `value` - Input value
- `onChange` - Change handler
- `error` - Error state
- `placeholder` - Placeholder text

## Custom Hooks

### useAuth

Authentication hook with login/logout functionality.

```jsx
const { user, login, logout, isLoading } = useAuth();
```

### useForm

Form management hook with validation.

```jsx
const { formData, errors, handleChange, handleSubmit } = useForm(schema);
```

### usePageTitle

Dynamic page title management.

```jsx
usePageTitle('Login Page');
```

### useLocalStorage

Enhanced localStorage management.

```jsx
const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
```

## Error Handling

### ErrorBoundary

React error boundary component for graceful error handling.

**Features:**
- Catches JavaScript errors
- Displays fallback UI
- Logs errors for debugging

## Best Practices

1. **Component Structure**: Keep components small and focused
2. **Props Validation**: Use PropTypes or TypeScript
3. **Error Handling**: Always handle errors gracefully
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Include proper ARIA attributes