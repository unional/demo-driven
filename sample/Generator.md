---
title: Demo
template: demo
host: demo-driven-ava
source: ../src/generate.demo.ts
config:
  demo page: page = 'demo'

---
# API of `Generator`

```gherkin
Given the `serving demo` is `sample`,
and I am looking at the `demo page`.
When I click on the `Generator link`,
Then I should be directed to the `Generator page`
```

```yaml
action: serve
suite: sample
currentPage: demo

```

---
demoPage: ddd
---

| Given | When | Then |
@pagename: 'demo'
@content: .........

| `page.name` | `page.content` | `then` |
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
