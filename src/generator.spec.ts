import test from 'ava'

import { generate, parse } from './generator'

test('empty content produces empty result', async t => {
  t.is(await generate(''), '')
})

test('without metadata', async t => {
  t.is(await generate(`# First Header`), '<h1>First Header</h1>')
})

test('with metadata', async t => {
  t.is(await generate(`---
title: demo
---
# First Header`), '<header><div>demo</div></header><h1>First Header</h1>')
})

test('parse meta', t => {
  console.log(parse(`---
title: demo
---`))
})
