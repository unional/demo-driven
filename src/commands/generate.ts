import { getLogger } from 'aurelia-logging'

import { Command, parseCommand } from '../utils/command'
import { ProjectGenerator } from '../ProjectGenerator'

const log = getLogger('Generate Demo')

/**
 * Generates demo pages.
 */
export default async function generate(rawArgv: string[]) {
  const argv = parseCommand(rawArgv, command)
  const gen = new ProjectGenerator()
  gen.log = log
  try {
    if (argv._.length === 1)
      await gen.generate({ srcDir: argv._[0] })
    else
      await gen.generate()
  }
  catch (e) {
    log.error(e)
  }
}

export const command: Command = {
  name: 'generate',
  description: 'Generates demo pages',
  alias: ['gen', 'new'],
  arguments: [{
    name: 'srcDir'
  }]
}
