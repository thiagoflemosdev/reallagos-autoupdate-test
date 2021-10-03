
import chokidar from "chokidar";
import { AppEngine } from "../AppEngine";
import { UploadService } from "./UploadService";


export class WatchFolderService {
    private watcher: chokidar.FSWatcher
    private uploader = new UploadService()

    constructor() {

    }

    public start(paths: string[]) {
        if (paths.length && AppEngine.storageService.getUploadDate()) {
            AppEngine.bridgeService.dispatchUpdateIsLoadingAction(true)

            this.watcher = chokidar.watch(paths, {
                ignored: /[\/\\]\./,
                awaitWriteFinish: true,
                persistent: true
            });

            this.watcher.on('add', this.readFile)
            this.watcher.on('change', this.readFile)
            this.watcher.on('ready', this.ready)
        }
        else {
            this.ready()
        }

    }
    //2021-09-26T14:18:36.764Z
    public restart(paths) {
        if (this.watcher) {
            console.log("restarting watch service...")

            this.watcher.unwatch('add')
            this.watcher.unwatch('change')
            this.watcher.close()

            this.start(paths)
        }
        else {
            this.start(paths)
        }
    }

    private ready = () => {
        AppEngine.bridgeService.dispatchUpdateIsLoadingAction(false)
    }

    private readFile = (path: string, fileMetadata: any) => {
        const uploadDate = AppEngine.storageService.getUploadDate()

        const mfileDate = new Date(fileMetadata.mtime)
        const cfileDate = new Date(fileMetadata.birthtime)
        const fileDate = mfileDate.getTime() > cfileDate.getTime() ? mfileDate : cfileDate

        if (fileDate.getTime() > uploadDate.getTime()) {
            this.uploader.addFileToPool({ path, date: fileDate })
        }
    }
}