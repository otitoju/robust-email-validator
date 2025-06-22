// Test setup file
import { jest } from "@jest/globals"

// Mock fetch for API tests with proper typing
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

// Mock DNS module for Node.js specific tests
jest.mock("dns", () => ({
  promises: {
    resolve4: jest.fn(),
    resolveMx: jest.fn(),
  },
}))

// Setup test timeout
jest.setTimeout(10000)

// Add global types for testing environment
// (Removed duplicate and circular global fetch declaration)
