export { cliOptions }

import { check, prepare, validate } from './parseCli.js'

prepare()
const verbose = check('--verbose')
const inspect = check('--inspect')
const debugRolldown = check('--debug-rolldown')
const bail = check('--bail')
// Defined & used in ./findFiles.ts
const exclude = check('--exclude')
validate()

const cliOptions = {
  verbose,
  inspect,
  debugRolldown,
  bail,
}
