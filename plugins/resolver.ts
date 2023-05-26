import path from 'node:path'
import fg from 'fast-glob'

function cgnResolver(name: string) {
  if (name.startsWith('Cgn')) {
    const componentName = name.slice(3)
    const rootdir = path.resolve(__dirname, '..', 'Components')

    const files = fg.sync(['**.vue'], {
      onlyFiles: true,
      cwd: rootdir,
      absolute: false,
    }).map((e) => {
      const component = e.replace(/\.[^/.]+$/, '').split('/').join('')
      return {
        file: e,
        component,
      }
    })
    const componentFile = files.find(e => e.component == componentName)?.file
    if (componentFile) {
      return `~cognito/Components/${componentFile}`
    }
  }
}
export { cgnResolver }
