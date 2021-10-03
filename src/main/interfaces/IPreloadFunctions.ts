import { IAppProcess } from "./IAppProcess";
import { IAppProcessLog } from "./IAppProcessLog";
import { IAppStorage } from "./IAppStorage";

export interface IPreloadFunctions {
    init: (actions: IPreloadFunctionInitActions) => {
        isLoading: boolean,
        storage: IAppStorage
    },
    auth: (code: string) => void,
    updateUploadTimestamp: (timestamp: string) => void,
    updateWatchPaths: () => void
    resetStorage: () => void
}

export interface IPreloadFunctionInitActions {
    onUpdateStorage?: (storage: IAppStorage) => void,
    onUpdateProcess?: (process: IAppProcess, log?: IAppProcessLog) => void,
    onUpdateIsLoading?: (isLoading: boolean) => void,
    onMessage?: (message: string, isError: boolean) => void

}