import path = require('path')

import { generate } from './generate'
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
    const generatedFiles: ProjectLoader.File[] = []
    for (let file of this.loader.markdownFiles) {
      generatedFiles.push({
        path: file.path,
        content: await generate(file.content, this.mergedConfig)
      })
    }
    generatedFiles.forEach(async file => {
      let dest = file.path.slice(0, -3) + '.html'
      const relative = path.relative(srcDir, dest)
      dest = path.resolve(outDir, relative)
      await this.writer.write(dest, file.content)
    })
  }
}
