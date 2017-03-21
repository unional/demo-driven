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
  private remark
  constructor() {
    this.remark = remark()
  }

  async generatePages(pages: Page[], options?: Partial<Generator.Options>) {
    const mergedOptions = this.mergeOptions(options)
    return Promise.all(pages.map(async page => {
      return this.generateOnePage(page, mergedOptions)
    }))
  }

  async generatePage(page: Page, options?: Partial<Generator.Options>) {
    const mergedOptions = this.mergeOptions(options)
    return await this.generateOnePage(page, mergedOptions)
  }

  async generateOnePage(page: Page, options: Generator.Options) {
    const { name } = page
    return {
      name,
      content: await this.generateContent(page, options)
    }
  }

  private mergeOptions(options?: Partial<Generator.Options>): Generator.Options {
    return _.extend<Generator.Options>({}, Generator.defaultOptions, options)
  }

  private async generateContent(page: Page, options: Generator.Options) {
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
      return result.replace(RegExp(`{${key}}`), map[key])
    }, template)
  }
}
