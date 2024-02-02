export { isTolerateError }

import { getConfig } from '../getConfig'
import type { LogSource } from '../Logs'
import stripAnsi from 'strip-ansi'

type LogData = { logSource: LogSource; logText: string }

function isTolerateError({ logSource, logText }: LogData): boolean {
  logText = stripAnsi(logText)

  if (tolerateError({ logSource, logText })) {
    return true
  }
  const config = getConfig()
  if (config.tolerateError?.({ logSource, logText })) {
    return true
  }
  return false
}

function tolerateError({ logSource, logText }: LogData): boolean {
  return isFetchExperimentalWarning() || isTerminationEPIPE() || isChromeCannotCreepyTrackWarning()

  function isFetchExperimentalWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes(
        'ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time'
      )
    )
  }

  /* Suppress:
  ```
  [16:00:26.335][/examples/i18n-v1][npm run dev][run()] Terminate server.
  [16:00:26.342][/examples/i18n-v1][npm run dev][stderr] The service was stopped: write EPIPE
  [16:00:26.342][/examples/i18n-v1][npm run dev][run()] Process termination. (Nominal, exit code: null.)
  ```
  */
  function isTerminationEPIPE() {
    return logSource === 'stderr' && logText.includes('The service was stopped: write EPIPE')
  }

  /* Ignore Chrome logging warning when it cannot do its creepy tracking: https://stackoverflow.com/questions/69619035/error-with-permissions-policy-header-unrecognized-feature-interest-cohort/75119417#75119417
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
     ```
  */
  function isChromeCannotCreepyTrackWarning() {
    return (
      logSource === 'Browser Warning' &&
      logText.includes(
        "Error with Permissions-Policy header: Origin trial controlled feature not enabled: 'interest-cohort'."
      )
    )
  }
}
