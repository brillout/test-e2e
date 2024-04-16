export { skip }

import { getCurrentTest } from './getCurrentTest.js'

function skip(reason: string) {
  const testInfo = getCurrentTest()
  testInfo.skipped = { reason }
}
