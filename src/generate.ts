import * as showdown from 'showdown'
import * as fs from 'fs'

import { getLogger } from 'aurelia-logging'

const logger = getLogger('generate')

export const defaultOptions = {
  single: false
}

/**
 * @error Throws ENOENT if `src` does not exist.
 */
export function generate(src = '.', dest = '.', options = defaultOptions) {
  logger.debug(`src: ${src}`, `dest: ${dest}`, 'options:', options)
  logger.debug(`__dirname: ${__dirname}`, `cwd: ${process.cwd()}`)
  // Will throw ENOENT
  let stat = fs.lstatSync(src)

}
