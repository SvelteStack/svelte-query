import { setLogger } from './queryCore/core'
import { logger } from './logger'

if (logger) {
  setLogger(logger)
}
