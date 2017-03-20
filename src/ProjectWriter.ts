import fs = require('fs')
import path = require('path')
import mkdirp = require('mkdirp')

export class ProjectWriter {
  async write(dest: string, content: string) {
    return new Promise(resolve => {
      mkdirp(path.dirname(dest), () => {
        fs.writeFileSync(dest, content)
        resolve()
      })
    })
  }
}
