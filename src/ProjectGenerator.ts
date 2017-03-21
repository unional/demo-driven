import { Logger, getLogger } from 'aurelia-logging'
import fs = require('fs')
import path = require('path')
import _ = require('lodash')

import { readConfigFile } from './config'
import { Generator } from './Generator'
import { ProjectLoader } from './ProjectLoader'
import { ProjectWriter } from './ProjectWriter'
import { page } from './remarkPlugins'

export class ProjectGenerator {
  log: Logger = getLogger('Project Generator')
  pages: page.Page[]
  constructor(
    private loader: ProjectLoader = new ProjectLoader(),
    private writer: ProjectWriter = new ProjectWriter()
  ) { }
  async generate(options?: ProjectGenerator.PartialOptions) {
    const opt: ProjectGenerator.Options = mergeOptions(options)
    const { srcDir, outDir } = opt

    this.log.info(`Loading files from '${srcDir}'`)
    await this.loader.load(srcDir)
    const g = new Generator()

    this.log.info('Generating pages...')
    this.pages = await g.generatePages(this.loader.markdownFiles, opt.generatorOptions)
    await Promise.all(this.pages.map(page => {
      let dest = path.join(outDir, page.name.slice(0, -3) + '.html')
      return this.writer.write(dest, page.content)
    }))
    this.log.info(`Pages written to '${outDir}'`)
  }
}

const template = fs.readFileSync(path.resolve(__dirname, '../../assets/template.html')).toString()

export namespace ProjectGenerator {
  export const defaultOptions = {
    main: 'index.md',
    srcDir: 'demo',
    outDir: 'demo',
    generatorOptions: { ...Generator.defaultOptions, template }
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

function mergeOptions(options) {
  const config = readConfigFile()
  let result = _.merge<ProjectGenerator.Options>({}, ProjectGenerator.defaultOptions, config, options)
  if (config) {
    if (config.srcDir)
      result.srcDir = path.join(result.srcDir, config.srcDir)
    if (config.outDir)
      result.outDir = path.join(result.outDir, config.outDir)
  }

  return result
}
