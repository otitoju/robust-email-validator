import { FormatValidator } from "../src/validators/format-validator"

describe("FormatValidator", () => {
  describe("validate", () => {
    test("should validate correct email formats", () => {
      const validEmails = [
        "user@example.com",
        "test.email@example.com",
        "user+tag@example.com",
        "user123@example-domain.com",
        "a@b.co",
      ]

      validEmails.forEach((email) => {
        const result = FormatValidator.validate(email)
        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })

    test("should reject invalid email formats", () => {
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "user@",
        "user..double@example.com",
        ".user@example.com",
        "user.@example.com",
        "user@example.",
        "user@.example.com",
      ]

      invalidEmails.forEach((email) => {
        const result = FormatValidator.validate(email)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      })
    })

    test("should handle edge cases", () => {
      expect(FormatValidator.validate("").isValid).toBe(false)
      expect(FormatValidator.validate("a".repeat(255) + "@example.com").isValid).toBe(false)
      expect(FormatValidator.validate("user@" + "a".repeat(254) + ".com").isValid).toBe(false)
    })

    test("should support strict mode", () => {
      const email = "user+tag@example.com"
      expect(FormatValidator.validate(email, false).isValid).toBe(true)
      expect(FormatValidator.validate(email, true).isValid).toBe(true)
    })
  })

  describe("validateBatch", () => {
    test("should validate multiple emails", () => {
      const emails = ["valid@example.com", "invalid-email", "another@test.com"]
      const results = FormatValidator.validateBatch(emails)

      expect(results).toHaveLength(3)
      expect(results[0].isValid).toBe(true)
      expect(results[1].isValid).toBe(false)
      expect(results[2].isValid).toBe(true)
    })
  })
})
