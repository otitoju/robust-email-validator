// Main entry point
export { EmailValidator } from "./email-validator"
export * from "./types"
export { FormatValidator } from "./validators/format-validator"
export { DNSValidator } from "./validators/dns-validator"
export { APIValidator } from "./validators/api-validator"

// Default export for convenience
import { EmailValidator } from "./email-validator"
export default EmailValidator
