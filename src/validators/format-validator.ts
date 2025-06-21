export class FormatValidator {
  // RFC 5322 compliant regex (simplified but comprehensive)
  private static readonly RFC5322_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  // More strict regex for common use cases
  private static readonly STRICT_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  static validate(email: string, strict = false): { isValid: boolean; error?: string } {
    if (!email || typeof email !== "string") {
      return { isValid: false, error: "Email must be a non-empty string" }
    }

    // Basic length check
    if (email.length > 254) {
      return { isValid: false, error: "Email exceeds maximum length of 254 characters" }
    }

    // Split local and domain parts
    const parts = email.split("@")
    if (parts.length !== 2) {
      return { isValid: false, error: "Email must contain exactly one @ symbol" }
    }

    const [localPart, domainPart] = parts

    // Local part validation
    if (localPart.length === 0 || localPart.length > 64) {
      return { isValid: false, error: "Local part must be between 1 and 64 characters" }
    }

    // Domain part validation
    if (domainPart.length === 0 || domainPart.length > 253) {
      return { isValid: false, error: "Domain part must be between 1 and 253 characters" }
    }

    // Check for consecutive dots
    if (email.includes("..")) {
      return { isValid: false, error: "Email cannot contain consecutive dots" }
    }

    // Check for leading/trailing dots
    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return { isValid: false, error: "Local part cannot start or end with a dot" }
    }

    // Apply regex validation
    const regex = strict ? FormatValidator.STRICT_REGEX : FormatValidator.RFC5322_REGEX
    if (!regex.test(email)) {
      return { isValid: false, error: "Email format is invalid" }
    }

    return { isValid: true }
  }

  static validateBatch(emails: string[], strict = false): Array<{ email: string; isValid: boolean; error?: string }> {
    return emails.map((email) => ({
      email,
      ...FormatValidator.validate(email, strict),
    }))
  }
}
