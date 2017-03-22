---
title: Demo
template: demo
host: demo-driven-ava
source: ../src/generate.demo.ts
---
# API of `Generator`

| Given | When | Then |
@pagename: 'demo'
@content: .........

| `pagename` | `pagecontent` | `expected` |
| ---------- | ------------- | ---------- |
| 'demo' | '---\ntitle: demo\n---' | '<head><title>demo</title></head>' |


```ts
import h = require('hastscript')
import { generate } from 'demo-driven'

export function setup() {
  return generate
}

export async function workWithoutYaml(t) {
  const html = await generate('# Some Header')
  t.is(html, toHtml(h('h1', ['First Header'])))
}

export function teardown() {
}

```
