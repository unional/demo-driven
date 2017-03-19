import remark = require('remark')
import lint = require('remark-lint')

import { Page } from './interfaces'
import { page } from './remarkPlugins'

export async function generate(text: string, options?) {
  return new Promise<string>((resolve, reject) => {
    remark().use(lint).use(page, options).process(text, (err, file) => {
      if (err)
        reject(err)
      else
        resolve(String(file))
    })
  })
}
