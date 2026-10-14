export { page }

import { getCurrentTest } from './getCurrentTest.js'
import type { Page } from 'playwright-chromium'

const page = new Proxy({} as Page, {
  get(_, prop) {
    const { page } = getCurrentTest()
    if (!page)
      throw new Error(
        "`page` isn't available. Make sure to access `page` only inside test() calls. In particular, if test() is async, then make sure to await all asynchronous code executed by your async test().",
      )
    const value = page[prop as keyof Page]
    // Bind methods to the real page, otherwise page.unroute() assigns `this._routes` on the proxy and the route stays
    return typeof value === 'function' ? value.bind(page) : value
  },
})
