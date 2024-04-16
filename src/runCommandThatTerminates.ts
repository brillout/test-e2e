export { runCommandThatTerminates }

import { getCwd, setRunInfo } from './getCurrentTest.js'
import { runCommand } from './utils.js'

async function runCommandThatTerminates(cmd: string, { timeout = 2 * 60 * 1000 }: { timeout?: number } = {}) {
  setRunInfo({ cmd, isRunCommandThatTerminates: true })
  const cwd = getCwd()
  await runCommand(cmd, { timeout, cwd })
}
