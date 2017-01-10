import { resolve, join } from 'path'
import test from 'ava'
import fixture from 'ava-fixture'
import { getLogger } from 'aurelia-logging'

import { generate } from './generate'

const logger = getLogger('generate:spec')
const ftest = fixture(test, 'fixtures/cases', 'fixtures/baselines', 'fixtures/results')


test('src not exist', t => {
  t.throws(() => generate('notExist', '.'))
})

ftest('no-file', t => {
  t.notThrows(() => generate('.'))
  t.notThrows(() => generate())
})

ftest.failing('basic', (t, d) => {
  generate('demo.md', resolve(d.resultPath, 'demo.html'))
  return d.match()
})
