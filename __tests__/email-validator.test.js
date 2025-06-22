"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_validator_1 = require("../src/email-validator");
// Mock the DNS validator for testing
jest.mock("../src/validators/dns-validator", () => ({
    DNSValidator: {
        validate: jest.fn().mockResolvedValue({
            isValid: true,
            hasARecord: true,
            hasMXRecord: true,
            mxRecords: ["mail.example.com"],
        }),
    },
}));
// Mock the API validator for testing
jest.mock("../src/validators/api-validator", () => ({
    APIValidator: jest.fn().mockImplementation(() => ({
        validate: jest.fn().mockResolvedValue({
            isValid: true,
            isDeliverable: true,
            isDisposable: false,
            isCatchAll: false,
            confidence: 95,
            provider: "test",
        }),
    })),
}));
describe("EmailValidator", () => {
    describe("constructor", () => {
        test("should create validator with default options", () => {
            const validator = new email_validator_1.EmailValidator();
            expect(validator).toBeInstanceOf(email_validator_1.EmailValidator);
        });
        test("should throw error if deliverability check enabled without API key", () => {
            expect(() => {
                new email_validator_1.EmailValidator({
                    checkDeliverability: true,
                    apiKey: "",
                });
            }).toThrow("API key is required for deliverability checking");
        });
    });
    describe("validate", () => {
        test("should validate email with format checking only", async () => {
            const validator = new email_validator_1.EmailValidator({ checkFormat: true });
            const result = await validator.validate("test@example.com");
            expect(result.isValid).toBe(true);
            expect(result.email).toBe("test@example.com");
            expect(result.errors).toHaveLength(0);
            expect(result.details.format).toBeDefined();
        });
        test("should return invalid for malformed email", async () => {
            const validator = new email_validator_1.EmailValidator({ checkFormat: true });
            const result = await validator.validate("invalid-email");
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
        test("should validate with DNS checking", async () => {
            const validator = new email_validator_1.EmailValidator({
                checkFormat: true,
                checkDNS: true,
            });
            const result = await validator.validate("test@example.com");
            expect(result.isValid).toBe(true);
            expect(result.details.dns).toBeDefined();
        });
    });
    describe("validateBatch", () => {
        test("should validate multiple emails", async () => {
            const validator = new email_validator_1.EmailValidator({ checkFormat: true });
            const emails = ["valid@example.com", "invalid-email", "another@test.com"];
            const result = await validator.validateBatch(emails);
            expect(result.results).toHaveLength(3);
            expect(result.summary.total).toBe(3);
            expect(result.summary.valid).toBeGreaterThan(0);
            expect(result.summary.invalid).toBeGreaterThan(0);
        });
    });
    describe("static methods", () => {
        test("validateFormat should work", () => {
            expect(email_validator_1.EmailValidator.validateFormat("test@example.com")).toBe(true);
            expect(email_validator_1.EmailValidator.validateFormat("invalid-email")).toBe(false);
        });
        test("isValid should work", async () => {
            const result = await email_validator_1.EmailValidator.isValid("test@example.com");
            expect(typeof result).toBe("boolean");
        });
    });
});
//# sourceMappingURL=email-validator.test.js.map