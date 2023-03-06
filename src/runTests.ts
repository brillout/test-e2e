export { runTests }

import type { Browser } from 'playwright-chromium'
import { getCurrentTest } from './getCurrentTest'
import { Logs } from './Logs'
import { assert, assertUsage, humanizeTime, isTTY, isWindows, logProgress } from './utils'
import { type FindFilter, fsWindowsBugWorkaround } from './utils'
import pc from 'picocolors'
import { abortIfGitHubAction } from './github-action'
import { logSection } from './logSection'
import { setCurrentTest } from './getCurrentTest'

import { getBrowser } from './getBrowser'
import { buildTs } from './buildTs'
import { findTestFiles } from './findTestFiles'
import { loadConfig } from './getConfig'

async function runTests(filter: null | FindFilter) {
  await loadConfig()

  const testFiles = await findTestFiles(filter)

  const browser = await getBrowser()

  for (const testFile of testFiles) {
    assert(testFile.endsWith('.ts'))
    const testFileJs = testFile.replace('.ts', '.mjs')
    const clean = await buildTs(testFile, testFileJs)
    setCurrentTest(testFile)
    try {
      await import(fsWindowsBugWorkaround(testFileJs))
    } finally {
      clean()
    }
    await runTestFile(browser)
    setCurrentTest(null)
    assert(testFileJs.endsWith('.mjs'))
  }

  await browser.close()
}

async function runTestFile(browser: Browser) {
  const testInfo = getCurrentTest()

  if (isTTY) {
    console.log()
    console.log(testInfo.testFile)
  }

  const page = await browser.newPage()
  testInfo.page = page

  // Set when user calls `skip()`
  if (testInfo.skipped) {
    logResult(false)
    assertUsage(!testInfo.runInfo, 'You cannot call `run()` after calling `skip()`')
    assertUsage(testInfo.tests === undefined, 'You cannot call `test()` after calling `skip()`')
    return
  }

  // Set when user calls `run()`
  assert(testInfo.runInfo)
  assert(testInfo.startServer)
  assert(testInfo.terminateServer)
  assert(testInfo.afterEach)

  // Set when user calls `test()`
  assert(testInfo.tests)

  const clean = async () => {
    await testInfo.terminateServer?.()
    await page.close()
  }
  const abort = async () => {
    await clean()
    abortIfGitHubAction()
  }

  // TODO: resolve a success flag instead rejecting
  try {
    await testInfo.startServer()
  } catch (err) {
    logResult(false)
    logFailureReason('an error occurred while starting the server')
    logError(err, 'ERROR')
    Logs.flushLogs()
    await abort()
    return
  }

  for (const { testDesc, testFn } of testInfo.tests) {
    Logs.add({
      logSource: 'test()',
      logText: testDesc,
    })
    const done = logProgress(`| [test] ${testDesc}`)
    let err: unknown
    try {
      await runTest(testFn, testInfo.runInfo.testFunctionTimeout)
    } catch (err_) {
      err = err_
    }
    done(!!err)
    testInfo.afterEach(!!err)
    {
      const failOnWarning = !testInfo.runInfo.doNotFailOnWarning
      const hasErrorLog = Logs.hasErrorLogs(failOnWarning)
      const isFailure = err || hasErrorLog
      if (isFailure) {
        logResult(false)
        const failureContext = 'while running the tests'
        if (err) {
          logFailureReason(`a test failed ${failureContext}`)
          logError(err, 'TEST ASSERTION FAILURE')
        } else if (hasErrorLog) {
          logFailureReason(`${getErrorType(failOnWarning)} occurred ${failureContext}`)
        } else {
          assert(false)
        }
        Logs.logErrors(failOnWarning)
        Logs.flushLogs()
        await abort()
        return
      }
    }
    Logs.clearLogs()
  }

  await clean()

  // Check whether stderr emitted during testInfo.terminateServer()
  {
    const failOnWarning = true
    if (
      Logs.hasErrorLogs(failOnWarning) &&
      // On Windows, the sever sometimes terminates with an exit code of `1`. I don't know why.
      // We skip this check for Windows: this check isn't important anyways.
      // We cannot easilly supress the error because stderr is emitted multiple times:
      // ```
      // [15:36:10.626][\examples\react][npm run preview][stderr] npm
      // [15:36:10.626][\examples\react][npm run preview][stderr]
      // [15:36:10.626][\examples\react][npm run preview][stderr] ERR!
      // [15:36:10.626][\examples\react][npm run preview][stderr]
      // [15:36:10.626][\examples\react][npm run preview][stderr] code
      // [15:36:10.626][\examples\react][npm run preview][stderr] ELIFECYCLE
      // ```
      !isWindows()
    ) {
      logFailureReason(`${getErrorType(failOnWarning)} occurred during server termination`)
      Logs.logErrors(failOnWarning)
      Logs.flushLogs()
      await abort()
      return
    }
  }

  Logs.clearLogs()
  logResult(true)
}

function getErrorType(failOnWarning: boolean) {
  return !failOnWarning ? 'error(s)' : 'error(s)/warning(s)'
}

function runTest(testFn: Function, testFunctionTimeout: number): Promise<undefined | unknown> {
  let resolve!: () => void
  let reject!: (err: unknown) => void
  const promise = new Promise<void>((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })

  const timeout = setTimeout(() => {
    reject(new Error(`[test] Timeout after ${humanizeTime(testFunctionTimeout)}`))
  }, testFunctionTimeout)

  const ret: unknown = testFn()
  ;(async () => {
    try {
      await ret
      resolve()
    } catch (err) {
      reject(err)
    } finally {
      clearTimeout(timeout)
    }
  })()

  return promise
}

function logResult(success: boolean) {
  const testInfo = getCurrentTest()
  const { PASS, FAIL, WARN } = getStatusTags()
  if (success) {
    assert(!testInfo.skipped)
    console.log(`${PASS} ${testInfo.testFile}`)
    return
  }
  if (testInfo.skipped) {
    console.log(`${WARN} ${testInfo.testFile} (${testInfo.skipped})`)
  } else {
    console.log(`${FAIL} ${testInfo.testFile}`)
  }
}

function logFailureReason(reason: string) {
  const testInfo = getCurrentTest()
  const { FAIL } = getStatusTags()
  const color = (s: string) => pc.red(pc.bold(s))
  const msg = `Test ${testInfo.testFile} ${FAIL} because ${reason}, see below.`
  console.log(color(msg))
}

function logError(err: unknown, msg: 'ERROR' | 'TEST ASSERTION FAILURE') {
  logSection(msg)
  console.log(err)
}

function getStatusTags() {
  const PASS = pc.bold(pc.bgGreen(pc.white(' PASS ')))
  const FAIL = pc.bold(pc.bgRed(pc.white(' FAIL ')))
  const WARN = pc.bold(pc.bgYellow(pc.white(' WARN ')))
  return { PASS, FAIL, WARN }
}
