export { findTestFiles }

import { filterFiles, findFiles, FindFilter } from './utils.js'
import { getTestFilesForCurrentJob } from './parallel-ci.js'

// Unit tests `**/*.spec.*` are handled by Vitest
const testFilenamePattern = '**/*.test.ts'

async function findTestFiles(findFilter: null | FindFilter): Promise<string[]> {
  const testFilesAll = await findTestFilesAll()
  const testFiles = filterFiles(testFilesAll, findFilter)
  return testFiles
}

async function findTestFilesAll(): Promise<string[]> {
  {
    const testFiles = getTestFilesForCurrentJob()
    if (testFiles) return testFiles
  }
  {
    const testFiles = findFiles(testFilenamePattern)
    return testFiles
  }
}
