import type { EmailValidationOptions, ValidationResult, BatchValidationResult } from "./types"
import { FormatValidator } from "./validators/format-validator"
import { DNSValidator } from "./validators/dns-validator"
import { APIValidator } from "./validators/api-validator"

export class EmailValidator {
  private options: Required<EmailValidationOptions>

  constructor(options: EmailValidationOptions = {}) {
    this.options = {
      checkFormat: true,
      checkDNS: false,
      checkMX: false,
      checkDeliverability: false,
      apiProvider: "zerobounce",
      apiKey: "",
      timeout: 5000,
      ...options,
    }

    // Validate configuration
    if (this.options.checkDeliverability && !this.options.apiKey) {
      throw new Error("API key is required for deliverability checking")
    }

    if ((this.options.checkDNS || this.options.checkMX) && typeof window !== "undefined") {
      console.warn("DNS/MX validation is not supported in browser environments")
      this.options.checkDNS = false
      this.options.checkMX = false
    }
  }

  async validate(email: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      email,
      isValid: true,
      errors: [],
      warnings: [],
      details: {},
    }

    try {
      // 1. Format validation
      if (this.options.checkFormat) {
        const formatResult = FormatValidator.validate(email)
        result.details.format = formatResult

        if (!formatResult.isValid) {
          result.isValid = false
          result.errors.push(formatResult.error || "Invalid email format")
          return result // No point in continuing if format is invalid
        }
      }

      // Extract domain for DNS checks
      const domain = email.split("@")[1]

      // 2. DNS validation
      if (this.options.checkDNS || this.options.checkMX) {
        const dnsResult = await DNSValidator.validate(domain, this.options.timeout)
        result.details.dns = dnsResult

        if (!dnsResult.isValid) {
          result.isValid = false
          result.errors.push(dnsResult.error || "Domain does not exist or cannot receive emails")
        } else {
          if (this.options.checkMX && !dnsResult.hasMXRecord) {
            result.warnings.push("Domain has no MX records but may still receive emails")
          }
        }
      }

      // 3. Deliverability validation
      if (this.options.checkDeliverability && this.options.apiKey) {
        const apiValidator = new APIValidator(this.options.apiProvider, this.options.apiKey, this.options.timeout)

        const deliverabilityResult = await apiValidator.validate(email)
        result.details.deliverability = deliverabilityResult

        if (!deliverabilityResult.isValid) {
          result.isValid = false
          result.errors.push(deliverabilityResult.error || "Email is not deliverable")
        } else {
          if (deliverabilityResult.isDisposable) {
            result.warnings.push("Email appears to be from a disposable email service")
          }
          if (deliverabilityResult.isCatchAll) {
            result.warnings.push("Domain appears to be a catch-all domain")
          }
        }
      }
    } catch (error) {
      result.isValid = false
      result.errors.push(error instanceof Error ? error.message : "Validation failed")
    }

    return result
  }

  async validateBatch(emails: string[]): Promise<BatchValidationResult> {
    const results: ValidationResult[] = []
    let processed = 0
    let failed = 0

    for (const email of emails) {
      try {
        const result = await this.validate(email)
        results.push(result)
        processed++
      } catch (error) {
        results.push({
          email,
          isValid: false,
          errors: [error instanceof Error ? error.message : "Validation failed"],
          warnings: [],
          details: {},
        })
        failed++
      }
    }

    const valid = results.filter((r) => r.isValid).length
    const invalid = results.filter((r) => !r.isValid).length

    return {
      results,
      summary: {
        total: emails.length,
        valid,
        invalid,
        processed,
        failed,
      },
    }
  }

  // Convenience methods for quick validation
  static async isValid(email: string, options?: EmailValidationOptions): Promise<boolean> {
    const validator = new EmailValidator(options)
    const result = await validator.validate(email)
    return result.isValid
  }

  static validateFormat(email: string, strict = false): boolean {
    return FormatValidator.validate(email, strict).isValid
  }

  static async validateDomain(domain: string, timeout = 5000): Promise<boolean> {
    const result = await DNSValidator.validate(domain, timeout)
    return result.isValid
  }
}

// Export everything for easy importing
export * from "./types"
export { FormatValidator } from "./validators/format-validator"
export { DNSValidator } from "./validators/dns-validator"
export { APIValidator } from "./validators/api-validator"
