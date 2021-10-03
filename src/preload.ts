import { contextBridge, ipcRenderer } from "electron";
import { IPreloadFunctionInitActions, IPreloadFunctions } from "./main/interfaces/IPreloadFunctions";




contextBridge.exposeInMainWorld("api", {
    init: (actions: IPreloadFunctionInitActions) => {
        ipcRenderer.on('onUpdateStorage', (event, storage) => actions.onUpdateStorage(storage))
        ipcRenderer.on('onUpdateProcess', (event, process, message) => actions.onUpdateProcess(process, message))
        ipcRenderer.on('onUpdateIsLoading', (event, isLoading) => actions.onUpdateIsLoading(isLoading))
        ipcRenderer.on('onMessage', (event, message, isError) => actions.onMessage(message, isError))
        return ipcRenderer.sendSync('init')
    },
    auth: (code: string) => { ipcRenderer.send("auth", code) },
    updateUploadTimestamp: (timestamp: string) => { ipcRenderer.send("updateUploadTimestamp", timestamp) },
    updateWatchPaths: () => ipcRenderer.send("updateWatchPaths"),
    resetStorage: () => ipcRenderer.send("resetStorage")
} as IPreloadFunctions)
