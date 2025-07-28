export { getConfig }
export { loadConfig }

import path from 'path'
import fs from 'fs'
import { assert, assertUsage, fsWindowsBugWorkaround, isObject } from './utils.js'
import type { LaunchOptions } from 'playwright-chromium'
import type { TolerateError } from './Logs/isTolerateError.js'

const configFileName = 'test-e2e.config.mjs'

type Config = {
  tolerateError?: TolerateError
  ci?: never
  chromiumLaunchOptions?: LaunchOptions
}

let config: null | Config = null

function getConfig(): Config {
  assert(config)
  return config
}

async function loadConfig(): Promise<void> {
  const configFilePath = find()
  if (!configFilePath) {
    config = {}
    return
  }
  const configFileExports = (await import(fsWindowsBugWorkaround(configFilePath))) as Record<string, unknown>
  assertUsage('default' in configFileExports, `${configFileName} should have a default export`)
  assertConfig(configFileExports.default)
  config = configFileExports.default
}

function assertConfig(config: unknown): asserts config is Config {
  assertUsage(isObject(config), `${configFileName} default export should be an object`)
}

function find(): null | string {
  let dir = process.cwd()
  while (true) {
    const configFilePath = path.join(dir, configFileName)
    if (fs.existsSync(configFilePath)) {
      return configFilePath
    }
    const dirPrevious = dir
    dir = path.dirname(dir)
    if (dir === dirPrevious) {
      return null
    }
  }
}
