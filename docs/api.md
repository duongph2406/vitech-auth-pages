# API Reference

## Authentication Service

### authService.login(username, password)

Authenticates a user with username and password.

**Parameters:**
- `username` (string) - User's username
- `password` (string) - User's password

**Returns:**
```javascript
{
  success: boolean,
  user?: User,
  message?: string
}
```

**Example:**
```javascript
const result = authService.login('john_doe', 'password123');
if (result.success) {
  console.log('Logged in:', result.user);
} else {
  console.error('Login failed:', result.message);
}
```

### authService.register(userData)

Registers a new user account.

**Parameters:**
- `userData` (object) - User registration data
  - `firstName` (string) - User's first name
  - `lastName` (string) - User's last name
  - `email` (string) - User's email address
  - `username` (string) - Desired username
  - `password` (string) - User's password

**Returns:**
```javascript
{
  success: boolean,
  user?: User,
  message?: string
}
```

### authService.logout()

Logs out the current user.

**Returns:**
```javascript
{
  success: boolean
}
```

### authService.getCurrentUser()

Gets the currently logged-in user.

**Returns:**
```javascript
User | null
```

### authService.updateProfile(profileData)

Updates user profile information.

**Parameters:**
- `profileData` (object) - Profile data to update

**Returns:**
```javascript
{
  success: boolean,
  user?: User,
  message?: string
}
```

### authService.changePassword(currentPassword, newPassword)

Changes user's password.

**Parameters:**
- `currentPassword` (string) - Current password
- `newPassword` (string) - New password

**Returns:**
```javascript
{
  success: boolean,
  message?: string
}
```

## Data Service

### dataService.createUser(userData)

Creates a new user in the system.

### dataService.getUserByUsername(username)

Retrieves user by username.

### dataService.getUserByEmail(email)

Retrieves user by email address.

### dataService.updateUser(userId, userData)

Updates user data.

### dataService.addAddress(userId, addressData)

Adds a new address for the user.

### dataService.updateAddress(userId, addressId, addressData)

Updates an existing address.

### dataService.deleteAddress(userId, addressId)

Deletes an address.

### dataService.addPaymentMethod(userId, paymentData)

Adds a new payment method.

### dataService.updatePaymentMethod(userId, paymentId, paymentData)

Updates a payment method.

### dataService.deletePaymentMethod(userId, paymentId)

Deletes a payment method.

## Validation Utilities

### validateEmail(email)

Validates email format.

**Returns:** Error message or empty string

### validatePassword(password)

Validates password strength.

**Returns:** Error message or empty string

### validateUsername(username)

Validates username format and availability.

**Returns:** Error message or empty string

### validatePhone(phone)

Validates Vietnamese phone number format.

**Returns:** Error message or empty string

### validateForm(formData, schema)

Validates entire form against schema.

**Returns:**
```javascript
{
  isValid: boolean,
  errors: object
}
```

## Error Handling

### errorHandler.handleError(error)

Centralized error handling.

**Returns:**
```javascript
{
  message: string,
  code: string,
  statusCode: number
}
```

### errorHandler.createValidationError(message)

Creates a validation error.

### errorHandler.createAuthError(message)

Creates an authentication error.

### errorHandler.createNetworkError(message)

Creates a network error.

## API Client (Future Backend Integration)

### apiClient.get(endpoint, params)

Makes GET request to API.

### apiClient.post(endpoint, data)

Makes POST request to API.

### apiClient.put(endpoint, data)

Makes PUT request to API.

### apiClient.delete(endpoint)

Makes DELETE request to API.

## Constants

### PAGES

Available page constants:
- `PAGES.LOGIN`
- `PAGES.SIGNUP`
- `PAGES.PROFILE`
- `PAGES.DASHBOARD`
- `PAGES.SETTINGS`

### VALIDATION_RULES

Validation rule constants:
- `VALIDATION_RULES.PASSWORD`
- `VALIDATION_RULES.USERNAME`
- `VALIDATION_RULES.EMAIL`
- `VALIDATION_RULES.PHONE`

### MESSAGES

User-facing message constants for consistent messaging across the app.