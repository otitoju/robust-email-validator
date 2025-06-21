export interface EmailValidationOptions {
  checkFormat?: boolean
  checkDNS?: boolean
  checkMX?: boolean
  checkDeliverability?: boolean
  apiProvider?: "zerobounce" | "mailgun" | "hunter"
  apiKey?: string
  timeout?: number
}

export interface ValidationResult {
  email: string
  isValid: boolean
  errors: string[]
  warnings: string[]
  details: {
    format?: {
      isValid: boolean
      error?: string
    }
    dns?: {
      isValid: boolean
      hasARecord?: boolean
      hasMXRecord?: boolean
      mxRecords?: string[]
      error?: string
    }
    deliverability?: {
      isValid: boolean
      isDeliverable?: boolean
      isDisposable?: boolean
      isCatchAll?: boolean
      confidence?: number
      provider?: string
      error?: string
    }
  }
}

export interface BatchValidationResult {
  results: ValidationResult[]
  summary: {
    total: number
    valid: number
    invalid: number
    processed: number
    failed: number
  }
}

export interface APIResponse {
  isValid: boolean
  isDeliverable?: boolean
  isDisposable?: boolean
  isCatchAll?: boolean
  confidence?: number
  provider?: string
  error?: string
}
