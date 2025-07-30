export { fetchAndLogError as fetch }
export { fetchHtml }

import { getServerUrl } from './getCurrentTest.js'
import { Logs } from './Logs.js'

async function fetchHtml(pathname: string) {
  const response = await fetchAndLogError(getServerUrl() + pathname)
  const html = await response.text()
  return html
}
async function fetchAndLogError(...args: Parameters<typeof fetch>): Promise<Response> {
  try {
    return await fetch(...args)
  } catch (err) {
    const url = args[0]
    const init = args[1]
    Logs.add({
      logSource: 'Connection Error',
      logText: `Couldn't connect to \`${url}\`. Args: \`${JSON.stringify(init)}\`. Err: \`${
        (err as Error).message
      }\``,
    })
    throw new Error("Couldn't connect to server. See `Connection Error` log for more details.")
  }
}
