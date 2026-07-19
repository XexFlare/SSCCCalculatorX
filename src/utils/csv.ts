import type { SSCCComponents } from '@/types/sscc'
import { formatWithApplicationIdentifier } from '@/utils/sscc'

function csvEscape(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function sscListToCSV(list: SSCCComponents[]): string {
  const header = [
    'SSCC-18',
    'Extension Digit',
    'Company Prefix',
    'Serial Reference',
    'Check Digit',
    'GS1-128 Value',
  ]
  const rows = list.map((c) => [
    c.sscc,
    c.extensionDigit,
    c.companyPrefix,
    c.serialReference,
    c.checkDigit,
    formatWithApplicationIdentifier(c.sscc),
  ])
  return [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')
}
