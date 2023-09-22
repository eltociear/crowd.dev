import BunyanFormat from 'bunyan-format'
import * as Bunyan from 'bunyan'
import { Logger } from './types'
import { LOG_LEVEL, SERVICE } from '@crowd/common'

const JSON_FORMAT = new BunyanFormat({
  outputMode: 'bunyan',
  levelInString: true,
})

let serviceLoggerInstance: Logger
export const getServiceLogger = (): Logger => {
  if (serviceLoggerInstance) return serviceLoggerInstance

  const options = {
    name: SERVICE,
    level: LOG_LEVEL as Bunyan.LogLevel,
    stream: JSON_FORMAT,
  }

  serviceLoggerInstance = Bunyan.createLogger(options)
  return serviceLoggerInstance
}

export const getChildLogger = (
  name: string,
  parent: Logger,
  logProperties?: Record<string, unknown>,
): Logger => {
  const options = {
    component: name,
    ...(logProperties || {}),
  }

  return parent.child(options, true)
}

const serviceChildMap = new Map<string, Logger>()
export const getServiceChildLogger = (
  name: string,
  logProperties?: Record<string, unknown>,
): Logger => {
  if (serviceChildMap.has(name)) return serviceChildMap.get(name)

  const logger = getChildLogger(name, getServiceLogger(), logProperties)
  serviceChildMap.set(name, logger)
  return logger
}
