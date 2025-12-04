# FocusLoop

> A powerful productivity timer application featuring customizable timer combinations for focused work sessions, built with React and Material-UI.

**Live Demo:** [https://jojjeboy.github.io/focusloop/](https://jojjeboy.github.io/focusloop/)

## 📖 Overview

FocusLoop is a Progressive Web App (PWA) designed to help you stay productive using customizable timer combinations. Create custom focus/break cycles, track your progress, and maintain your productivity flow with an intuitive, beautiful interface.

### Key Features

- **Customizable Timer Combinations** - Create complex timer sequences with multiple segments
- **Pomodoro Presets** - Pre-configured Pomodoro techniques ready to use
- **Dark Mode** - Automatic and manual dark mode support
- **Progressive Web App** - Install on any device and use offline
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **State Persistence** - Your timers are saved locally and persist across sessions

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jojjeboy/focusloop.git
   cd focusloop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 💻 Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle (runs TypeScript check + Vite build) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check for code quality issues |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode for development |
| `npm run test:ui` | Open Vitest UI for interactive testing |
| `npm run test:coverage` | Generate test coverage report |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code follows Prettier formatting |
| `npm run precommit` | Run all quality checks (format, lint, test, build) |

### Before Committing Code

**Always run the pre-commit check** to ensure code quality:

```bash
npm run precommit
```

This command will:
1. ✅ Check code formatting with Prettier
2. ✅ Run ESLint to catch code quality issues
3. ✅ Run all tests to ensure no regressions
4. ✅ Build the application to verify it compiles successfully

> **Important:** All these checks must pass before committing code. The CI/CD pipeline will also run these checks on every push.

---

## 🧪 Testing

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Open Vitest UI for interactive testing
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are located alongside the files they test in `__tests__` directories:

```
src/
├── core/
│   ├── services/
│   │   ├── TimerService.ts
│   │   └── __tests__/
│   │       └── TimerService.test.ts
│   └── context/
│       └── __tests__/
└── features/
    └── timers/
        └── components/
            ├── TimerControls.tsx
            └── __tests__/
                └── TimerControls.test.tsx
```

### Writing Tests

- **Unit Tests** - Test individual functions and services in isolation
- **Component Tests** - Test React components using React Testing Library
- **Integration Tests** - Test contexts and complex interactions

For examples, see:
- [`src/core/services/__tests__/TimerService.test.ts`](src/core/services/__tests__/TimerService.test.ts) - Unit test example
- [`src/features/timers/components/__tests__/TimerControls.test.tsx`](src/features/timers/components/__tests__/TimerControls.test.tsx) - Component test example

---

## 🏗️ Project Structure

```
focusloop/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── public/                     # Static assets
├── src/
│   ├── core/                   # Core business logic
│   │   ├── context/           # React contexts
│   │   ├── hooks/             # Custom React hooks
│   │   ├── models/            # TypeScript interfaces and types
│   │   └── services/          # Business logic services
│   ├── features/              # Feature modules
│   │   ├── home/             # Home page feature
│   │   ├── settings/         # Settings feature
│   │   └── timers/           # Timer feature
│   │       ├── components/   # Timer UI components
│   │       └── pages/        # Timer pages
│   ├── shared/               # Shared components and utilities
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Shared hooks
│   │   └── utils/           # Utility functions
│   ├── test/                # Test configuration
│   │   └── setup.ts        # Test setup file
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── vitest.config.ts        # Vitest configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

### Architecture Overview

- **Core** - Contains business logic independent of UI
- **Features** - Self-contained feature modules
- **Shared** - Reusable components and utilities used across features
- **Test** - Testing configuration and setup

---

## 🛠️ Technology Stack

### Core Technologies
- **[React](https://react.dev/)** 18.2 - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** 5.2 - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** 5.0 - Fast build tool and dev server

### UI Framework
- **[Material-UI](https://mui.com/)** 5.14 - React component library
- **[Emotion](https://emotion.sh/)** - CSS-in-JS styling
- **[Material Icons](https://mui.com/material-ui/material-icons/)** - Icon library

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** 3.3 - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** - CSS transformations
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Automatic vendor prefixing

### PWA
- **[Vite PWA Plugin](https://vite-pwa-org.netlify.app/)** - Progressive Web App support
- **[Workbox](https://developer.chrome.com/docs/workbox/)** - Service worker libraries

### Testing
- **[Vitest](https://vitest.dev/)** 4.0 - Fast unit test framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM implementation for testing

### Code Quality
- **[ESLint](https://eslint.org/)** - Linting for code quality
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 🚢 Build & Deployment

### Building for Production

```bash
npm run build
```

This will:
1. Run TypeScript compiler to check for type errors
2. Build the production bundle with Vite
3. Output optimized files to the `dist/` directory

### Deployment

The application is automatically deployed to GitHub Pages when code is pushed to the `main` branch.

**CI/CD Pipeline** (`.github/workflows/deploy.yml`):
1. Checkout code
2. Install dependencies
3. **Run linter** (code quality check)
4. **Run tests** (ensure no regressions)
5. Build production bundle
6. Deploy to GitHub Pages

> **Note:** Deployments will fail if linting or tests fail, ensuring only quality code is deployed.

### Manual Deployment

If you need to deploy manually:

```bash
# Build the production bundle
npm run build

# The dist/ folder can be deployed to any static hosting service
```

---

## ♿ Accessibility

FocusLoop is built with accessibility in mind:

- **Semantic HTML** - Proper use of semantic elements
- **ARIA Labels** - Screen reader support via tooltips and labels
- **Keyboard Navigation** - Full keyboard support for all controls
- **Color Contrast** - WCAG AA compliant color contrast ratios
- **Responsive Text** - Scalable text that works with browser zoom

### Future Lighthouse Integration

We plan to integrate Lighthouse CI to automatically measure and enforce:
- Performance scores
- Accessibility scores (target: 95+)
- Best practices
- SEO scores

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Checklist

- [ ] Code follows Prettier formatting (`npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] All tests pass (`npm test`)
- [ ] Application builds successfully (`npm run build`)
- [ ] New features include tests
- [ ] Code is readable and well-commented for junior developers

---

## 📝 License

This project is private and proprietary.

---

## 👨‍💻 Development Guidelines

### Code Style

- **Always use TypeScript** - No plain JavaScript files
- **Use functional components** - Prefer hooks over class components
- **Keep components small** - Single Responsibility Principle
- **Write semantic code** - Readable by junior developers
- **Document complex logic** - Add comments explaining "why", not "what"

### Commit Messages

Use clear, descriptive commit messages:

```
✅ Good: "Add timer controls component tests"
❌ Bad: "fix stuff"

✅ Good: "Refactor TimerService to use Map for better performance"
❌ Bad: "updates"
```

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run precommit` to verify quality
4. Push and create a Pull Request
5. Wait for CI checks to pass
6. Request review from maintainers

---

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tests failing locally**
```bash
# Ensure you're using the correct Node version
node --version  # Should be 18.x or later

# Clear Vitest cache
npm test -- --clearCache
```

**Build errors**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Verify all dependencies are installed
npm install
```

---

## 📧 Support

For questions or issues, please [open an issue](https://github.com/Jojjeboy/focusloop/issues) on GitHub.

---

**Built with ❤️ for enhanced productivity**
