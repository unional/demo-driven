import fs = require('fs')
import path = require('path')

import { CONFIG_FILENAME } from './constants'
import { ProjectGenerator } from './ProjectGenerator'

export function readConfig(src: string): ProjectGenerator.PartialOptions | undefined {
  const configPath = path.resolve(src, CONFIG_FILENAME)

  if (!fs.existsSync(configPath)) {
    return undefined
  }

  return JSON.parse(fs.readFileSync(configPath).toString())
}
