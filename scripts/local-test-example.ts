#!/usr/bin/env ts-node

import { EmailValidator } from "../src"

async function testLocalPackage() {
  console.log("🧪 Testing email validator package locally...\n")

  // Test 1: Format validation
  console.log("1. Testing format validation:")
  const formatTests = ["valid@example.com", "invalid-email", "test.email+tag@domain.co.uk"]

  formatTests.forEach((email) => {
    const isValid = EmailValidator.validateFormat(email)
    console.log(`   ${email}: ${isValid ? "✅" : "❌"}`)
  })

  // Test 2: Quick validation
  console.log("\n2. Testing quick validation:")
  const quickResult = await EmailValidator.isValid("test@example.com")
  console.log(`   test@example.com: ${quickResult ? "✅" : "❌"}`)

  // Test 3: Comprehensive validation (format only for local testing)
  console.log("\n3. Testing comprehensive validation:")
  const validator = new EmailValidator({
    checkFormat: true,
    checkDNS: false, // Disable for local testing
    checkMX: false, // Disable for local testing
    checkDeliverability: false, // Disable for local testing
  })

  const result = await validator.validate("user@example.com")
  console.log(`   Email: ${result.email}`)
  console.log(`   Valid: ${result.isValid ? "✅" : "❌"}`)
  console.log(`   Errors: ${result.errors.length > 0 ? result.errors.join(", ") : "None"}`)
  console.log(`   Warnings: ${result.warnings.length > 0 ? result.warnings.join(", ") : "None"}`)

  // Test 4: Batch validation
  console.log("\n4. Testing batch validation:")
  const emails = ["valid@test.com", "invalid-email", "another@example.org"]
  const batchResult = await validator.validateBatch(emails)

  console.log(`   Total: ${batchResult.summary.total}`)
  console.log(`   Valid: ${batchResult.summary.valid}`)
  console.log(`   Invalid: ${batchResult.summary.invalid}`)

  console.log("\n✅ Local testing completed successfully!")
}

// Run the test if this file is executed directly
if (require.main === module) {
  testLocalPackage().catch(console.error)
}

export { testLocalPackage }
