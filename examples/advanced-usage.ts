import { EmailValidator, DNSValidator, APIValidator } from "../src"

async function advancedExample() {
  // Custom validation workflow
  console.log("=== Advanced Email Validation Example ===\n")

  const email = "test@example.com"
  console.log(`Validating: ${email}\n`)

  // Step 1: Format validation
  console.log("1. Format Validation:")
  const formatResult = EmailValidator.validateFormat(email)
  console.log(`   Valid: ${formatResult}\n`)

  if (!formatResult) {
    console.log("Email format is invalid, stopping validation.")
    return
  }

  // Step 2: DNS validation
  console.log("2. DNS Validation:")
  const domain = email.split("@")[1]
  const dnsResult = await DNSValidator.validate(domain)
  console.log(`   Domain exists: ${dnsResult.isValid}`)
  console.log(`   Has A records: ${dnsResult.hasARecord}`)
  console.log(`   Has MX records: ${dnsResult.hasMXRecord}`)
  console.log(`   MX records: ${dnsResult.mxRecords?.join(", ") || "None"}\n`)

  // Step 3: API validation (if API key is available)
  if (process.env.ZEROBOUNCE_API_KEY) {
    console.log("3. Deliverability Validation:")
    const apiValidator = new APIValidator("zerobounce", process.env.ZEROBOUNCE_API_KEY)
    const apiResult = await apiValidator.validate(email)
    console.log(`   Deliverable: ${apiResult.isDeliverable}`)
    console.log(`   Disposable: ${apiResult.isDisposable}`)
    console.log(`   Catch-all: ${apiResult.isCatchAll}`)
    console.log(`   Confidence: ${apiResult.confidence}%\n`)
  }

  // Step 4: Comprehensive validation
  console.log("4. Comprehensive Validation:")
  const validator = new EmailValidator({
    checkFormat: true,
    checkDNS: true,
    checkMX: true,
    checkDeliverability: !!process.env.ZEROBOUNCE_API_KEY,
    apiProvider: "zerobounce",
    apiKey: process.env.ZEROBOUNCE_API_KEY,
    timeout: 10000,
  })

  const result = await validator.validate(email)
  console.log(`   Overall valid: ${result.isValid}`)
  console.log(`   Errors: ${result.errors.join(", ") || "None"}`)
  console.log(`   Warnings: ${result.warnings.join(", ") || "None"}`)
}

advancedExample().catch(console.error)
