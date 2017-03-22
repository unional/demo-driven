import h = require('hastscript')
import toHtml = require('hast-util-to-html')

import { Generator } from './index'

export async function workWithoutYaml(t) {
  const html = await generate('# Some Header')
  t.is(html, toHtml(h('h1', ['First Header'])))
}
