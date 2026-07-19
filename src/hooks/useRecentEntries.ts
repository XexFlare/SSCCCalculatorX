import { useCallback, useEffect, useState } from 'react'
import type { RecentEntry } from '@/types/sscc'
import { clearRecentEntries, loadRecentEntries, saveRecentEntry } from '@/services/storage'

export function useRecentEntries() {
  const [entries, setEntries] = useState<RecentEntry[]>([])

  useEffect(() => {
    setEntries(loadRecentEntries())
  }, [])

  const addEntry = useCallback((entry: Omit<RecentEntry, 'id' | 'createdAt'>) => {
    setEntries(saveRecentEntry(entry))
  }, [])

  const clear = useCallback(() => {
    clearRecentEntries()
    setEntries([])
  }, [])

  return { entries, addEntry, clear }
}
