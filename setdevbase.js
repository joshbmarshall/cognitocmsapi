import { existsSync, writeFile } from 'node:fs'

const devfile = './devbase.js'
if (!existsSync(devfile)) {
  writeFile(devfile, 'export const devbase = \'\'', (err) => {
    if (err) {
      throw err
    }
  })
}
