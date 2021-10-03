import { AppEngine } from '../AppEngine'
import { BASE_API } from '../config'
import { IApiResult } from '../interfaces/IApiResult'
import { post } from '../plugins/http'
import { StorageService } from './StorageService'

export class ApiService {
    constructor(
        private readonly storageService: StorageService
    ) {
    }

    public async load(action: string, body: any = {}) {
        try {
            AppEngine.bridgeService.dispatchUpdateIsLoadingAction(true)

            const result = await post(`${BASE_API}/${action}`, body, {
                'Content-Type': 'application/json',
                'session-token': this.storageService.storage.session_token
            })

            return await this.handleResult(result.data)
        }
        catch (e) {
            AppEngine.bridgeService.dispatchUpdateIsLoadingAction(false)
            AppEngine.bridgeService.dispatchMessageAction(e.message, true)
            return null
        }
    }

    public handleResult(result: IApiResult): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                if (result.status == 200) {
                    resolve(result.data || {})
                }
                else {
                    console.error(result.message, result)
                    reject(new Error(result.message))
                }

            } catch (e) {
                reject(e)
            }
        })
    }
}
