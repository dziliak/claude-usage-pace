import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'
import { line } from './line'

const text = atom({ plugin: 'usage-pace', key: 'text' } as const, null)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    // Clears the status line the first version pinned; it outlives a reload.
    $.ui.status(undefined)
    const { rateLimits } = await $.session.usage()
    await update($, text, () => line(rateLimits, Date.now()) ?? null)
    return started
  })

  on('session.measure', async ($, e, next) => {
    await update($, text, () => line(e.rateLimits, Date.now()) ?? null)
    return next(e)
  })

  // The labels at the right of the prompt footer, on the mode line.
  on('ui.render', { component: 'SessionMode' }, async ($, e, next) => {
    const t = await read($, text)
    if (!t) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const { modes } = e.props

    return (
      <Box>
        {modes.length > 0 && <Text dimColor>{modes.join(' & ')} & </Text>}
        <Text color="warning">📊 usage-pace {t}</Text>
      </Box>
    )
  })
}
