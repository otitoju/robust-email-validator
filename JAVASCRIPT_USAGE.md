# JavaScript Usage Guide

The `robust-email-validator` package fully supports JavaScript! Here's how to use it in different JavaScript environments.

## Installation

\`\`\`bash
npm install robust-email-validator
\`\`\`

## Basic JavaScript Usage

### CommonJS (Node.js)

\`\`\`javascript
const { EmailValidator } = require('robust-email-validator');

// Simple format validation
const isValid = EmailValidator.validateFormat('user@example.com');
console.log(isValid); // true

// Async validation
async function validateEmail() {
  const result = await EmailValidator.isValid('user@example.com');
  console.log(result); // true
}
\`\`\`

### ES Modules

\`\`\`javascript
import { EmailValidator } from 'robust-email-validator';

// Same usage as above
const isValid = EmailValidator.validateFormat('user@example.com');
\`\`\`

## Comprehensive Validation

\`\`\`javascript
const { EmailValidator } = require('robust-email-validator');

async function comprehensiveValidation() {
  const validator = new EmailValidator({
    checkFormat: true,
    checkDNS: true,
    checkMX: true,
    checkDeliverability: true,
    apiProvider: 'zerobounce',
    apiKey: 'your-api-key',
    timeout: 10000
  });

  const result = await validator.validate('user@example.com');
  
  console.log('Email:', result.email);
  console.log('Valid:', result.isValid);
  console.log('Errors:', result.errors);
  console.log('Warnings:', result.warnings);
  console.log('Details:', result.details);
}
\`\`\`

## Browser Usage

### With Module Bundlers (Webpack, Rollup, etc.)

\`\`\`javascript
import { EmailValidator } from 'robust-email-validator';

// Browser-safe configuration (no DNS checks)
const validator = new EmailValidator({
  checkFormat: true,
  checkDNS: false,        // Not supported in browsers
  checkMX: false,         // Not supported in browsers
  checkDeliverability: true, // Works with CORS-enabled APIs
  apiProvider: 'mailgun',
  apiKey: 'your-api-key'
});

async function validateInBrowser(email) {
  const result = await validator.validate(email);
  return result;
}
\`\`\`

### Direct Browser Usage

\`\`\`html
<!-- Include the library -->
<script src="path/to/robust-email-validator.js"></script>

<script>
  // Use the global EmailValidator
  const isValid = EmailValidator.validateFormat('user@example.com');
  console.log(isValid);
</script>
\`\`\`

## API Configuration Examples

### ZeroBounce

\`\`\`javascript
const validator = new EmailValidator({
  checkDeliverability: true,
  apiProvider: 'zerobounce',
  apiKey: process.env.ZEROBOUNCE_API_KEY
});
\`\`\`

### Mailgun

\`\`\`javascript
const validator = new EmailValidator({
  checkDeliverability: true,
  apiProvider: 'mailgun',
  apiKey: process.env.MAILGUN_API_KEY
});
\`\`\`

### Hunter

\`\`\`javascript
const validator = new EmailValidator({
  checkDeliverability: true,
  apiProvider: 'hunter',
  apiKey: process.env.HUNTER_API_KEY
});
\`\`\`

## Batch Validation

\`\`\`javascript
async function validateMultipleEmails() {
  const emails = [
    'valid@example.com',
    'invalid-email',
    'another@test.com'
  ];

  const validator = new EmailValidator({ checkFormat: true });
  const results = await validator.validateBatch(emails);

  console.log('Summary:', results.summary);
  console.log('Results:', results.results);
}
\`\`\`

## Error Handling

\`\`\`javascript
async function safeValidation(email) {
  try {
    const validator = new EmailValidator({
      checkFormat: true,
      timeout: 5000
    });
    
    const result = await validator.validate(email);
    return result;
  } catch (error) {
    console.error('Validation error:', error.message);
    return {
      email,
      isValid: false,
      errors: [error.message],
      warnings: [],
      details: {}
    };
  }
}
\`\`\`

## Environment Detection

\`\`\`javascript
// Automatically configure based on environment
function createSmartValidator(options = {}) {
  const isBrowser = typeof window !== 'undefined';
  
  const defaultConfig = {
    checkFormat: true,
    checkDNS: !isBrowser,  // Only in Node.js
    checkMX: !isBrowser,   // Only in Node.js
    checkDeliverability: false,
    timeout: 5000
  };

  return new EmailValidator({ ...defaultConfig, ...options });
}

// Usage
const validator = createSmartValidator({
  checkDeliverability: true,
  apiKey: 'your-api-key'
});
\`\`\`

## TypeScript Support

Even when using JavaScript, you get full IntelliSense and type checking if your editor supports it:

\`\`\`javascript
// Your editor will provide autocomplete and type hints
const validator = new EmailValidator({
  checkFormat: true,
  // Your editor will suggest available options
});

// Result object has known structure
const result = await validator.validate('test@example.com');
// result.isValid, result.errors, etc. are all typed
\`\`\`

## Performance Tips

1. **Reuse validator instances** for better performance
2. **Use format-only validation** for real-time input validation
3. **Enable DNS/API checks** only when necessary
4. **Set appropriate timeouts** for your use case

\`\`\`javascript
// Good: Reuse validator
const validator = new EmailValidator({ checkFormat: true });

async function validateMany(emails) {
  const results = [];
  for (const email of emails) {
    results.push(await validator.validate(email));
  }
  return results;
}

// Better: Use batch validation
async function validateManyBetter(emails) {
  return await validator.validateBatch(emails);
}
