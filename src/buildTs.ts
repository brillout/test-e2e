export { buildTs }
export { sourceMaps }

import { build } from 'rolldown'
import fs from 'fs'
import path from 'path'
import { cliOptions } from './utils.js'

const sourceMaps: Record<string, string> = {}

async function buildTs(entry: string, outfile: string): Promise<() => void> {
  await build({
    platform: 'node',
    input: entry,
    external: (id, _importer, isResolved) =>
      !isResolved &&
      isNpmPackageImport(id) &&
      // Helpers injected by Rolldown's transformer (e.g. when down-leveling syntax) need to be bundled
      !id.startsWith('@oxc-project/runtime/'),
    logLevel: 'warn',
    transform: {
      target: 'es2022',
    },
    output: {
      file: outfile,
      sourcemap: true,
      format: 'esm',
      minify: false,
      codeSplitting: false,
    },
  })
  {
    const sourceMapFile = `${outfile}.map`
    sourceMaps[outfile] = fs.readFileSync(sourceMapFile, 'utf8')
    fs.unlinkSync(sourceMapFile)
  }
  const clean = () => {
    if (cliOptions.debugRolldown) {
      return
    }
    fs.unlinkSync(`${outfile}`)
  }
  return clean
}

// Same as esbuild's `packages: 'external'`
function isNpmPackageImport(importPath: string): boolean {
  return !importPath.startsWith('.') && !path.isAbsolute(importPath)
}
