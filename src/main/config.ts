import isDev from 'electron-is-dev';

export const S3_KEY = "AKIA44JMZ63MQZF4K3U5"
export const S3_SECRET = "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"
export const S3_REGION = "us-east-1"
// export const S3_BUCKET = isDev ? "dev-reallagos-nfe-temp" : "reallagos-nfe-temp"
// export const S3_BUCKET = "dev-reallagos-nfe-temp"
export const S3_BUCKET = "new-nfe-capture"
export const S3_PREFIX = "testing/"
export const STORAGE_VERSION = 6
export const UPLOAD_DELAY = 3000
export const CLOCK_TIME = 3600000 //1 hour
export const UPLOAD_CHUNK_SIZE = 500
export const BASE_API = "https://admin.api.alpha.reallagos.com.br"