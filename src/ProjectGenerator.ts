import path = require('path')

import { generate } from './generate'
import { ProjectLoader, File } from './ProjectLoader'

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
  constructor(
    private loader: ProjectLoader = new ProjectLoader(),
    private writer: ProjectWriter = new ProjectWriter()
  ) { }
  async generate(projectRoot = '.', destRoot?: string) {
    await this.loader.load(projectRoot)

    const generatedFiles: File[] = []
    for (let file of this.loader.markdownFiles) {
      generatedFiles.push({
        path: file.path,
        content: await generate(file.content)
      })
    }
    generatedFiles.forEach(async file => {
      let dest = file.path.slice(0, -3) + '.html'
      if (destRoot) {
        const relative = path.relative(projectRoot, dest)
        dest = path.resolve(destRoot, relative)
      }
      console.log(dest)
      await this.writer.write(dest, file.content)
    })
  }
}
