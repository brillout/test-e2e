export { testScreenshotFixture }

// Reference implementation: https://playwright.dev/docs/test-snapshots

import pixelmatch from 'pixelmatch'
import { PNG, type PNGWithMetadata } from 'pngjs'
import fs from 'fs'
import path from 'path'
import { assert, isCI, sleep } from './utils'
import { getCurrentTest, getCwd } from './getCurrentTest'
import { expect } from './chai/expect'
import pc from '@brillout/picocolors'

async function testScreenshotFixture({
  screenshotFixturePath,
  doNotTestLocally,
}: {
  screenshotFixturePath?: string
  /** Only test screenshot in CI environment (e.g. GitHub Actions) */
  doNotTestLocally?: true
} = {}): Promise<void> {
  const pngPaths = getPngPaths()
  const pngFixturPath = screenshotFixturePath || pngPaths.pngFixturPath
  if (doNotTestLocally && !isCI()) {
    console.log(
      `\n${pc.blue('INFO')} test screenshot fixture ${pngFixturPath} ${pc.bold('skipped')}. (Because ${pc.cyan(
        'doNotTestLocally: true',
      )} and test is being run locally, i.e. not in a CI environment.)`,
    )
    return
  }
  const fixtureMissing = !fs.existsSync(pngFixturPath)
  if (fixtureMissing) {
    const pngActual = await takeScreenshot()
    const fileContent = PNG.sync.write(pngActual)
    const { pngExpectPath } = pngPaths
    const filPath = isCI() ? pngExpectPath : pngFixturPath
    fs.writeFileSync(filPath, fileContent)
    console.log('Expect image written at', pngExpectPath)
    const errMsgs = [
      //
      'Screenshot fixture missing. Screenshot fixture created at:',
      `  ${filPath}`,
    ]
    if (!isCI()) {
      errMsgs.push('You can now re-run the test and the screenshot fixture test will pass.')
    } else {
      errMsgs.push(
        [
          'The screenshot fixture was uploaded as GitHub Workflow Artifact.',
          `(See ${pc.bold('Summary')} > ${pc.bold('Artifacts')},`,
          `and make sure to use the ${pc.bold('actions/upload-artifact@v3')} action`,
          `otherwise the screenshot won't be uploaded`,
          `and the ${pc.bold('Artifacts')} section will be missing in the ${pc.bold('Summary')} page.)`,
          `Download the fixture, check it into the repository (so that it lives at ${pngFixturPath}), and try again: the test should now pass.`,
        ].join(' '),
      )
    }
    throw new Error(errMsgs.join('\n'))
  }
  const pngExpect = PNG.sync.read(fs.readFileSync(pngFixturPath))
  const pngActual = await takeScreenshot()
  expect(pngExpect.width).toBe(pngActual.width)
  expect(pngExpect.height).toBe(pngActual.height)
  const { width, height } = pngExpect
  const pngDiffer = new PNG({ width, height })
  const numDiffPixels = pixelmatch(pngExpect.data, pngActual.data, pngDiffer.data, width, height, { threshold: 0.1 })
  try {
    expect(numDiffPixels).toBe(0)
  } catch (err) {
    const { pngExpectPath, pngActualPath, pngDifferPath } = pngPaths
    {
      fs.writeFileSync(pngActualPath, PNG.sync.write(pngActual))
      console.log('Actual image written at', pngActualPath)
    }
    {
      fs.writeFileSync(pngExpectPath, PNG.sync.write(pngExpect))
      console.log('Expect image written at', pngExpectPath)
    }
    {
      fs.writeFileSync(pngDifferPath, PNG.sync.write(pngDiffer))
      console.log('Differ image written at', pngDifferPath)
    }
    throw err
  }
}

async function takeScreenshot(): Promise<PNGWithMetadata> {
  const { page } = getCurrentTest()
  assert(page)
  let screenshotCurr: undefined | PNGWithMetadata
  let screenshotPrev: undefined | PNGWithMetadata
  let attemps = 15
  while (attemps-- > 0) {
    screenshotPrev = screenshotCurr
    screenshotCurr = PNG.sync.read(await page.screenshot())
    if (screenshotPrev) {
      const { width, height } = screenshotCurr
      const numDiffPixels = pixelmatch(screenshotPrev.data, screenshotCurr.data, null, width, height, {
        threshold: 0,
      })
      if (numDiffPixels === 0) {
        return screenshotCurr
      }
    }
    await sleep(1000)
  }
  throw new Error("Couldn't take a stable screenshot. The UI seems to be continously changing.")
}

function getPngPaths() {
  const cwd = getTestFileDir()
  const pngFixturPath = path.join(cwd, './.test-screenshot-fixture.png')
  const pngExpectPath = path.join(cwd, './test-screenshot-expect.png')
  const pngActualPath = path.join(cwd, './test-screenshot-actual.png')
  const pngDifferPath = path.join(cwd, './test-screenshot-differ.png')

  return { pngFixturPath, pngExpectPath, pngActualPath, pngDifferPath }
}

function getTestFileDir(): string {
  const { testFile, runInfo } = getCurrentTest()
  const cwd = path.dirname(testFile)
  assert(cwd === getCwd())
  return cwd
}
