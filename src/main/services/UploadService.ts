import fs from 'fs'
import path from 'path'
import { AppEngine } from "../AppEngine"
import { S3_BUCKET, S3_PREFIX, UPLOAD_CHUNK_SIZE, UPLOAD_DELAY } from "../config"
import { isOnline } from "../helpers/isOnline"
import { IUploadPooltem } from '../interfaces/IUploadPooltem'
import { S3Service } from "./S3Service"

const TIME_WEIGHT = 1

export class UploadService {
    private s3 = new S3Service(S3_BUCKET)
    private pool: IUploadPooltem[] = []
    private uploading: number

    public addFileToPool(item: IUploadPooltem) {
        if (!this.pool.find(v => item.path == v.path)) {
            this.pool.push(item)
            AppEngine.bridgeService.dispatchUpdateProcessAction({ uploadQueue: this.pool.length, uploading: this.uploading })

            if (this.pool.length == 1) {
                setTimeout(async () => {
                    this.sortPool()
                    const total = Math.min(this.pool.length, UPLOAD_CHUNK_SIZE)
                    this.upload(total)
                }, UPLOAD_DELAY)
            }
        }
    }

    private async upload(total: number) {
        try {
            this.uploading = total
            AppEngine.bridgeService.dispatchUpdateProcessAction({ uploadQueue: this.pool.length, uploading: this.uploading })

            
            console.log(`uploading ${total} files`)

            if (await isOnline()) {

                const { uploaded, ignored } = await this.uploadProcess(total)

                const uploadDate = this.pool[total - 1].date
                uploadDate.setTime(uploadDate.getTime()  +  (this.pool.length ? TIME_WEIGHT : -TIME_WEIGHT) )
                await AppEngine.storageService.updateUploadDate(uploadDate.toISOString())

                const message = ignored ? `${uploaded} files sucessfuly uploaded and ${ignored} ignored...` : `${uploaded} files sucessfuly uploaded...`

                this.pool.splice(0, total)
                AppEngine.bridgeService.dispatchUpdateProcessAction({ uploadQueue: this.pool.length, uploading: this.uploading = 0 }, message)
                this.next()
            }
            else {
                const message = `no internet connection aborting...`
                console.log(message)
                AppEngine.bridgeService.dispatchUpdateProcessAction({ uploadQueue: this.pool.length, uploading: this.uploading = 0 }, message, true)
                this.next()
            }

        }
        catch (e) {
            console.log(`error uploading ${total} files... Trying again`)
            AppEngine.bridgeService.dispatchUpdateProcessAction({ uploadQueue: this.pool.length, uploading: this.uploading }, e.message, true)

            this.upload(total)
        }
    }

    private async uploadProcess(total: number) {
        let uploaded = 0
        let ignored = 0

        const promises = []

        for (let i = 0; i < total; i++) {
            promises.push(new Promise<void>(async (resolve, reject) => {
                try {
                    const item = this.pool[i]

                    if (fs.existsSync(item.path) && path.extname(item.path).toLowerCase() == ".xml") {
                        const data = fs.readFileSync(item.path, 'utf8')
                        const key = `${S3_PREFIX}${path.basename(item.path)}`

                        await this.s3.upload(key, data)
                        uploaded++
                    }
                    else {
                        ignored++
                    }

                    resolve()
                }
                catch (e) {
                    console.log(`error on ${path}`, e)
                    reject(e)
                }
            }))
        }

        await Promise.all(promises)

        return { uploaded, ignored }
    }

    private async next() {
        if (this.pool.length) {
            this.upload(Math.min(this.pool.length, UPLOAD_CHUNK_SIZE))
        }
    }

    private sortPool() {
        this.pool.sort((a, b) => {
            const timeA = a.date.getTime()
            const timeB = b.date.getTime()

            if (timeA > timeB) return 1
            else if (timeA < timeB) return -1
            return 0
        })
    }
}