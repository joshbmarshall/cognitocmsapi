import { writeFile } from 'node:fs'
import axios from 'axios'
import { config } from '../src/config.js'

const data = await axios.post(`${config.baseURL}/api/v1/cognito/domain/initialData`, {
  config,
})
writeFile('./src/initialData.json', JSON.stringify(data.data), (err) => {
  if (err) {
    throw err
  }
})
