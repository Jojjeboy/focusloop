# Contributing to FocusLoop

Thank you for contributing to FocusLoop! This guide will help you maintain code quality and consistency.

## 📋 Code Quality Standards

All code must meet these standards before being committed:

### 1. Code Formatting
- Use Prettier for consistent code formatting
- Single quotes for strings
- 2-space indentation
- Semi-colons required
- 100 character line length

**Check formatting:**
```bash
npm run format:check
```

**Auto-format code:**
```bash
npm run format
```

### 2. Linting
- Zero ESLint errors allowed
- Zero ESLint warnings allowed
- Follow TypeScript strict mode rules

**Run linter:**
```bash
npm run lint
```

### 3. Testing
- All existing tests must pass
- New features require tests
- Aim for high test coverage
- Write meaningful test descriptions

**Run tests:**
```bash
npm test
```

### 4. Build Verification
- Code must build without errors
- TypeScript compilation must succeed
- No type errors allowed

**Verify build:**
```bash
npm run build
```

---

## 🚀 Pre-Commit Checklist

**Before every commit, run:**

```bash
npm run precommit
```

This single command runs all quality checks:
1. ✅ Formatting check
2. ✅ Linting
3. ✅ All tests
4. ✅ Build verification

**All checks must pass** before committing code.

---

## 📝 Writing Tests

### Test Requirements

Every new feature must include:
- **Unit tests** for business logic
- **Component tests** for UI components
- **Integration tests** for complex interactions

### Test Structure

Place tests in `__tests__` directories next to the code:

```
src/
└── features/
    └── myFeature/
        ├── MyComponent.tsx
        └── __tests__/
            └── MyComponent.test.tsx
```

### Test Examples

**Component Test:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Unit Test:**
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction(5)).toBe(10);
  });
});
```

---

## 💻 Code Guidelines

### TypeScript

- **Always use TypeScript types** - No `any` types unless absolutely necessary
- **Define interfaces** for all props and complex data structures
- **Use enums** for fixed sets of values
- **Export types** that might be reused

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// ❌ Bad
function Button(props: any) { ... }
```

### React Components

- **Use functional components** with hooks
- **Keep components small** - Single Responsibility Principle
- **Extract reusable logic** into custom hooks
- **Use descriptive prop names**

```typescript
// ✅ Good - Small, focused component
export const TimerButton: React.FC<TimerButtonProps> = ({ onClick, label }) => {
  return <Button onClick={onClick}>{label}</Button>;
};

// ❌ Bad - Too much logic in component
export const Timer = () => {
  // 200 lines of complex logic...
};
```

### Naming Conventions

- **Components:** PascalCase (`TimerControls.tsx`)
- **Files:** PascalCase for components, camelCase for utilities
- **Functions:** camelCase (`formatTime`, `startTimer`)
- **Constants:** UPPER_SNAKE_CASE (`DEFAULT_DURATION`)
- **Interfaces:** PascalCase with descriptive names (`TimerConfiguration`)

### Code Comments

**Good comments explain WHY, not WHAT:**

```typescript
// ✅ Good - Explains reasoning
// Using Map for O(1) lookup performance with large datasets
const timers = new Map<string, Timer>();

// ❌ Bad - Obvious from code
// Create a new Map for timers
const timers = new Map<string, Timer>();
```

**Document complex functions:**

```typescript
/**
 * Calculates remaining time considering pauses and resets
 * 
 * @param startTime - Unix timestamp when timer started
 * @param pausedDuration - Total time timer was paused (in seconds)
 * @param totalDuration - Total configured duration (in seconds)
 * @returns Remaining time in seconds
 */
function calculateRemainingTime(
  startTime: number,
  pausedDuration: number,
  totalDuration: number
): number {
  // Implementation...
}
```

---

## 🎯 Code Readability for Junior Developers

Our code should be easy to understand for developers at all levels.

### Clear Variable Names

```typescript
// ✅ Good
const totalElapsedTimeInSeconds = 150;
const isTimerRunning = timer.status === 'RUNNING';

// ❌ Bad
const t = 150;
const flag = timer.status === 'RUNNING';
```

### Avoid Clever Code

```typescript
// ✅ Good - Clear and readable
function isEven(num: number): boolean {
  return num % 2 === 0;
}

// ❌ Bad - Too clever
const isEven = (n: number) => !(n & 1);
```

### Break Down Complex Logic

```typescript
// ✅ Good - Broken into steps
function processTimer(timer: Timer): Timer {
  const hasCompleted = checkIfCompleted(timer);
  if (hasCompleted) {
    return completeTimer(timer);
  }
  
  const nextSegment = calculateNextSegment(timer);
  return updateTimer(timer, nextSegment);
}

// ❌ Bad - Everything in one function
function processTimer(timer: Timer): Timer {
  // 50 lines of complex logic...
}
```

---

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Follow code guidelines above
   - Add tests for new functionality
   - Update documentation if needed

3. **Run quality checks**
   ```bash
   npm run precommit
   ```
   **All checks must pass before continuing!**

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add timer pause functionality"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/my-new-feature
   ```

6. **Create Pull Request**
   - Provide clear description
   - Reference any related issues
   - Wait for CI checks to pass
   - Request review from maintainers

7. **Address Review Feedback**
   - Make requested changes
   - Run `npm run precommit` again
   - Push updates

8. **Merge**
   - Maintainer will merge when approved
   - Branch will be deleted automatically

---

## 🐛 Bug Reports

When reporting bugs, include:

- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs **actual behavior**
- **Environment details** (browser, OS, etc.)
- **Screenshots** if applicable
- **Error messages** from console

---

## ✨ Feature Requests

When requesting features:

- **Describe the problem** you're trying to solve
- **Explain your proposed solution**
- **Consider alternatives** you've thought about
- **Explain impact** on existing functionality

---

## 🏗️ Project Structure Guidelines

### Where to Put New Code

- **Business Logic** → `src/core/services/`
- **Data Models** → `src/core/models/`
- **React Contexts** → `src/core/context/`
- **New Features** → `src/features/myFeature/`
- **Reusable UI** → `src/shared/components/`
- **Utilities** → `src/shared/utils/`

### Feature Module Structure

```
src/features/myFeature/
├── components/           # Feature-specific components
│   ├── Component.tsx
│   └── __tests__/
│       └── Component.test.tsx
├── pages/               # Feature pages
│   └── MyFeaturePage.tsx
└── index.ts            # Public exports
```

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Components](https://mui.com/material-ui/getting-started/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

---

## ❓ Questions?

If you have questions about contributing:
1. Check this guide first
2. Look at existing code for examples
3. [Open an issue](https://github.com/Jojjeboy/focusloop/issues) for clarification

---

**Thank you for helping make FocusLoop better! 🎉**
