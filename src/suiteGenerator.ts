import { getLogger } from 'aurelia-logging'
import fs = require('mz/fs')
import path = require('path')

import { generate } from './generate'

export const defaultOptions = {
  single: false
}

const logger = getLogger('generatorSuite')

/**
 * @error Throws ENOENT if `src` does not exist.
 */
export async function generateSuite(src = '.', dest = '.', options = defaultOptions) {
  logger.debug(`src: ${src}`, `dest: ${dest}`, 'options:', options)
  logger.debug(`__dirname: ${__dirname}`, `cwd: ${process.cwd()}`)

  // Will throw ENOENT
  const srcFilePath = getSourcePath(src)
  const destFilePath = getDestPath(dest)
  console.log('dest', destFilePath)
  const text = (await fs.readFile(srcFilePath)).toString()
  console.log('content', text)
  const html = generate(text)
  console.log('html', html)
}

function getSourcePath(src) {
  let stat = fs.lstatSync(src)
  return stat.isDirectory() ? path.resolve(src, 'demo.md') : src
}

function getDestPath(dest) {
  return path.resolve(dest, 'demo.html')
}
