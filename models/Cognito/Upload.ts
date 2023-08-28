import * as tus from 'tus-js-client'
import { nanoid } from 'nanoid'
import { config } from '~/config'

class CognitoUpload {
  uuid: string
  file: any
  uploadthumb: string
  uploadProgress: number
  is_completed: boolean
  filename: string

  constructor(source?: Partial<CognitoUpload>) {
    this.file = null
    this.uuid = nanoid()
    this.uploadthumb = ''
    this.uploadProgress = 0
    this.is_completed = false
    this.filename = ''
    Object.assign(this, source)
  }

  startUpload() {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target?.result) {
        return
      }
      this.uploadthumb = e.target.result.toString()

      // Create a new tus upload
      const upload = new tus.Upload(this.file, {
        // Endpoint is the upload creation URL from your tus server
        endpoint: `${config.baseURL}/cms/cognito/tus`,
        // Retry delays will enable tus-js-client to automatically retry on errors
        retryDelays: [0, 3000, 5000, 10000, 20000],
        // Attach additional meta data about the file for the server
        metadata: {
          // filename: file.name,
          filename: this.uuid,
          filetype: this.file.type,
        },
        // Upload again if asked to
        removeFingerprintOnSuccess: true,
        // Callback for errors which cannot be fixed using retries
        onError: (error) => {
          console.log(`Failed because: ${error}`)
          this.is_completed = false
        },
        // Callback for reporting upload progress
        onProgress: (bytesUploaded, bytesTotal) => {
          this.uploadProgress = Math.round(bytesUploaded / bytesTotal * 100)
          this.is_completed = false
        },
        // Callback for once the upload is completed
        onSuccess: () => {
          this.filename = upload.file.name
          setTimeout(() => {
            this.uploadProgress = 0
            this.is_completed = true
          }, 1000)
        },
      })

      // Start the upload
      upload.start()
    }
    reader.readAsDataURL(this.file)
  }
}
export { CognitoUpload }
