import type { Logger } from './query/core/logger'

export const logger: Logger = {
  log: console.log,
  warn: console.warn,
  error: console.warn,
}
