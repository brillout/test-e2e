export { fetch }
export { fetchHtml }

import { getServerUrl } from './getCurrentTest.js'
import fetch_ from 'node-fetch'
import type { RequestInfo, RequestInit, Response } from 'node-fetch'
import { Logs } from './Logs.js'

async function fetchHtml(pathname: string) {
  const response = await fetch(getServerUrl() + pathname)
  const html = await response.text()
  return html
}
async function fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
  try {
    // @ts-ignore
    //
    // I don't know why but [transition to ESM](https://github.com/brillout/test-e2e/commit/9b0822a4f5bf787de5a150173f3eeffcfa7ebc5c) broke the default importing of the node-fetch types.
    //
    // The following used to work but doens't anymore:
    //  ```js
    //  async function fetch(...args: Parameters<typeof fetch_>) {
    //    // ...
    //  }
    //  ```
    return await fetch_(url, init)
  } catch (err) {
    Logs.add({
      logSource: 'Connection Error',
      logText: `Couldn't connect to \`${url}\`. Args: \`${JSON.stringify(init)}\`. Err: \`${
        // @ts-ignore
        err.message
      }\``,
    })
    throw new Error("Couldn't connect to server. See `Connection Error` log for more details.")
  }
}
