import test from 'ava'
import h = require('hastscript')
import toHtml = require('hast-util-to-html')

import { generate } from './generate'

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
