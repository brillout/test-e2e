export { expectLog }
export const Logs = {
  add,
  flushLogs,
  logErrorsAndWarnings,
  clearLogs,
  hasFailureLog,
  logEagerly: false as false | 'all' | 'logs',
}
export type { LogSource }

import { assert, cliOptions, ensureNewTerminalLine, isWindows } from './utils.js'
import pc from '@brillout/picocolors'
import { getCurrentTest, getCurrentTestOptional } from './getCurrentTest.js'
import { logSection } from './logSection.js'
import { isTolerateError } from './Logs/isTolerateError.js'
import stripAnsi from 'strip-ansi'

type LogSource =
  | 'stdout'
  | 'stderr'
  | 'Browser Error'
  | 'Browser Warning'
  | 'Browser Log'
  | 'Playwright'
  | 'run()'
  | 'run() failure'
  | 'test()'
  | 'Connection Error'
type LogEntry = {
  logSource: LogSource
  logText: string
  logInfo: string
  logTimestamp: string
  isNotFailure: boolean
  loggedAfterExit: boolean
}
let logEntries: LogEntry[] = []
const logEntriesAll: LogEntry[] = []

function hasFailureLog({
  includeBrowserWarnings,
  includeStderr,
}: { includeBrowserWarnings: boolean; includeStderr: boolean }): boolean {
  const failLogs = getErrorLogs({ includeBrowserWarnings, includeStderr })
  return failLogs.length > 0
}

function getErrorLogs({
  includeBrowserWarnings,
  includeStderr,
}: { includeBrowserWarnings: boolean; includeStderr: boolean }) {
  const errorLogs = logEntries.filter((logEntry) => {
    if (logEntry.isNotFailure) {
      return false
    }
    const { logSource } = logEntry
    // taskkill makes process exit with exit code `1` which makes npm emit logs on stderr
    if (logEntry.loggedAfterExit && isWindows() && logSource === 'stderr') {
      return false
    }
    if (logSource === 'run() failure') {
      return true
    }
    if (logSource === 'Browser Warning' && includeBrowserWarnings) {
      return true
    }
    if (logSource === 'stderr' && includeStderr) {
      return true
    }
    if (logSource === 'Browser Error') {
      return true
    }
    return false
  })
  return errorLogs
}

function clearLogs() {
  logEntries = []
}

function logErrorsAndWarnings() {
  const errorAndWarningLogs = getErrorLogs({ includeBrowserWarnings: true, includeStderr: true })
  if (errorAndWarningLogs.length === 0) return
  logSection('ERROR & WARNING LOGS')
  errorAndWarningLogs.forEach((logEntry) => printLog(logEntry))
}

function flushLogs() {
  logSection('ALL LOGS')
  logEntries.filter((logEntry) => !logEntry.loggedAfterExit).forEach((logEntry) => printLog(logEntry))
  logEntries = []
}
function add({
  logSource,
  logText,
  logInfo = '',
  loggedAfterExit = false,
}: {
  logSource: LogSource
  logText: string
  logInfo?: string
  loggedAfterExit?: boolean
}) {
  const logTimestamp = getTimestamp()

  const logEntry = {
    logSource,
    logText,
    logInfo,
    logTimestamp,
    isNotFailure: isTolerateError({ logSource, logText }),
    loggedAfterExit,
  }
  logEntries.push(logEntry)
  logEntriesAll.push(logEntry)
  if (Logs.logEagerly) {
    let shouldLog = false
    if (Logs.logEagerly === 'all') shouldLog = true
    if (Logs.logEagerly === 'logs' && logSource !== 'Playwright') shouldLog = true
    if (shouldLog) printLog(logEntry)
  }
  if (logSource === 'Browser Error' || logSource === 'stderr') {
    terminateUponErrorLog()
  }
}

async function terminateUponErrorLog() {
  if (!cliOptions.bail) return
  const testInfo = getCurrentTest()
  testInfo.aborted = true
  assert(Logs.hasFailureLog({ includeBrowserWarnings: false, includeStderr: true }))
  // Trick to abort the test: page.close() triggers the following error.
  // ```console
  // proxy.waitForFunction: Target closed
  //     at clientSideNavigation (.testRun.ts:16:16)
  //     at .testRun.ts:11:5
  //     at file:///home/rom/code/test-e2e/src/runAll.ts:278:7 {
  //   name: 'Error'
  // }
  // ```
  await testInfo.page!.close()
}

/**
 * Expect a log to be printed.
 *
 * @param filter Only search in certain types of logs, e.g. only in browser- or server-side logs.
 *
 * @param allLogs Search in all logs, including the logs of previous tests as well as the logs of the setup/prepare scripts. Usually used in combination with the `filter` parameter.
 */
function expectLog(
  logText: string,
  { filter: logFilter, allLogs }: { filter?: (logEntry: LogEntry) => boolean; allLogs?: boolean } = {},
) {
  const logList = allLogs ? logEntriesAll : logEntries
  const logsFound = logList.filter((logEntry) => {
    if (removeAnsi(logEntry).logText.includes(logText)) {
      logEntry.isNotFailure = true
      return true
    }
    return false
  })
  if (logsFound.length === 0) {
    throw new Error(`The following log is expected but it wasn't logged: "${logText}"`)
  }
  if (!logFilter) return
  const logsFoundAfterFilter = logsFound.filter((logEntry) => logFilter(removeAnsi(logEntry)))
  if (logsFoundAfterFilter.length === 0) {
    console.log(JSON.stringify(logsFound, null, 2))
    throw new Error(`Logs above are matching "${logText}" but don't match the filter you provided.`)
  }
}

function removeAnsi(logEntry: LogEntry): LogEntry {
  const logEntryWithoutAnsi = {
    ...logEntry,
    logText: stripAnsi(logEntry.logText),
  }
  return logEntryWithoutAnsi
}

function getTimestamp() {
  const now = new Date()
  const time = now.toTimeString().split(' ')[0]
  const milliseconds = now.getTime().toString().split('').slice(-3).join('')
  const timestamp = time + '.' + milliseconds
  return timestamp
}

function printLog(logEntry: LogEntry) {
  const { logSource, logText, logTimestamp } = logEntry

  let logSourceLabel: string = colorize(logSource)

  const testInfo = getCurrentTestOptional()

  // See https://github.com/nodejs/node/issues/8033#issuecomment-388323687
  if (!ensureNewTerminalLine()) {
    console.log('')
  }

  let msg = logText
  // I don't know why but sometimes `logText` is `undefined`
  if (msg === undefined) msg = ''
  // Some logs seem have a trailing new line
  msg = msg.trim()

  let testInfoLabels = ''
  if (testInfo) {
    assert(testInfo.runInfo, testInfo)
    testInfoLabels = `[${testInfo.testName}][${testInfo.runInfo.cmd}]`
  }

  console.log(`[${logTimestamp}]${testInfoLabels}[${logSourceLabel}] ${msg}`)
}

function colorize(logSource: LogSource): string {
  const { bold } = pc
  if (
    logSource === 'stderr' ||
    logSource === 'Browser Error' ||
    logSource === 'Connection Error' ||
    logSource === 'run() failure'
  ) {
    return bold(pc.red(logSource))
  }
  if (logSource === 'Browser Warning') {
    return bold(pc.yellow(logSource))
  }
  if (logSource === 'stdout' || logSource === 'Browser Log') {
    return bold(pc.blue(logSource))
  }
  if (logSource === 'Playwright') {
    return bold(pc.magenta(logSource))
  }
  if (logSource === 'run()' || logSource === 'test()') {
    return bold(pc.cyan(logSource))
  }
  assert(false)
}
