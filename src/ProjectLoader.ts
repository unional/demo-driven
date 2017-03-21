import fs = require('fs')
import path = require('path')
import recursive = require('recursive-readdir')

export class ProjectLoader {
  markdownFiles: ProjectLoader.File[]
  async load(srcDir: string) {
    if (!fs.existsSync(srcDir))
      throw Error(`'${srcDir}' is not a directory.`)
    const fullPath = path.resolve(srcDir)
    if (!isDirectory(fullPath))
      throw Error('Only support directory')

    await this.loadFromDirectory(fullPath)
  }

  private async loadFromDirectory(srcDir: string) {
    const filepaths = await getAllFilePaths(srcDir)
    const mdFilepaths = filepaths.filter(filepath => path.extname(filepath) === '.md')
    this.markdownFiles = mdFilepaths.map(p => {
      const name = path.relative(srcDir, p)
      return {
        name,
        path: p,
        content: fs.readFileSync(p).toString()
      }
    })
  }
}

export namespace ProjectLoader {
  export interface File {
    name: string
    path: string,
    content: string
  }
}

function getAllFilePaths(path) {
  return new Promise<string[]>((resolve, reject) => {
    recursive(path, (err, files) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(files)
      }
    })
  })
}
function isDirectory(path) {
  const stat = fs.statSync(path)
  return stat.isDirectory()
}
