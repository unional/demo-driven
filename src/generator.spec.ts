import test from 'ava'

import { Generator } from './generator'

test('must have yaml section', async t => {
  const generator = new Generator()
  generator.addPage({
    name: 'demo',
    content: '# first header'
  })
  const rejected = await t.throws(generator.generate())
  t.is(rejected.message, 'missing yaml section')
})

test('can use custom page template', async t => {
  const generator = new Generator({
    template: '<!doctype html><html><head><title>{name}</title></head><body>{content}</body></html>',
    yamlRequired: false
  })
  generator.addPage({
    name: 'demo',
    content: '# first header'
  })
  const pages = await generator.generate()
  t.deepEqual(pages[0], {
    name: 'demo',
    content: '<!doctype html><html><head><title>demo</title></head><body><h1>first header</h1></body></html>'
  })
})

test('adding style', async t => {
  const generator = new Generator({
    title: {
      class: 'title'
    },
    subTitle: {
      class: 'sub-title'
    },
    links: {
      class: 'links'
    }
  })

  generator.addPage({
    name: 'demo',
    content: `---
title: demo-title
subTitle: The best way to do ddd.
links:
  page 1: page1.md
  page 2: page2.md
---
# first header`})
  const pages = await generator.generate()
  t.deepEqual(pages[0], {
    name: 'demo',
    content: '<header><div class="title">demo-title</div><div class="sub-title">The best way to do ddd.</div><a class="links" href="page1.html">page 1</a><a class="links" href="page2.html">page 2</a></header><h1>first header</h1>'
  })
})
