import { JestChaiExpect } from './JestChaiExpect.js'
import * as chai from 'chai'
import type { Expect } from './types.js'

chai.use(JestChaiExpect)
export const expect = chai.expect as any as Expect
