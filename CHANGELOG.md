# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-01-25

### 🚀 Complete Architecture Refactor

#### Major Changes
- **New Library Structure**: Moved core functionality to `src/lib/` for better organization
- **Enhanced Error Handling**: Comprehensive error system with custom error types
- **Advanced Validation**: Complete validation system with custom validators
- **Storage System**: Enhanced localStorage wrapper with encryption and caching
- **API Client**: Production-ready API client with retry logic and interceptors
- **Performance Monitoring**: Advanced performance tracking with detailed metrics

#### New Features
- **Avatar Upload System**: Complete avatar management with image processing
- **Enhanced Hooks**: `useAsync`, `useForm` with advanced features
- **Type Safety**: Better type definitions and validation
- **Caching System**: Built-in caching for API requests and storage
- **Error Boundaries**: Comprehensive error handling throughout the app

## [2.0.0] - 2025-01-25

### 🎉 Major Refactor Release

#### Added
- **New Architecture**: Complete project restructure with better separation of concerns
- **Error Handling**: Centralized error handling with `errorHandler` utility
- **API Client**: Ready-to-use API client for backend integration
- **Custom Hooks**: 
  - `useLocalStorage` - Enhanced localStorage management
  - `useAsync` - Async operation handling
  - `useDebounce` - Input debouncing
  - `usePageTitle` - Dynamic page title management
- **Performance Monitor**: Development-mode performance tracking component
- **Type System**: TypeScript-like structure with proper type definitions
- **Enhanced Validation**: Improved validation with better error messages

#### Changed
- **Constants**: Restructured with `APP_CONFIG`, `VALIDATION_RULES`, `USER_ROLES`
- **Services**: Enhanced with better error handling and validation
- **Components**: Improved with better prop handling and performance
- **Styling**: More consistent and maintainable CSS structure

#### Improved
- **Code Organization**: Better folder structure and file organization
- **Error Messages**: Vietnamese localization for better UX
- **Performance**: Optimized rendering and memory usage
- **Developer Experience**: Better debugging and development tools

#### Technical Debt
- **Removed**: Duplicate validation logic
- **Consolidated**: Similar utilities into single files
- **Standardized**: Import/export patterns across the project

---

## [1.0.0] - 2025-01-24

### Initial Release

#### Features
- Basic authentication system (login/signup)
- User profile management
- Address and payment method management
- Responsive design
- Local storage persistence
- Form validation
- Professional UI with ViTech branding

#### Components
- AuthForm component for login/signup
- AccountProfile for user management
- Basic UI components (Button, LoadingSpinner)
- Layout components

#### Services
- AuthService for authentication logic
- DataService for data management
- Basic validation utilities