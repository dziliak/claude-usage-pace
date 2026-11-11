import type { SessionRateLimit } from 'claude-code'

const HOUR = 3_600_000
const WINDOWS: Record<string, { label: string; length: number }> = {
  five_hour: { label: '5h', length: 5 * HOUR },
  seven_day: { label: 'wk', length: 168 * HOUR },
}

// Clock times, not countdowns: the line is only redrawn when usage moves.
const at = (ms: number, now: number) =>
  new Date(ms).toLocaleString([], {
    weekday: ms - now > 24 * HOUR ? 'short' : undefined,
    hour: 'numeric',
    minute: '2-digit',
  })

export function line(limits: SessionRateLimit[], now: number): string | undefined {
  const parts = limits.flatMap(({ kind, percentUsed, resetsAt }) => {
    const w = WINDOWS[kind]
    if (!w) return []
    const head = `${w.label} ${Math.round(percentUsed)}%`
    const reset = resetsAt ? Date.parse(resetsAt) : NaN
    const elapsed = now - (reset - w.length)
    if (!(elapsed > 0 && now < reset)) return [head]
    // shortcut: pace is the whole-window average, so a recent burst shows slowly;
    // keep a history of readings if a "last 30 min" rate is wanted.
    const rate = percentUsed / elapsed
    const projected = rate * w.length
    return [
      projected > 100
        ? `${head} ⚠ out ${at(now + (100 - percentUsed) / rate, now)}, resets ${at(reset, now)}`
        : `${head} → ${Math.round(projected)}% at reset ${at(reset, now)}`,
    ]
  })
  return parts.length ? parts.join('  ·  ') : undefined
}
