# Robust Email Validator

A comprehensive, lightweight, and developer-friendly email validation library for Node.js and browser applications. This package provides multiple layers of validation including format checking, DNS verification, and deliverability testing through third-party APIs.

## Features

- 🎯 **RFC 5322 Compliant** - Accurate email format validation
- 🌐 **DNS & MX Record Verification** - Check if domains can receive emails
- 📧 **Deliverability Testing** - Integration with ZeroBounce, Mailgun, and Hunter APIs
- 🚀 **Lightweight & Fast** - Minimal dependencies, optimized performance
- 🔧 **Flexible Configuration** - Choose which validation layers to use
- 📱 **Browser Compatible** - Works in both Node.js and browser environments
- 📊 **Batch Processing** - Validate multiple emails efficiently
- 💪 **TypeScript Support** - Full type definitions included

## Installation

\`\`\`bash
npm install robust-email-validator
\`\`\`

## Quick Start

\`\`\`typescript
import { EmailValidator } from 'robust-email-validator';

// Simple format validation
const isValid = EmailValidator.validateFormat('user@example.com');
console.log(isValid); // true

// Quick validation with default options
const result = await EmailValidator.isValid('user@example.com');
console.log(result); // true

// Comprehensive validation
const validator = new EmailValidator({
  checkFormat: true,
  checkDNS: true,
  checkMX: true,
  checkDeliverability: true,
  apiProvider: 'zerobounce',
  apiKey: 'your-api-key'
});

const validationResult = await validator.validate('user@example.com');
console.log(validationResult);
\`\`\`

## Configuration Options

\`\`\`typescript
interface EmailValidationOptions {
  checkFormat?: boolean;        // Default: true
  checkDNS?: boolean;          // Default: false
  checkMX?: boolean;           // Default: false
  checkDeliverability?: boolean; // Default: false
  apiProvider?: 'zerobounce' | 'mailgun' | 'hunter';
  apiKey?: string;
  timeout?: number;            // Default: 5000ms
}
\`\`\`

## API Reference

### EmailValidator

#### Constructor
\`\`\`typescript
new EmailValidator(options?: EmailValidationOptions)
\`\`\`

#### Methods

**validate(email: string): Promise<ValidationResult>**
Validates a single email address with comprehensive checking.

**validateBatch(emails: string[]): Promise<BatchValidationResult>**
Validates multiple email addresses efficiently.

**static isValid(email: string, options?: EmailValidationOptions): Promise<boolean>**
Quick validation returning only boolean result.

**static validateFormat(email: string, strict?: boolean): boolean**
Format-only validation (synchronous).

### Validation Result

\`\`\`typescript
interface ValidationResult {
  email: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  details: {
    format?: {
      isValid: boolean;
      error?: string;
    };
    dns?: {
      isValid: boolean;
      hasARecord?: boolean;
      hasMXRecord?: boolean;
      mxRecords?: string[];
      error?: string;
    };
    deliverability?: {
      isValid: boolean;
      isDeliverable?: boolean;
      isDisposable?: boolean;
      isCatchAll?: boolean;
      confidence?: number;
      provider?: string;
      error?: string;
    };
  };
}
\`\`\`

## Usage Examples

### Basic Format Validation

\`\`\`typescript
import { EmailValidator } from 'robust-email-validator';

// Synchronous format checking
const isValid = EmailValidator.validateFormat('user@example.com');
console.log(isValid); // true

// Strict format checking
const isStrictValid = EmailValidator.validateFormat('user+tag@example.com', true);
console.log(isStrictValid); // false (strict mode doesn't allow + in local part)
\`\`\`

### DNS and MX Record Validation

\`\`\`typescript
import { EmailValidator, DNSValidator } from 'robust-email-validator';

// Check domain DNS records
const dnsResult = await DNSValidator.validate('example.com');
console.log(dnsResult);
// {
//   isValid: true,
//   hasARecord: true,
//   hasMXRecord: true,
//   mxRecords: ['mail.example.com']
// }

// Full validation with DNS checking
const validator = new EmailValidator({
  checkFormat: true,
  checkDNS: true,
  checkMX: true
});

const result = await validator.validate('user@example.com');
\`\`\`

### Third-Party API Integration

#### ZeroBounce
\`\`\`typescript
const validator = new EmailValidator({
  checkDeliverability: true,
  apiProvider: 'zerobounce',
  apiKey: 'your-zerobounce-api-key'
});

const result = await validator.validate('user@example.com');
\`\`\`

#### Mailgun
\`\`\`typescript
const validator = new EmailValidator({
  checkDeliverability: true,
  apiProvider: 'mailgun',
  apiKey: 'your-mailgun-api-key'
});
\`\`\`

#### Hunter
\`\`\`typescript
const validator = new EmailValidator({
  checkDeliverability: true,
  apiProvider: 'hunter',
  apiKey: 'your-hunter-api-key'
});
\`\`\`

### Batch Validation

\`\`\`typescript
const emails = [
  'valid@example.com',
  'invalid-email',
  'test@nonexistentdomain.com'
];

const batchResult = await validator.validateBatch(emails);
console.log(batchResult.summary);
// {
//   total: 3,
//   valid: 1,
//   invalid: 2,
//   processed: 3,
//   failed: 0
// }
\`\`\`

### Browser Usage

\`\`\`typescript
// Browser-safe configuration (no DNS checks)
const validator = new EmailValidator({
  checkFormat: true,
  checkDeliverability: true,
  apiProvider: 'mailgun',
  apiKey: 'your-api-key'
});

// Use in form validation
document.getElementById('email-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  
  const result = await validator.validate(email);
  if (result.isValid) {
    // Proceed with form submission
  } else {
    // Show validation errors
    console.log(result.errors);
  }
});
\`\`\`

## Environment Considerations

### Node.js
- Full feature support including DNS/MX validation
- All API providers supported
- Batch processing optimized for server environments

### Browser
- Format validation fully supported
- DNS/MX validation automatically disabled (not supported in browsers)
- API validation supported (subject to CORS policies)
- Recommended to use API validation for comprehensive checking

## Error Handling

The library provides detailed error information:

\`\`\`typescript
const result = await validator.validate('invalid@email');
if (!result.isValid) {
  console.log('Errors:', result.errors);
  console.log('Warnings:', result.warnings);
}
\`\`\`

Common error types:
- Format errors: "Email format is invalid"
- DNS errors: "Domain does not exist"
- API errors: "Email is not deliverable"
- Network errors: "DNS lookup timeout"

## Performance Considerations

- Format validation is synchronous and very fast
- DNS validation adds ~100-500ms per unique domain
- API validation adds ~500-2000ms per email
- Batch processing includes rate limiting for API calls
- Results can be cached to improve performance

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## License

MIT License - see LICENSE file for details.

## Support

- GitHub Issues: Report bugs and request features
- Documentation: Full API documentation available
- Examples: Check the `/examples` directory for more use cases
