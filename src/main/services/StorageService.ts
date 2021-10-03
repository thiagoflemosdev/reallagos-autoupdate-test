import { IAppStorage } from "../interfaces/IAppStorage";
import electronStorage from 'electron-storage';
import { STORAGE_VERSION } from "../config";
import { AppEngine } from "../AppEngine";
import { getNowAsIso } from "../helpers/getNowAsIso";

const DATA_PATH = "reallagos/storage.json"
const DATA_BACKUP_PATH = "reallagos/storage_bk.json"
const VERSION_PATH = "reallagos/version.json"

export class StorageService {
    public storage: IAppStorage

    public async init() {
        const version = await electronStorage.isPathExists(VERSION_PATH) && await electronStorage.get(VERSION_PATH)

        if (version == STORAGE_VERSION && await electronStorage.isPathExists(DATA_PATH)) {
            try {
                this.storage = await electronStorage.get(DATA_PATH)
            }
            catch (e) {
                this.storage = await electronStorage.get(DATA_BACKUP_PATH)
                await this.persistStorage()
            }
        }
        else {
            await this.createNewStorage()
        }
    }


    private async createNewStorage() {
        console.log("Creating new storage")

        this.storage = {
            upload_timestamp: null,
            device_info: null,
            session_token: null,
            settings: {
                timestamp: getNowAsIso(),
                watchPaths: [

                ]
            }
        }

        await this.persistStorage()
        await electronStorage.set(VERSION_PATH, STORAGE_VERSION)
    }

    public async reset() {
        this.createNewStorage()

        AppEngine.bridgeService.dispatchUpdateStorageAction()
    }

    public async save() {
        await this.persistStorage()

        AppEngine.bridgeService.dispatchUpdateStorageAction()
    }

    public async updateUploadDate(timestamp: string) {
        console.log(">>>>>>>>", timestamp)
        this.storage.upload_timestamp = timestamp

        await this.save()
    }

    public getUploadDate() {
        return this.storage.upload_timestamp && new Date(this.storage.upload_timestamp)
    }

    private async persistStorage() {
        await electronStorage.set(DATA_PATH, this.storage)
        await electronStorage.set(DATA_BACKUP_PATH, this.storage)
    }
}