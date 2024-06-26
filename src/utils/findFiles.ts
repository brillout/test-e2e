export { findFiles }
export { findFilesParseCliArgs }
export { filterFiles }
export type { FindFilter }

import glob from 'fast-glob'
import path from 'path'
import { runCommandShortLived } from './runCommandShortLived.js'

type FindFilter = {
  terms: string[]
  exclude: boolean
}

const cwd = process.cwd()
let gitFiles: string[]

async function findFiles(pattern: string): Promise<string[]> {
  let files = (await glob([pattern], { ignore: ['**/node_modules/**', '**/.git/**'], cwd, dot: true })).map(
    (filePathRelative) => path.join(cwd, filePathRelative),
  )
  files = await filterGitIgnoredFiles(files)
  return files
}

function filterFiles(files: string[], findFilter: null | FindFilter): string[] {
  return files
    .map((p) => path.relative(cwd, p))
    .filter((filePathRelative) => applyFilter(filePathRelative, findFilter))
    .map((p) => path.join(cwd, p))
}

async function filterGitIgnoredFiles(files: string[]): Promise<string[]> {
  if (!gitFiles) {
    const stdout1 = await runCommandShortLived('git ls-files', { cwd })
    // Also include untracked files.
    //  - In other words, we remove git ignored files. (Staged files are tracked and listed by `$ git ls-files`.)
    //  - `git ls-files --others --exclude-standard` from https://stackoverflow.com/questions/3801321/git-list-only-untracked-files-also-custom-commands/3801554#3801554
    const stdout2 = await runCommandShortLived('git ls-files --others --exclude-standard', { cwd })
    gitFiles = [...stdout1.split('\n'), ...stdout2.split('\n')].map((filePathRelative) =>
      path.join(cwd, filePathRelative),
    )
  }
  const filesFiltered = files.filter((file) => gitFiles.includes(file))
  return filesFiltered
}

function applyFilter(filePathRelative: string, findFilter: null | FindFilter) {
  if (!findFilter) {
    return true
  }
  const { terms, exclude } = findFilter
  for (const term of terms) {
    if (!matches(filePathRelative, term) && !exclude) {
      return false
    }
    if (matches(filePathRelative, term) && exclude) {
      return false
    }
  }
  return true
}
function matches(str: string, chunk: string) {
  str = normalize(str)
  chunk = normalize(chunk)
  return str.includes(chunk)
}
function normalize(p: string) {
  return path.normalize(p)
}

function findFilesParseCliArgs(): null | FindFilter {
  const terms: string[] = []
  let exclude = false
  process.argv.slice(2).forEach((arg) => {
    if (arg === '--exclude') {
      exclude = true
    }
    if (!arg.startsWith('--')) {
      terms.push(arg)
    }
  })

  const filter =
    terms.length === 0
      ? null
      : {
          terms,
          exclude,
        }
  return filter
}
