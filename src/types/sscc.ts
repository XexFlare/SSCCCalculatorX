export interface SSCCComponents {
  extensionDigit: string
  companyPrefix: string
  serialReference: string
  checkDigit: string
  /** Full 18-digit SSCC. */
  sscc: string
}

export type BuildSSCCResult =
  | { ok: true; components: SSCCComponents }
  | { ok: false; error: string }

export interface ValidationResult {
  valid: boolean
  /** Cleaned (digits-only) input that was validated. */
  sscc: string
  reason?: string
  expectedCheckDigit?: string
  receivedCheckDigit?: string
  extensionDigit?: string
  /** The 16 digits between the extension digit and the check digit. Its
   * company-prefix / serial-reference split can't be recovered without a
   * GS1 prefix registry lookup, so it's exposed as a single block. */
  bodyDigits?: string
}

export type RecentEntryType = 'generated' | 'validated' | 'batch'

export interface RecentEntry {
  id: string
  type: RecentEntryType
  sscc: string
  valid?: boolean
  createdAt: number
}

export interface GenerateFormValues {
  extensionDigit: string
  companyPrefix: string
  serialReference: string
}
