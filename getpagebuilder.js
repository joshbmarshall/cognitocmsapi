import { writeFile } from 'node:fs'
import axios from 'axios'
import { config } from '../src/config.js'

const data = await axios.post(`${config.prodURL}/api/v1/cognito/domain/initialData`, {
  config,
})

writeFile('./src/initialData.json', JSON.stringify(data.data), (err) => {
  if (err) {
    throw err
  }
})

const logo = await axios.get(`${config.baseURL}/cms/cognito/domain/favicon`, {
  responseType: 'arraybuffer', // Important
  headers: {
    'Content-Type': 'application/gzip',
  },
})

writeFile('./public/logo', logo.data, (err) => {
  if (err) {
    throw err
  }
})

writeFile('.graphqlrc', JSON.stringify({
  schema: `${config.baseURL}/graphql`,
}), (err) => {
  if (err) {
    throw err
  }
})
