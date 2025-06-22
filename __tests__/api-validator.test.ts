import { APIValidator } from "../src/validators/api-validator"

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe("APIValidator", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("ZeroBounce", () => {
    test("should validate email successfully", async () => {
      const mockResponse = {
        status: "valid",
        sub_status: "none",
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const validator = new APIValidator("zerobounce", "test-api-key")
      const result = await validator.validate("test@example.com")

      expect(result.isValid).toBe(true)
      expect(result.isDeliverable).toBe(true)
      expect(result.provider).toBe("zerobounce")
    })

    test("should handle API error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)

      const validator = new APIValidator("zerobounce", "invalid-key")
      const result = await validator.validate("test@example.com")

      expect(result.isValid).toBe(false)
      expect(result.error).toContain("ZeroBounce API error")
    })
  })

  describe("Mailgun", () => {
    test("should validate email successfully", async () => {
      const mockResponse = {
        is_valid: true,
        is_deliverable: true,
        is_disposable_address: false,
        confidence: 0.95,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const validator = new APIValidator("mailgun", "test-api-key")
      const result = await validator.validate("test@example.com")

      expect(result.isValid).toBe(true)
      expect(result.isDeliverable).toBe(true)
      expect(result.provider).toBe("mailgun")
    })
  })

  describe("Hunter", () => {
    test("should validate email successfully", async () => {
      const mockResponse = {
        data: {
          status: "valid",
          disposable: false,
          confidence: 95,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const validator = new APIValidator("hunter", "test-api-key")
      const result = await validator.validate("test@example.com")

      expect(result.isValid).toBe(true)
      expect(result.isDeliverable).toBe(true)
      expect(result.provider).toBe("hunter")
    })
  })
})
