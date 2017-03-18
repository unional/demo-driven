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

export namespace Generator {
  export interface Page {
    name: string,
    content: string
  }
}

export class Generator {
  pages: Generator.Page[] = []
  private remark
  constructor() {
    this.remark = remark()
  }
  addPage(name: string, content: string) {
    this.pages.push({ name, content })
  }
  async generate() {
    return Promise.all(this.pages.map(async page => {
      return this.generatePage(page)
    }))
  }
  private async generatePage(page: Generator.Page) {
    return new Promise((resolve, reject) => {
      remark().use(lint).use(demoPage, {
        name: page.name
      }).process(page.content, (err, file) => {
        if (err)
          reject(err)
        else
          resolve(String(file))
      })
    })
  }
}

export async function generate(text: string) {
  return new Promise((resolve, reject) => {
    remark().use(lint).use(demoPage, { yamlOptional: true }).process(text, (err, file) => {
      if (err)
        reject(err)
      else
        resolve(String(file))
    })
  })
}

function demoPage(options) {
  this.Compiler = compiler

  function compiler(ast, file) {
    const hast = toHAST(ast)

    let yaml = extractYaml(ast)
    if (yaml) {
      const node = yamlToHast(yaml)
      hast.children.unshift(node)
    }
    else if (!options.yamlOptional)
      file.fail('missing yaml section', ast)
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
