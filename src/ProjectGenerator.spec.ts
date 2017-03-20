import test from 'ava'
// import { fixture } from 'ava-fixture'
// import fs = require('fs')
import path = require('path')

import { ProjectGenerator } from './ProjectGenerator'

test('should throw when src does not exist', async t => {
  const generator = new ProjectGenerator()
  const err = await t.throws(generator.generate('notexists'))
  t.is(err.message, `'notexists' is not a directory.`)
})

test('should throw when folder has no file', async t => {
  const generator = new ProjectGenerator()
  const rejected = await t.throws(generator.generate('fixtures/cases/no-file'))
  t.is(rejected.message, `Main file not found '${path.resolve('fixtures/cases/no-file/demo/index.md')}'`)
})

test('should read config', async t => {
  const generator = new ProjectGenerator()
  const rejected = await t.throws(generator.generate('fixtures/cases/different-main'))
  t.is(rejected.message, `Main file not found '${path.resolve('fixtures/cases/different-main/demo.md')}'`)
})

test('read and write a single file', async _t => {
  const generator = new ProjectGenerator()
  await generator.generate('fixtures/cases/single-file', 'fixtures/results/single-file')

})
