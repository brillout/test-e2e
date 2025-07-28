export { isTolerateError }
export type { TolerateError }

import { getConfig } from '../getConfig.js'
import { getCurrentTestOptional, type TestInfo } from '../getCurrentTest.js'
import type { LogSource } from '../Logs.js'
import stripAnsi from 'strip-ansi'

type LogData = { logSource: LogSource; logText: string }

type TolerateError =
  | true
  | ((args: { logSource: LogSource; logText: string; testInfo: null | TestInfo }) => boolean | undefined)

function isTolerateError({ logSource, logText }: LogData): boolean {
  logText = stripAnsi(logText)

  if (tolerateErrorBuiltIn({ logSource, logText })) {
    return true
  }
  const testInfo = getCurrentTestOptional()
  const config = getConfig()
  const { tolerateError } = config
  if (tolerateError === true) return true
  if (tolerateError?.({ logSource, logText, testInfo })) {
    return true
  }
  return false
}

function tolerateErrorBuiltIn({ logSource, logText }: LogData): boolean {
  return (
    [
      {
        logText: 'ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time',
        logSource: 'stderr',
      },

      /* Ignore:
      ```
      [16:00:26.335][/examples/i18n-v1][npm run dev][run()] Terminate server.
      [16:00:26.342][/examples/i18n-v1][npm run dev][stderr] The service was stopped: write EPIPE
      [16:00:26.342][/examples/i18n-v1][npm run dev][run()] Process termination. (Nominal, exit code: null.)
      ``` */
      {
        logText: 'The service was stopped: write EPIPE',
        logSource: 'stderr',
      },

      /* Ignore Chrome logging warning when it cannot do its creepy tracking: https://stackoverflow.com/questions/69619035/error-with-permissions-policy-header-unrecognized-feature-interest-cohort
      ```
      [15:57:20.273][/test/abort/test-dev-server.test.ts][npm run dev:server][Browser Warning] {
        "type": "warning",
        "text": "Error with Permissions-Policy header: Origin trial controlled feature not enabled: 'interest-cohort'.",
        "location": {
          "url": "",
          "lineNumber": 0,
          "columnNumber": 0
        },
        "args": []
      }
      ``` */
      {
        logText: 'Error with Permissions-Policy header: Origin trial controlled feature not enabled',
        logSource: 'Browser Warning',
      },
    ] as LogData[]
  ).some((l) => l.logSource === logSource && logText.includes(l.logText))
}
