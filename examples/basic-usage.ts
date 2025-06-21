import { EmailValidator } from "../src"

async function basicExample() {
  // Simple format validation
  const isValidFormat = EmailValidator.validateFormat("user@example.com")
  console.log("Format valid:", isValidFormat)

  // Quick validation with default options
  const isValid = await EmailValidator.isValid("user@example.com")
  console.log("Email valid:", isValid)

  // Comprehensive validation
  const validator = new EmailValidator({
    checkFormat: true,
    checkDNS: true,
    checkMX: true,
    checkDeliverability: true,
    apiProvider: "zerobounce",
    apiKey: "your-api-key-here",
    timeout: 10000,
  })

  const result = await validator.validate("user@example.com")
  console.log("Validation result:", JSON.stringify(result, null, 2))

  // Batch validation
  const emails = ["valid@example.com", "invalid-email", "test@nonexistentdomain12345.com"]

  const batchResult = await validator.validateBatch(emails)
  console.log("Batch validation:", JSON.stringify(batchResult, null, 2))
}

basicExample().catch(console.error)
