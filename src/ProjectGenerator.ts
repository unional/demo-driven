import path = require('path')

import { Generator } from './generator'
import { ProjectLoader } from './ProjectLoader'

import { mergeConfig, Config } from './config'
import { ProjectWriter } from './ProjectWriter'

export const defaultOptions = {
  single: false
}

export class ProjectGenerator {
  config
  srcPath
  root
  entryFile
  mainPath
  allFiles
  private mergedConfig: Config
  constructor(
    private loader: ProjectLoader = new ProjectLoader(),
    private writer: ProjectWriter = new ProjectWriter()
  ) { }
  async generate(config: Partial<Config>) {
    this.mergedConfig = mergeConfig(config)
    const { srcDir, outDir } = this.mergedConfig

    await this.loader.load(srcDir)
    const g = new Generator(this.mergedConfig)

    for (let file of this.loader.markdownFiles) {
      g.addPage(file)
    }
    const files = await g.generate()
    files.forEach(async file => {
      let dest = path.join(outDir, file.name.slice(0, -3) + '.html')
      await this.writer.write(dest, file.content)
    })
  }
}
