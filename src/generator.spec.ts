import test from 'ava'

import { Generator } from './generator'

test('must have yaml section', async t => {
  const generator = new Generator()
  const rejected = await t.throws(generator.generatePage({
    name: 'demo',
    content: '# first header'
  }))
  t.is(rejected.message, 'missing yaml section')
})

test('can use custom page template', async t => {
  const generator = new Generator()
  const pages = await generator.generatePages(
    [{
      name: 'demo',
      content: '# first header'
    }],
    {
      template: '<!doctype html><html><head><title>{name}</title></head><body>{content}</body></html>',
      yamlRequired: false
    })
  t.deepEqual(pages[0], {
    name: 'demo',
    content: '<!doctype html><html><head><title>demo</title></head><body><h1>first header</h1></body></html>'
  })
})

test('adding style', async t => {
  const generator = new Generator()

  const pages = await generator.generatePages([{
    name: 'demo',
    content: `---
title: demo-title
subTitle: The best way to do ddd.
links:
  page 1: page1.md
  page 2: page2.md
---
# first header`}],
    {
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
  t.deepEqual(pages[0], {
    name: 'demo',
    content: '<header><div class="title">demo-title</div><div class="sub-title">The best way to do ddd.</div><a class="links" href="page1.html">page 1</a><a class="links" href="page2.html">page 2</a></header><h1>first header</h1>'
  })
})
