"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Test setup file
const globals_1 = require("@jest/globals");
// Mock fetch for API tests with proper typing
global.fetch = globals_1.jest.fn();
// Mock DNS module for Node.js specific tests
globals_1.jest.mock("dns", () => ({
    promises: {
        resolve4: globals_1.jest.fn(),
        resolveMx: globals_1.jest.fn(),
    },
}));
// Setup test timeout
globals_1.jest.setTimeout(10000);
// Add global types for testing environment
// (Removed duplicate and circular global fetch declaration)
//# sourceMappingURL=setup.js.map