import fs = require('mz/fs')
import path = require('path')
import recursive = require('recursive-readdir')

import { getLogger } from 'aurelia-logging'
import { CONFIG_FILENAME } from './constants'

import { defaultConfig } from './config'

export interface File {
  path: string,
  content: string
}

export class ProjectLoader {
  projectRoot: string
  entryFile: string
  markdownFiles: File[]
  async load(src: string) {
    if (!fs.existsSync(src))
      throw Error(`'${src}' is not a directory.`)
    const fullPath = path.resolve(src)
    if (!isDirectory(fullPath))
      throw Error('Only support directory')

    await this.loadFromDirectory(fullPath)
  }

  private async loadFromDirectory(root: string) {
    const config = getConfig(root)
    this.projectRoot = path.resolve(root, config.srcRoot)
    this.entryFile = config.main
    const entryPath = path.resolve(this.projectRoot, this.entryFile)
    if (!fs.existsSync(entryPath)) {
      throw Error(`Main file not found '${entryPath}'`)
    }
    const filepaths = await readAllFiles(this.projectRoot)
    const mdFilepaths = filepaths.filter(filepath => path.extname(filepath) === '.md')
    this.markdownFiles = mdFilepaths.map(path => {
      return {
        path,
        content: fs.readFileSync(path).toString()
      }
    })
  }
}

const logger = getLogger('generatorSuite')

function readAllFiles(path) {
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
function findAllMarkdownFiles(path) {
  const entries = fs.readdirSync(path)
  return entries.filter(e => fs.statSync(e).isFile() && e.endsWith('.md'))
}
function getConfig(src) {
  const configPath = path.resolve(src, CONFIG_FILENAME)
  return fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath).toString()) : defaultConfig
}
function foundEntryPoint(dir) {
  return fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.md'))
}

/**
 * @error Throws ENOENT if `src` does not exist.
 */
export async function generateSuite(src = '.', dest = '.') {
  const srcPath = path.resolve(src)
  if (!fs.existsSync(srcPath)) {
    throw Error(`ENOENT: no such file or directory, '${srcPath}'`)
  }
  if (isDirectory(srcPath)) {
    const config = getConfig(srcPath)
    const srcRoot = path.resolve(srcPath, config.srcRoot)
    if (!foundEntryPoint(srcRoot)) {
      throw Error(`ENOENT: no such file or directory, '${path.resolve(srcRoot, 'index.md')}'`)
    }

    const files = findAllMarkdownFiles(config.srcRoot)
    if (files.indexOf('index.md') === 0) {
      console.log('srcroot', srcRoot)
    }
  }
  else {
    await generateSinglePage(srcPath, dest)
  }
  console.log(fs.existsSync(srcPath))

  logger.debug(`src: ${src}`, `dest: ${dest}`, 'options:')
  logger.debug(`__dirname: ${__dirname}`, `cwd: ${process.cwd()}`)

  // Will throw ENOENT
  // const srcFilePath = getSourcePath(src)
  // const destFilePath = getDestPath(dest)
  // const text = (await fs.readFile(srcFilePath)).toString()
  // const html = generate(text)
}

function generateSinglePage(_src, _dest) {
  return
}
