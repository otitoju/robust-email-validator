"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_validator_1 = require("../src/validators/api-validator");
// Mock fetch globally
const mockFetch = global.fetch;
describe("APIValidator", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("ZeroBounce", () => {
        test("should validate email successfully", async () => {
            const mockResponse = {
                status: "valid",
                sub_status: "none",
            };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });
            const validator = new api_validator_1.APIValidator("zerobounce", "test-api-key");
            const result = await validator.validate("test@example.com");
            expect(result.isValid).toBe(true);
            expect(result.isDeliverable).toBe(true);
            expect(result.provider).toBe("zerobounce");
        });
        test("should handle API error", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
            });
            const validator = new api_validator_1.APIValidator("zerobounce", "invalid-key");
            const result = await validator.validate("test@example.com");
            expect(result.isValid).toBe(false);
            expect(result.error).toContain("ZeroBounce API error");
        });
    });
    describe("Mailgun", () => {
        test("should validate email successfully", async () => {
            const mockResponse = {
                is_valid: true,
                is_deliverable: true,
                is_disposable_address: false,
                confidence: 0.95,
            };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });
            const validator = new api_validator_1.APIValidator("mailgun", "test-api-key");
            const result = await validator.validate("test@example.com");
            expect(result.isValid).toBe(true);
            expect(result.isDeliverable).toBe(true);
            expect(result.provider).toBe("mailgun");
        });
    });
    describe("Hunter", () => {
        test("should validate email successfully", async () => {
            const mockResponse = {
                data: {
                    status: "valid",
                    disposable: false,
                    confidence: 95,
                },
            };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });
            const validator = new api_validator_1.APIValidator("hunter", "test-api-key");
            const result = await validator.validate("test@example.com");
            expect(result.isValid).toBe(true);
            expect(result.isDeliverable).toBe(true);
            expect(result.provider).toBe("hunter");
        });
    });
});
//# sourceMappingURL=api-validator.test.js.map