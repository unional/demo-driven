import _ = require('lodash')
import remark = require('remark')

import { generate } from './generate'
import { page } from './remarkPlugins'

export class Generator {
  private remark
  constructor() {
    this.remark = remark()
  }

  async generatePages(pages: page.Page[], options?: Partial<Generator.Options>) {
    const mergedOptions = this.mergeOptions(options)
    return Promise.all(pages.map(async page => {
      return this.generateOnePage(page, mergedOptions)
    }))
  }

  async generatePage(page: page.Page, options?: Partial<Generator.Options>) {
    const mergedOptions = this.mergeOptions(options)
    return await this.generateOnePage(page, mergedOptions)
  }

  private async generateOnePage(page: page.Page, options: Generator.Options) {
    const { name } = page
    return {
      name,
      content: await this.generateContent(page, options)
    }
  }

  private mergeOptions(options?: Partial<Generator.Options>): Generator.Options {
    return _.extend<Generator.Options>({}, Generator.defaultOptions, options)
  }

  private async generateContent(page: page.Page, options: Generator.Options) {
    const { name } = page
    const content = await generate(page.content, options)
    return this.applyTemplate(
      options.template,
      {
        name,
        content
      })
  }
  private applyTemplate(template, map) {
    return Object.keys(map).reduce((result, key) => {
      return result.replace(RegExp(`{${key}}`, 'g'), map[key])
    }, template)
  }
}
export namespace Generator {
  export const defaultOptions = {
    template: '{content}',
    yamlRequired: true
  }
  export interface Options extends page.Options {
    template: string
  }
}
