import test from 'ava'
import dircompare = require('dir-compare')
import fs = require('fs')

import { ProjectGenerator } from './index'

test('should throw when src does not exist', async t => {
  const generator = new ProjectGenerator()
  const err = await t.throws(generator.generate({
    srcDir: 'notexists'
  }))
  t.is(err.message, `'notexists' is not a directory.`)
})

test('should not throw when folder has no file', async t => {
  const generator = new ProjectGenerator()
  await generator.generate({
    srcDir: 'fixtures/cases/no-file'
  })
  t.false(fs.existsSync('fixtures/results/no-file'))
})

test('should honor different main file', async () => {
  await assertGenerate('different-main')
})

test('read and write a single file', async () => {
  await assertGenerate('single-file')
})

async function assertGenerate(testCase: string) {
  const config = {
    srcDir: `fixtures/cases/${testCase}`,
    outDir: `fixtures/results/${testCase}`
  }
  const generator = new ProjectGenerator()
  await generator.generate(config)
  assertDirEqual(`fixtures/baselines/${testCase}`, `fixtures/results/${testCase}`)
}

function assertDirEqual(target, baseline) {
  const diff = dircompare.compareSync(target, baseline)
  if (diff.distinct !== 0) {
    throw Error('result and baseline directory does not match')
  }
}
