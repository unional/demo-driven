import fs = require('fs')
import path = require('path')

import { CONFIG_FILENAME } from './constants'
import {Generator} from './generator'

export interface Config {
  main: string,
  srcDir: string,
  outDir: string,
  templateFile?: string,
  generatorOptions: Generator.Options
}

export interface GeneratorConfig {
  generatorOptions: Generator.Options
}

export const defaultConfig: Config | GeneratorConfig = {
  main: 'index.md',
  srcDir: 'demo',
  outDir: 'demo',
  generatorOptions: Generator.defaultOptions
}

export function readConfig(src: string): Config {
  const configPath = path.resolve(src, CONFIG_FILENAME)

  return fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath).toString()) : defaultConfig
}

export function mergeConfig(config: any): Config {
  return {
    ...defaultConfig,
    ...config
  }
}
