import _ = require('lodash')
import remark = require('remark')

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
    this.options = _.extend({}, Generator.defaultOptions, options)
    this.remark = remark()
  }
  addPage(page: Page) {
    this.pages.push(page)
  }
  async generate() {
    return Promise.all(this.pages.map(async page => {
      const { name } = page
      const content = await this.generatePage(page, this.options)
      return {
        name,
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
    return Object.keys(map).reduce((result, key) => {
      return result.replace(RegExp(`{${key}}`), map[key])
    }, this.options.template)
  }
}
