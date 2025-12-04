import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest configuration for testing React components
 * Uses jsdom to simulate browser environment for component tests
 */
export default defineConfig({
    plugins: [react()],
    test: {
        // Use jsdom environment for DOM testing
        environment: 'jsdom',

        // Setup files to run before tests
        setupFiles: ['./src/test/setup.ts'],

        // Global test utilities
        globals: true,

        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                'dist/',
            ],
        },
    },
});
