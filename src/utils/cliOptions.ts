export { cliOptions }

import { check, prepare, validate } from './parseCli.js'

prepare()
const verbose = check('--verbose')
const inspect = check('--inspect')
const debugEsbuild = check('--debug-esbuild')
const bail = check('--bail')
// Defined & used in ./findFiles.ts
const exclude = check('--exclude')
validate()

const cliOptions = {
  verbose,
  inspect,
  debugEsbuild,
  bail,
}
