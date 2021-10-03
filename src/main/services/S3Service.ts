import S3 from 'aws-sdk/clients/s3';

export class S3Service {
    private client: S3

    constructor(private bucket) {
        this.client = new S3()
    }

    public async upload(_key: string, _data: any, _options: {
        contentType?: string
        contentEncoding?: string
    } = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: this.bucket,
                Key: _key,
                Metadata: {
                    mode: '33261',
                    gid: '33',
                    uid: '33'
                },
                Body: _data
            } as any

            if (_options.contentType) {
                params.ContentType = _options.contentType
            }

            if (_options.contentEncoding) {
                params.ContentEncoding = _options.contentEncoding
            }

            this.client.putObject(params, (err, data) => {
                if (err) {
                    console.log(_key, err)
                    reject(new Error(`S3 Error: ${err.message}`))
                }
                else {
                    resolve(data)
                }

            })
        })
    }
}