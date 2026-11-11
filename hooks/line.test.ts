import { expect, test } from 'claude-code/testing'
import { line } from './line'

const HOUR = 3_600_000
const now = Date.parse('2026-11-10T12:00:00Z')
const iso = (ms: number) => new Date(ms).toISOString()

test('on pace: shows the percent it will land on', async () => {
  // 2h into the 5h window at 20% -> 50% at reset
  const s = line([{ kind: 'five_hour', percentUsed: 20, resetsAt: iso(now + 3 * HOUR) }], now)
  expect(s).toMatch(/^5h 20% → 50% at reset /)
})

test('over pace: warns with a run-out time', async () => {
  // 1h in at 60% -> 300% projected
  const s = line([{ kind: 'five_hour', percentUsed: 60, resetsAt: iso(now + 4 * HOUR) }], now)
  expect(s).toMatch(/^5h 60% ⚠ out .*, resets /)
})

test('both windows join; unknown kinds and missing resets degrade', async () => {
  const s = line(
    [
      { kind: 'five_hour', percentUsed: 10 },
      { kind: 'spend_limit', percentUsed: 5 },
      { kind: 'seven_day', percentUsed: 50, resetsAt: iso(now + 84 * HOUR) },
    ],
    now,
  )
  expect(s).toMatch(/^5h 10% {2}· {2}wk 50% → 100% at reset /)
  expect(line([], now)).toBe(undefined)
})
