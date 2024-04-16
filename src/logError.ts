export { logError }

import { logSection } from './logSection.js'

function logError(err: unknown, sectionTitle: string = 'ERROR') {
  logSection(sectionTitle)
  console.log(err)
}
