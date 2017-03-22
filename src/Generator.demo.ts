import { Generator } from './index'

export async function workWithoutYaml(t) {
  const generator = new Generator()
  const rejected = await t.throws(generator.generatePage({
    name: 'demo',
    content: '# first header'
  }))
  t.is(rejected.message, 'missing yaml section')
}
