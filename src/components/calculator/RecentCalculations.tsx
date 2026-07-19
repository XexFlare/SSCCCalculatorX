import { CheckCircle2, Clock, Trash2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatGrouped } from '@/utils/sscc'
import type { RecentEntry } from '@/types/sscc'

interface RecentCalculationsProps {
  entries: RecentEntry[]
  onClear: () => void
}

const TYPE_LABEL: Record<RecentEntry['type'], string> = {
  generated: 'Generated',
  validated: 'Validated',
  batch: 'Batch',
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function RecentCalculations({ entries, onClear }: RecentCalculationsProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-4 text-brand-400" />
            Recent Calculations
          </CardTitle>
          <CardDescription>Stored locally in your browser.</CardDescription>
        </div>
        {entries.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear} aria-label="Clear recent calculations">
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-ink-500">
            Nothing yet — generated and validated SSCCs will show up here.
          </p>
        ) : (
          <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-navy-700 bg-navy-800/40 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono-tabular text-sm text-ink-100">
                    {entry.sscc.length === 18 ? formatGrouped(entry.sscc) : entry.sscc}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-500">
                    {TYPE_LABEL[entry.type]} &middot; {formatTimestamp(entry.createdAt)}
                  </p>
                </div>
                {entry.valid === false ? (
                  <Badge variant="danger" className="shrink-0">
                    <XCircle className="size-3" />
                    Invalid
                  </Badge>
                ) : (
                  <Badge variant="success" className="shrink-0">
                    <CheckCircle2 className="size-3" />
                    Valid
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
