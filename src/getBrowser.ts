export { getBrowser }

import { Browser, chromium } from 'playwright-chromium'
import { Logs } from './Logs.js'
import { assert, logProgress } from './utils.js'
import { getConfig } from './getConfig.js'

let browser: Browser | undefined
async function getBrowser() {
  if (!browser) {
    const config = getConfig()
    const done = logProgress('Launch Browser')
    browser = await chromium.launch({
      headless: true,
      logger: {
        isEnabled: () => true,
        log: (name, _severity, message, args, _hint, ...rest) => {
          assert(args.length === 0)
          assert(rest.length === 0)
          Logs.add({
            logSource: 'Playwright',
            logText: `${name} ${message}`,
          })
        },
      },
      ...config.chromiumLaunchOptions,
    })
    done()
  }
  return browser
}
