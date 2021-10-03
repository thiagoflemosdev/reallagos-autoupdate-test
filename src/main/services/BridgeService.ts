import { BrowserWindow, dialog, ipcMain } from "electron"
import { IAppProcess } from "../interfaces/IAppProcess"
import { IPreloadFunctionInitActions } from "../interfaces/IPreloadFunctions"
import { ApiService } from "./ApiService.ts"
import { StorageService } from "./StorageService"
import { WatchFolderService } from "./WatchFolderService"




export class BridgeService {
    private event: Electron.IpcMainEvent
    private isLoading = false

    constructor(
        private readonly win: BrowserWindow,
        private readonly apiService: ApiService,
        private readonly storageService: StorageService,
        private readonly watchService: WatchFolderService
    ) {

    }

    public init() {
        ipcMain.on("init", (event, actions: IPreloadFunctionInitActions) => {
            this.event = event

            event.returnValue = {
                storage: this.storageService.storage,
                isLoading: this.isLoading
            }
        })

        ipcMain.on("auth", async (event, code) => {
            const data = await this.apiService.load("capture/auth", { code })

            this.storageService.storage.session_token = data.token
            this.storageService.storage.device_info = {
                uuid: data.info.uuid,
                description: data.info.description,
                client: {
                    uuid: data.info.client.uuid,
                    name: data.info.client.name,
                    cpf: data.info.client.cpf
                }
            }

            await this.storageService.save()

            this.dispatchUpdateIsLoadingAction(false)
            this.dispatchUpdateStorageAction()

        })

        ipcMain.on("updateUploadTimestamp", async (event, timestamp) => {
            await this.storageService.updateUploadDate(timestamp)
            this.watchService.restart(this.storageService.storage.settings.watchPaths)
        })

        ipcMain.on("updateWatchPaths", (event) => {
            this.selectAndSaveWatchPaths()
        })

        ipcMain.on("resetStorage", (event) => {
            this.storageService.reset()
        })
    }


    //Actions
    public dispatchUpdateStorageAction() {
        if (this.event) {
            this.event.reply('onUpdateStorage', this.storageService.storage)
        }
    }

    public dispatchUpdateProcessAction(process: IAppProcess, message?: string, isError?: boolean) {
        if (this.event) {
            this.event.reply('onUpdateProcess', process, message && { message, isError, timestamp: Date.now() })
        }
    }

    public dispatchUpdateIsLoadingAction(isLoading: boolean) {
        if (this.isLoading != isLoading) {
            this.isLoading = isLoading

            if (this.event) {
                this.event.reply('onUpdateIsLoading', this.isLoading)
            }
        }
    }
    public dispatchMessageAction(message: string, isError: boolean) {
        if (this.event) {
            this.event.reply('onMessage', message, isError)
        }
    }

    ///Private
    private async selectAndSaveWatchPaths() {
        const result = await dialog.showOpenDialog(this.win, {
            properties: ['openDirectory', 'multiSelections']
        })

        this.dispatchUpdateIsLoadingAction(true)

        this.storageService.storage.settings.watchPaths = result.filePaths
        await this.storageService.save()

        this.watchService.restart(result.filePaths)
    }
}