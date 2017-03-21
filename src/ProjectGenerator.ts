import path = require('path')
import _ = require('lodash')

import { readConfig } from './config'
import { Generator } from './Generator'
import { ProjectLoader } from './ProjectLoader'
import { ProjectWriter } from './ProjectWriter'
import { page } from './remarkPlugins'

export class ProjectGenerator {
  pages: page.Page[]
  constructor(
    private loader: ProjectLoader = new ProjectLoader(),
    private writer: ProjectWriter = new ProjectWriter()
  ) { }
  async generate(options: ProjectGenerator.PartialOptions) {
    const opt: ProjectGenerator.Options = mergeOptions(options)
    const { srcDir, outDir } = opt

    await this.loader.load(srcDir)
    const g = new Generator()

    this.pages = await g.generatePages(this.loader.markdownFiles, opt.generatorOptions)
    this.pages.forEach(async page => {
      let dest = path.join(outDir, page.name.slice(0, -3) + '.html')
      await this.writer.write(dest, page.content)
    })
  }
}

export namespace ProjectGenerator {
  export const defaultOptions = {
    main: 'index.md',
    srcDir: 'demo',
    outDir: 'demo',
    generatorOptions: Generator.defaultOptions
  }
  export interface PartialOptions {
    main?: string,
    srcDir?: string,
    outDir?: string,
    generatorOptions?: Partial<Generator.Options>
  }
  export interface Options {
    main: string,
    srcDir: string,
    outDir: string,
    generatorOptions: Generator.Options
  }
}

function mergeOptions(config) {

  return _.merge({}, ProjectGenerator.defaultOptions, readConfig(config.srcDir), config)
}
