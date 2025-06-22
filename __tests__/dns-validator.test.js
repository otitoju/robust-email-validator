"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dns_validator_1 = require("../src/validators/dns-validator");
const dns_1 = require("dns");
// Mock the dns module
const mockDns = dns_1.promises;
describe("DNSValidator", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should validate domain with A and MX records", async () => {
        mockDns.resolve4.mockResolvedValue(["192.168.1.1"]);
        mockDns.resolveMx.mockResolvedValue([{ exchange: "mail.example.com", priority: 10 }]);
        const result = await dns_validator_1.DNSValidator.validate("example.com");
        expect(result.isValid).toBe(true);
        expect(result.hasARecord).toBe(true);
        expect(result.hasMXRecord).toBe(true);
        expect(result.mxRecords).toEqual(["mail.example.com"]);
    });
    test("should handle DNS lookup failure", async () => {
        mockDns.resolve4.mockRejectedValue(new Error("DNS lookup failed"));
        mockDns.resolveMx.mockRejectedValue(new Error("DNS lookup failed"));
        const result = await dns_validator_1.DNSValidator.validate("nonexistent.domain");
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
    });
    test("should handle timeout", async () => {
        mockDns.resolve4.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(["192.168.1.1"]), 10000)));
        mockDns.resolveMx.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve([]), 10000)));
        const result = await dns_validator_1.DNSValidator.validate("example.com", 100);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain("timeout");
    });
});
//# sourceMappingURL=dns-validator.test.js.map