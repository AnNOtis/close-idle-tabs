import { interval } from '../../utils/index'
import sinon from 'sinon'
import test from 'ava'

test.beforeEach(t => {
  t.context.clock = sinon.useFakeTimers()
})

test.afterEach(t => {
  t.context.clock.restore()
})

test.cb('initial delay', t => {
  let isInit = false
  interval(() => { isInit = true }, 0, 100)
  t.context.clock.tick(99)
  t.false(isInit)
  t.context.clock.tick(2)
  t.true(isInit)
  t.end()
})

test.cb('initial delay can be canceled', t => {
  let isInit = false
  const cancel = interval(() => { isInit = true }, 0, 100)
  cancel()
  t.context.clock.tick(1000)
  t.false(isInit)
  t.end()
})

test.cb('interval scale', t => {
  let count = 0
  interval(() => { count++ }, 1000, 100)
  t.context.clock.tick(1110)
  t.is(count, 2)
  t.end()
})

test.cb('initerval can be canceled', t => {
  let count = 0
  const cancel = interval(() => { count++ }, 1000, 100)
  t.context.clock.tick(110)
  cancel()
  t.context.clock.tick(1000)
  t.is(count, 1)
  t.end()
})
