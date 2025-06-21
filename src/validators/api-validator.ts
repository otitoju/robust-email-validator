import type { APIResponse } from "../types"

export class APIValidator {
  private apiKey: string
  private provider: "zerobounce" | "mailgun" | "hunter"
  private timeout: number

  constructor(provider: "zerobounce" | "mailgun" | "hunter", apiKey: string, timeout = 10000) {
    this.provider = provider
    this.apiKey = apiKey
    this.timeout = timeout
  }

  async validate(email: string): Promise<APIResponse> {
    try {
      switch (this.provider) {
        case "zerobounce":
          return await this.validateWithZeroBounce(email)
        case "mailgun":
          return await this.validateWithMailgun(email)
        case "hunter":
          return await this.validateWithHunter(email)
        default:
          throw new Error(`Unsupported API provider: ${this.provider}`)
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "API validation failed",
      }
    }
  }

  private async validateWithZeroBounce(email: string): Promise<APIResponse> {
    const url = `https://api.zerobounce.net/v2/validate?api_key=${this.apiKey}&email=${encodeURIComponent(email)}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`ZeroBounce API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        isValid: data.status === "valid",
        isDeliverable: data.status === "valid",
        isDisposable: data.sub_status === "disposable_email",
        isCatchAll: data.sub_status === "catch_all",
        confidence: this.mapZeroBounceConfidence(data.status),
        provider: "zerobounce",
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private async validateWithMailgun(email: string): Promise<APIResponse> {
    const url = `https://api.mailgun.net/v4/address/validate`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString("base64")}`,
        },
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Mailgun API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        isValid: data.is_valid,
        isDeliverable: data.is_deliverable,
        isDisposable: data.is_disposable_address,
        confidence: data.confidence,
        provider: "mailgun",
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private async validateWithHunter(email: string): Promise<APIResponse> {
    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${this.apiKey}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Hunter API error: ${response.status}`)
      }

      const data = await response.json()
      const result = data.data

      return {
        isValid: result.status === "valid",
        isDeliverable: result.status === "valid",
        isDisposable: result.disposable,
        confidence: result.confidence,
        provider: "hunter",
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private mapZeroBounceConfidence(status: string): number {
    const confidenceMap: { [key: string]: number } = {
      valid: 100,
      invalid: 0,
      "catch-all": 50,
      unknown: 25,
      spamtrap: 0,
      abuse: 0,
      do_not_mail: 0,
    }
    return confidenceMap[status] || 0
  }

  async validateBatch(emails: string[]): Promise<APIResponse[]> {
    // For batch processing, we'll validate emails sequentially to avoid rate limits
    // In production, you might want to implement proper batch API calls where supported
    const results: APIResponse[] = []

    for (const email of emails) {
      const result = await this.validate(email)
      results.push(result)

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return results
  }
}
