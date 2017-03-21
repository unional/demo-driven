import { getLogger } from 'aurelia-logging'

import { Command } from '../utils/command'
import { ProjectGenerator } from '../ProjectGenerator'

const log = getLogger('Generate Demo')

/**
 * Generates demo pages.
 */
export default async function generate(_rawArgv: string[]) {
  const gen = new ProjectGenerator()
  gen.log = log
  try {
    await gen.generate()
  }
  catch (e) {
    log.error(e)
  }
}

export const command: Command = {
  name: 'generate',
  description: 'Generates demo pages',
  alias: ['gen', 'new']
}
