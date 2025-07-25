# Installation Guide

## Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/vitechgroup/vitech-auth-pages.git
cd vitech-auth-pages
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=ViTech Group
```

### 4. Start Development Server

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Production Build

```bash
npm run build
```

The build folder will contain optimized files ready for deployment.

## Deployment

### GitHub Pages

1. Build the project: `npm run build`
2. Deploy to GitHub Pages using your preferred method

### Other Platforms

The built files in the `build` folder can be deployed to any static hosting service.

## Troubleshooting

### Common Issues

1. **Port already in use**: Change port in package.json or kill the process
2. **Module not found**: Run `npm install` again
3. **Build fails**: Check for syntax errors and run `npm run lint`

### Getting Help

- Check the [GitHub Issues](https://github.com/vitechgroup/vitech-auth-pages/issues)
- Contact support at support@vitechgroup.vn