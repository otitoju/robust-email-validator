import { promises as dns } from "dns"

export class DNSValidator {
  static async validate(
    domain: string,
    timeout = 5000,
  ): Promise<{
    isValid: boolean
    hasARecord?: boolean
    hasMXRecord?: boolean
    mxRecords?: string[]
    error?: string
  }> {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("DNS lookup timeout")), timeout)
      })

      // Check A records
      const aRecordPromise = dns.resolve4(domain).catch(() => [])

      // Check MX records
      const mxRecordPromise = dns.resolveMx(domain).catch(() => [])

      // Race against timeout
      const [aRecords, mxRecords] = (await Promise.race([
        Promise.all([aRecordPromise, mxRecordPromise]),
        timeoutPromise,
      ])) as [string[], Array<{ exchange: string; priority: number }>]

      const hasARecord = aRecords.length > 0
      const hasMXRecord = mxRecords.length > 0
      const mxExchanges = mxRecords.map((record) => record.exchange)

      return {
        isValid: hasARecord || hasMXRecord,
        hasARecord,
        hasMXRecord,
        mxRecords: mxExchanges,
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "DNS validation failed",
      }
    }
  }

  static async validateBatch(
    domains: string[],
    timeout = 5000,
  ): Promise<
    Array<{
      domain: string
      isValid: boolean
      hasARecord?: boolean
      hasMXRecord?: boolean
      mxRecords?: string[]
      error?: string
    }>
  > {
    const promises = domains.map(async (domain) => ({
      domain,
      ...(await DNSValidator.validate(domain, timeout)),
    }))

    return Promise.all(promises)
  }
}
