import type { RecentEntry } from '@/types/sscc'

const STORAGE_KEY = 'ssccalculatorx.recent'
const MAX_ENTRIES = 25

export function loadRecentEntries(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveRecentEntry(entry: Omit<RecentEntry, 'id' | 'createdAt'>): RecentEntry[] {
  const entries = loadRecentEntries()
  const newEntry: RecentEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  const next = [newEntry, ...entries].slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // localStorage unavailable (private browsing quota, etc.) — fail silently
  }
  return next
}

export function clearRecentEntries(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
