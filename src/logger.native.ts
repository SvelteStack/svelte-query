import type { Logger } from './queryCore/core/logger'

export const logger: Logger = {
  log: console.log,
  warn: console.warn,
  error: console.warn,
}
