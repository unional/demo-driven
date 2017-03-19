import test from 'ava'
import fixture from 'ava-fixture'
import fs = require('fs')
import path = require('path')

import { generateSuite } from './suiteGenerator'

const ftest = fixture(test, 'fixtures/cases', 'fixtures/baselines', 'fixtures/results')

ftest.skip('empty-file', async (t, d) => {
  process.chdir(d.casePath)
  await generateSuite()
  t.true(fs.existsSync(path.join(d.resultPath, 'demo.html')))
})

test.skip('src not exist', t => {
  t.throws(generateSuite('notExist', '.'))
})

ftest.skip('no-file', _t => {
  // t.notThrows(generateSuite('.'))
  // t.notThrows(generateSuite())
})

ftest.skip.failing('basic', async (_t, d) => {
  await generateSuite('demo.md', path.resolve(d.resultPath, 'demo.html'))
  return d.match()
})
