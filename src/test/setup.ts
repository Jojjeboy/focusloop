import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

/**
 * Test setup file
 * Configures the testing environment and adds custom matchers
 */

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});
