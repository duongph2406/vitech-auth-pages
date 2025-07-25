# ViTech Group - Authentication System

A modern, scalable React-based authentication system with clean architecture, professional UI, and enterprise-grade features.

## 🚀 Features

### Core Features
- **Unified Auth Interface** - Single component for both Sign In and Sign Up
- **Enterprise Security** - Strong password policies and validation
- **Professional UI** - Clean, modern interface with ViTech branding
- **Responsive Design** - Works seamlessly on all devices
- **Real-time Validation** - Instant feedback with comprehensive error handling
- **Complete User Management** - Full profile, address, and payment management

### Technical Features
- **Modular Architecture** - Clean separation of concerns
- **Custom Hooks** - Reusable logic with useAuth, useForm, useAsync
- **Error Boundaries** - Graceful error handling and recovery
- **Performance Monitoring** - Built-in performance tracking (dev mode)
- **Type Safety** - TypeScript-like structure with proper validation
- **API Ready** - Prepared for backend integration with API client

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   │   ├── AuthForm.js
│   │   ├── AuthForm.css
│   │   └── index.js
│   ├── Profile/         # Profile management components
│   │   ├── AccountProfile.js
│   │   ├── AccountProfile.css
│   │   └── index.js
│   ├── Layout/          # Layout components
│   │   ├── AppLayout.js
│   │   ├── AppLayout.css
│   │   └── index.js
│   ├── UI/              # Reusable UI components
│   │   ├── Button.js
│   │   ├── LoadingSpinner.js
│   │   └── index.js
│   ├── ErrorBoundary/   # Error handling
│   │   ├── ErrorBoundary.js
│   │   ├── ErrorBoundary.css
│   │   └── index.js
│   └── index.js         # Component exports
├── hooks/               # Custom React hooks
│   ├── useApp.js        # Main app logic
│   ├── useAuth.js       # Authentication hooks
│   ├── useForm.js       # Form management
│   └── index.js
├── services/            # Business logic services
│   ├── authService.js   # Authentication logic
│   ├── dataService.js   # Data management
│   ├── performanceService.js # Performance monitoring
│   ├── notificationService.js # Notifications
│   └── index.js
├── utils/               # Utility functions
│   ├── validation.js    # Form validation
│   ├── performance.js   # Performance utilities
│   ├── clearAdminData.js
│   └── index.js
├── config/              # Configuration
│   ├── environment.js   # Environment settings
│   └── index.js
├── constants/           # Application constants
│   └── index.js
├── context/             # React context
│   └── AppContext.js
├── styles/              # Global styles
│   ├── App.css
│   └── index.css
├── assets/              # Static assets
│   └── ceo-avatar.jpg
├── App.js               # Main application component
└── index.js             # Application entry point
```

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## 💻 Usage

### Authentication
- **Sign Up**: Create a new account with email, username, and password
- **Sign In**: Login with username and password
- **Form Validation**: Real-time validation with error messages

### Profile Management
- **Personal Info**: Edit name, email, username, phone
- **Security**: Change password with current password verification
- **Addresses**: Add, edit, delete multiple addresses
- **Payment Methods**: Manage credit/debit cards

## 🔒 Security Features

- **No Default Admin**: System starts clean without default accounts
- **Admin Prevention**: Blocks creation of 'admin' username
- **Password Validation**: Strong password requirements
- **Data Isolation**: Each user's data is properly isolated

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Enhanced user experience

## 📱 Responsive Design

- **Desktop**: Full-featured layout with side panels
- **Tablet**: Adapted layout for medium screens
- **Mobile**: Stacked layout optimized for touch

## 🔧 Technical Details

- **React 18+**: Modern React with hooks
- **CSS3**: Advanced styling with animations
- **LocalStorage**: Client-side data persistence
- **ES6+**: Modern JavaScript features
- **Component Architecture**: Modular, reusable components

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The build folder will contain optimized files ready for deployment.

## 📄 License

Copyright © 2019 - 2021 by ViTech Group Company# vitech-auth-pages
# vitech-auth-pages
# vitech-auth-pages
