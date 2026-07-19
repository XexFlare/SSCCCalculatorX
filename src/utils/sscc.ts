import type { BuildSSCCResult, SSCCComponents, ValidationResult } from '@/types/sscc'

/** GS1 Application Identifier for the SSCC. */
export const SSCC_APPLICATION_IDENTIFIER = '00'

export const TOTAL_LENGTH = 18
const PRE_CHECK_LENGTH = 17

export const MIN_COMPANY_PREFIX_LENGTH = 6
export const MAX_COMPANY_PREFIX_LENGTH = 10

const DIGITS_ONLY = /^\d+$/

/**
 * GS1 Mod-10 check digit algorithm (used for SSCC, GTIN, GLN, etc.).
 * Each digit is multiplied alternately by 3 and 1, starting with a weight
 * of 3 on the rightmost digit; the check digit is whatever brings the sum
 * up to the next multiple of 10.
 */
export function calculateCheckDigit(digits: string): number {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[digits.length - 1 - i])
    sum += digit * (i % 2 === 0 ? 3 : 1)
  }
  const remainder = sum % 10
  return remainder === 0 ? 0 : 10 - remainder
}

export function maxSerialReferenceLength(companyPrefixLength: number): number {
  return PRE_CHECK_LENGTH - 1 - companyPrefixLength
}

/**
 * Assembles an SSCC-18 from its logical components, padding the serial
 * reference with leading zeros to fill the space left by the company
 * prefix, then appends the computed Mod-10 check digit.
 */
export function buildSSCC(
  extensionDigit: string,
  companyPrefix: string,
  serialReference: string
): BuildSSCCResult {
  if (!DIGITS_ONLY.test(extensionDigit) || extensionDigit.length !== 1) {
    return { ok: false, error: 'Extension digit must be a single digit (0-9).' }
  }
  if (!DIGITS_ONLY.test(companyPrefix)) {
    return { ok: false, error: 'Company prefix must contain digits only.' }
  }
  if (
    companyPrefix.length < MIN_COMPANY_PREFIX_LENGTH ||
    companyPrefix.length > MAX_COMPANY_PREFIX_LENGTH
  ) {
    return {
      ok: false,
      error: `Company prefix must be ${MIN_COMPANY_PREFIX_LENGTH}-${MAX_COMPANY_PREFIX_LENGTH} digits long.`,
    }
  }
  if (!DIGITS_ONLY.test(serialReference)) {
    return { ok: false, error: 'Serial reference must contain digits only.' }
  }

  const maxSerialLength = maxSerialReferenceLength(companyPrefix.length)
  if (serialReference.length > maxSerialLength) {
    return {
      ok: false,
      error: `Serial reference is too long. With a ${companyPrefix.length}-digit company prefix, it can be at most ${maxSerialLength} digits.`,
    }
  }

  const paddedSerial = serialReference.padStart(maxSerialLength, '0')
  const base = `${extensionDigit}${companyPrefix}${paddedSerial}`
  const checkDigit = calculateCheckDigit(base)
  const sscc = `${base}${checkDigit}`

  const components: SSCCComponents = {
    extensionDigit,
    companyPrefix,
    serialReference: paddedSerial,
    checkDigit: String(checkDigit),
    sscc,
  }
  return { ok: true, components }
}

/** Validates an SSCC-18 string, recomputing and comparing its check digit. */
export function validateSSCC(input: string): ValidationResult {
  const cleaned = input.replace(/[\s-]/g, '')

  if (cleaned.length === 0) {
    return { valid: false, sscc: cleaned, reason: 'Enter an SSCC to validate.' }
  }
  if (!DIGITS_ONLY.test(cleaned)) {
    return { valid: false, sscc: cleaned, reason: 'SSCC must contain digits only.' }
  }
  if (cleaned.length !== TOTAL_LENGTH) {
    return {
      valid: false,
      sscc: cleaned,
      reason: `SSCC-18 must be exactly ${TOTAL_LENGTH} digits long (received ${cleaned.length}).`,
    }
  }

  const base = cleaned.slice(0, PRE_CHECK_LENGTH)
  const receivedCheckDigit = cleaned.slice(PRE_CHECK_LENGTH)
  const expectedCheckDigit = String(calculateCheckDigit(base))
  const extensionDigit = cleaned[0]
  const bodyDigits = cleaned.slice(1, PRE_CHECK_LENGTH)

  if (expectedCheckDigit !== receivedCheckDigit) {
    return {
      valid: false,
      sscc: cleaned,
      reason: 'Check digit does not match — the SSCC may have been mistyped, transposed, or corrupted.',
      expectedCheckDigit,
      receivedCheckDigit,
      extensionDigit,
      bodyDigits,
    }
  }

  return {
    valid: true,
    sscc: cleaned,
    expectedCheckDigit,
    receivedCheckDigit,
    extensionDigit,
    bodyDigits,
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDigits(length: number, firstNonZero = false): string {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += String(randomInt(i === 0 && firstNonZero ? 1 : 0, 9))
  }
  return out
}

/** Generates a fully valid, realistic random SSCC-18. */
export function generateRandomSSCC(): SSCCComponents {
  const extensionDigit = String(randomInt(0, 9))
  const prefixLength = randomInt(MIN_COMPANY_PREFIX_LENGTH, MAX_COMPANY_PREFIX_LENGTH)
  const companyPrefix = randomDigits(prefixLength, true)
  const serialLength = maxSerialReferenceLength(prefixLength)
  const serialReference = randomDigits(serialLength, true)

  const result = buildSSCC(extensionDigit, companyPrefix, serialReference)
  if (!result.ok) {
    throw new Error('Unreachable: randomly generated SSCC inputs failed validation')
  }
  return result.components
}

/** Prefixes the SSCC with its GS1 Application Identifier, e.g. "(00)003123456789012347". */
export function formatWithApplicationIdentifier(sscc: string): string {
  return `(${SSCC_APPLICATION_IDENTIFIER})${sscc}`
}

/** Groups an 18-digit SSCC into pairs for readability, e.g. "00 31 23 45 67 89 01 23 47". */
export function formatGrouped(sscc: string): string {
  return sscc.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

/** The raw text to encode into a GS1-128 barcode for a given SSCC. */
export function gs1128BarcodeText(sscc: string): string {
  return formatWithApplicationIdentifier(sscc)
}
