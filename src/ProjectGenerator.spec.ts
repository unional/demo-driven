import test from 'ava'
import dircompare = require('dir-compare')
import fs = require('fs')

import { ProjectGenerator } from './index'

test('should throw when src does not exist', async t => {
  const generator = new ProjectGenerator()
  const err = await t.throws(generator.generate({
    srcDir: 'notexists'
  }))
  t.is(err.message, `Directory 'notexists' not found.`)
})

test('should not throw when folder has no file', async t => {
  const generator = new ProjectGenerator()
  await generator.generate({
    srcDir: 'fixtures/cases/no-file'
  })
  t.false(fs.existsSync('fixtures/results/no-file'))
})

test('should work on cwd if no argument passed', async t => {
  const gen = new ProjectGenerator()
  const err = await t.throws(gen.generate())
  t.is(err.message, `Directory 'demo' not found.`)
})

test('should honor different main file', async () => {
  await assertGenerate('different-main', { generatorOptions: { yamlRequired: false } })
})

test('read and write a single file', async () => {
  await assertGenerate('single-file')
})

async function assertGenerate(testCase: string, moreConfig?: ProjectGenerator.PartialOptions) {
  const config = {
    srcDir: `fixtures/cases/${testCase}`,
    outDir: `fixtures/results/${testCase}`,
    ...moreConfig
  }
  const generator = new ProjectGenerator()
  await generator.generate(config)
  assertDirEqual(`fixtures/baselines/${testCase}`, `fixtures/results/${testCase}`)
}

function assertDirEqual(target, baseline) {
  const diff = dircompare.compareSync(target, baseline, { compareContent: true })
  if (diff.differences !== 0) {
    throw Error('result and baseline directory does not match')
  }
}
