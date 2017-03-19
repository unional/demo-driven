import { getLogger } from 'aurelia-logging'
import extend = require('deep-extend')
import toHtml = require('hast-util-to-html')
import yaml = require('js-yaml')
import _ = require('lodash')
import toHAST = require('mdast-util-to-hast')
import remark = require('remark')
import lint = require('remark-lint')
import html = require('remark-html')
import visit = require('unist-util-visit')

import { generate } from './generate'
import { Page } from './interfaces'
import { page } from './remarkPlugins'

export namespace Generator {
  export interface Options extends page.Options {
    template: string
  }
}
export class Generator {
  static defaultOptions = {
    template: '{content}',
    yamlRequired: true
  }
  pages: Page[] = []
  options: Generator.Options
  private remark
  constructor(options?: Partial<Generator.Options>) {
    this.options = extend({}, Generator.defaultOptions, options)
    this.remark = remark()
  }
  addPage(name: string, content: string) {
    this.pages.push({ name, content })
  }
  async generate() {
    return Promise.all(this.pages.map(async page => {
      const content = await this.generatePage(page, this.options)
      return {
        name: page.name,
        content
      }
    }))
  }
  async generatePage(page: Page, options) {
    const { name } = page
    const content = await generate(page.content, options)
    return this.applyTemplate({
      name,
      content
    })
  }
  private applyTemplate(map) {
    const keys = Object.keys(map)
    return keys.reduce((result, key) => {
      return result.replace(RegExp(`{${key}}`), map[key])
    }, this.options.template)
  }
}
