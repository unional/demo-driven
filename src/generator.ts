import { getLogger } from 'aurelia-logging'
import toHtml = require('hast-util-to-html')
import yaml = require('js-yaml')
import toHAST = require('mdast-util-to-hast')
import remark = require('remark')
import lint = require('remark-lint')
import html = require('remark-html')
import visit = require('unist-util-visit')

const logger = getLogger('generator')

export const defaultOptions = {
  single: false
}

/**
 * @error Throws ENOENT if `src` does not exist.
 */
export async function generate(text: string) {
  return new Promise((resolve, reject) => {
    // const ast = remark.parse(text)
    // resolve(ast)
    remark().use(lint).use(demoPage).process(text, (err, file) => {
      if (err)
        reject(err)
      else
        resolve(String(file))
    })
  })
}

export const parse = remark.parse

function demoPage() {
  this.Compiler = compiler

  function compiler(tree, file) {
    const hast = toHAST(tree)

    let yaml = extractYaml(tree)
    if (yaml) {
      const node = yamlToHast(yaml)
      hast.children.unshift(node)
    }
    return toHtml(hast)
  }
}

function extractYaml(tree) {
  let json
  visit(tree, 'yaml', node => {
    json = yaml.safeLoad(node.value)
  })
  return json
}

function yamlToHast(yaml) {
  const hast = {
    type: 'element',
    tagName: 'header',
    children: [{
      type: 'element',
      tagName: 'div',
      children: [{
        type: 'text',
        value: yaml.title
      }]
    }]
  }
  return hast
}
