import test from 'ava'
import fixture from 'ava-fixture'
import { getLogger } from 'aurelia-logging'
import fs = require('fs')
import path = require('path')

import { generateSuite } from './suiteGenerator'

const logger = getLogger('generate:spec')
const ftest = fixture(test, 'fixtures/cases', 'fixtures/baselines', 'fixtures/results')

ftest.skip('empty-file', async (t, d) => {
  process.chdir(d.casePath)
  await generateSuite()
  t.true(fs.existsSync(path.join(d.resultPath, 'demo.html')))
})

test.skip('src not exist', t => {
  t.throws(generateSuite('notExist', '.'))
})

ftest.skip('no-file', t => {
  // t.notThrows(generateSuite('.'))
  // t.notThrows(generateSuite())
})

ftest.skip.failing('basic', async (t, d) => {
  await generateSuite('demo.md', path.resolve(d.resultPath, 'demo.html'))
  return d.match()
})
