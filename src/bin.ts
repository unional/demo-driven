#!/usr/bin/env node

import { addAppender, getLogger, setLevel, logLevel } from 'aurelia-logging'
import { ColorAppender } from 'aurelia-logging-color'
import program = require('commander')
import fs = require('fs')
import path = require('path')

const log = getLogger('demogen')
addAppender(new ColorAppender())

const pjson = JSON.parse(fs.readFileSync(path.resolve('../../package.json')).toString())

program
  .version(pjson.version)
  .usage('[options] [source] [destination]')
  .option('-s, --single', 'generate single file')
  .option('--verbose', 'print verbose messages')
  .option('--debug', 'print debug messages')
  .parse(process.argv)

const [src, dest] = program.args
const { single, debug, verbose } = program
const options = { single, debug, verbose }

if (debug) {
  setLevel(logLevel.debug)
}
else if (verbose) {
  setLevel(logLevel.info)
}
else {
  setLevel(logLevel.warn)
}

log.debug(`src: ${src}, dest: ${dest}`)
log.debug('options', options)

// generate(src, dest, options)
