export { cliOptions }

import { check, prepare, validate } from './parseCli'

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
  // To inspect a specific test: `$ touch examples/some-example/INSPECT`
  inspect: inspect || !!process.env.TEST_INSPECT,
  debugEsbuild,
  bail,
}
