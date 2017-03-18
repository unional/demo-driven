import test from 'ava'
import h = require('hastscript')
import toHtml = require('hast-util-to-html')

import { Generator, generate } from './generator'

test('empty content produces empty result', async t => {
  t.is(await generate(''), '')
})

test('without metadata', async t => {
  t.is(
    await generate(`# First Header`),
    toHtml(h('h1', ['First Header'])))
})

test('with metadata', async t => {
  t.is(
    await generate(`---
title: demo
---
# First Header`),
    toHtml(
      h('header', [h('div', ['demo'])])
    ) +
    toHtml(
      h('h1', ['First Header'])
    ))
})

test.skip('must have yaml section', async t => {
  const generator = new Generator()
  generator.addPage('demo', ``)
  const rejected = await t.throws(generator.generate())
  t.is(rejected.message, 'missing yaml section')
})
