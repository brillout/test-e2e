export { autoRetry }

import { TIMEOUT_AUTORETRY } from './TIMEOUTS.js'
import { sleep } from './utils.js'

async function autoRetry<Result = void>(
  test: () => Result | Promise<Result>,
  { timeout = TIMEOUT_AUTORETRY }: { timeout?: number } = {},
): Promise<Result> {
  const period = 100
  const numberOfTries = timeout / period
  let i = 0
  while (true) {
    try {
      return await test()
    } catch (err) {
      i = i + 1
      if (i > numberOfTries) {
        throw err
      }
    }
    await sleep(period)
  }
}
