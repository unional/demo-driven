import fs = require('fs')
import path = require('path')

import { CONFIG_FILENAME } from './constants'
import { generate } from './generate'

export interface Config extends generate.Options {
  main: string,
  srcDir: string,
  outDir: string,
  templateFile?: string
}

export const defaultConfig: Config = {
  main: 'index.md',
  srcDir: 'demo',
  outDir: 'demo'
}

export function getConfig(src: string): Config {
  const configPath = path.resolve(src, CONFIG_FILENAME)
  return fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath).toString()) : defaultConfig
}

export function mergeConfig(config: Partial<Config>): Config {
  return {
    ...defaultConfig,
    ...config
  }
}
