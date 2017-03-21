import browserSync = require('browser-sync')
import _ = require('lodash')

import { Command } from '../utils/command'
import { readConfigFile } from '../config'
import { ProjectGenerator } from '../ProjectGenerator'

/**
 * Serves demo pages.
 */
export default async function serve(_rawArgv: string[]) {
  const config = _.merge({}, ProjectGenerator.defaultOptions, readConfigFile())

  const index = config.main.replace('.md', '.html')
  const bs = browserSync.create()
  bs.init({
    server: {
      baseDir: config.outDir,
      index
    }
  })
  bs.reload('*.html')
}

export const command: Command = {
  name: 'serve',
  description: 'Serves demo pages',
  alias: ['s']
}
