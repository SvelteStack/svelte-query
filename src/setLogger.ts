import { setLogger } from './query/core'
import { logger } from './logger'

if (logger) {
  setLogger(logger)
}
