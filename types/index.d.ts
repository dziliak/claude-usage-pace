export type FooterText = string | null

declare module 'claude-code' {
  interface PluginState {
    'usage-pace': { text: FooterText }
  }
}
