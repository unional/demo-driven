import toHtml = require('hast-util-to-html')
import h = require('hastscript')
import yaml = require('js-yaml')
import toHAST = require('mdast-util-to-hast')
// import find = require('unist-util-find')
import visit = require('unist-util-visit')

export function codeMirrorify(hast) {

  visit(hast, 'element', (node, index, parent) => {
    if (isCodeNode(node)) {
      parent.children[index] = createCodeMirrorNode(node)
    }
  })
}

function isCodeNode(node) {
  return node.tagName === 'pre' &&
    node.children.length === 1 &&
    node.children[0].tagName === 'code'
}
function createCodeMirrorNode(node) {
  // console.log(node)
  return node
}

class PageCompiler {
  private ast
  private options
  private hast
  private headerYaml
  private file
  compile(ast, file, options) {
    this.ast = ast
    this.file = file
    this.options = options
    this.parse()
    this.analyze()
    // this.optimize()
    this.transform()
    return toHtml(this.hast)
  }
  private parse() {
    this.headerYaml = extractYaml(this.ast)
    this.hast = toHAST(this.ast)
    codeMirrorify(this.hast)
  }
  private analyze() {
    if (this.options.yamlRequired && !this.headerYaml) {
      this.file.fail('missing yaml section', this.ast)
    }
  }
  private transform() {
    if (this.headerYaml) {
      const header = createHeader(this.headerYaml, this.options)
      this.hast.children.unshift(header)
    }
  }
}

export function page(options: page.Options = page.defaultOptions) {
  const c = new PageCompiler()
  this.Compiler = function compiler(ast, file) {
    return c.compile(ast, file, options)
  }
}
export namespace page {
  export const defaultOptions: Options = {
    yamlRequired: false
  }
  export interface Page {
    name: string,
    content: string
  }
  export interface Options {
    yamlRequired?: boolean
    title?: YamlNodeOptions
    subTitle?: YamlNodeOptions,
    links?: YamlNodeOptions
  }
  export interface YamlNodeOptions {
    class: string
  }
}

function extractYaml(tree) {
  let json
  visit(tree, 'yaml', node => {
    json = yaml.safeLoad(node.value)
  })
  return json
}
function createHeader(yaml, options) {
  const { title, subTitle, links } = yaml
  const children: any[] = []
  if (title) {
    children.push(h(createSelector('', options['title']), [title]))
  }
  if (subTitle) {
    children.push(h(createSelector('', options['subTitle']), [subTitle]))
  }
  if (links) {
    for (let key in links) {
      let href = links[key]
      if (href.slice(-3) === '.md') {
        href = href.slice(0, -3) + '.html'
      }
      children.push(h(createSelector('a', options['links']), { href }, [key]))
    }
  }

  return h('header', children)
}
function createSelector(name: string, options: page.YamlNodeOptions) {
  let selector = name
  if (options && options.class) {
    selector += '.' + options.class
  }

  return selector
}
