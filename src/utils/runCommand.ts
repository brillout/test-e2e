export { runCommand }

// TO-DO/eventually: use @brillout/shell

import { exec } from 'child_process'
import { genPromise } from './genPromise.js'
import { humanizeTime } from './humanizeTime.js'

function runCommand(cmd: string, { timeout, cwd }: { timeout: number; cwd: string }): Promise<void> {
  const { promise, resolve, reject } = genPromise()

  const t = setTimeout(() => {
    reject(new Error(`Command call \`${cmd}\` (${cwd}) timed out after ${humanizeTime(timeout)}`))
  }, timeout)

  exec(cmd, { cwd }, (err, _stdout, stderr) => {
    clearTimeout(t)
    if (stderr) {
      reject(new Error(stderr))
    } else if (err) {
      reject(err)
    } else {
      resolve(undefined)
    }
  })

  return promise
}
