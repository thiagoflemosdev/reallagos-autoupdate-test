import accurateInterval from 'accurate-interval';
import AWS from "aws-sdk";
import { App, BrowserWindow } from "electron";
import { CLOCK_TIME, S3_KEY, S3_REGION, S3_SECRET } from "./config";
import { ApiService } from './services/ApiService.ts';
import { BridgeService } from './services/BridgeService';
import { StorageService } from "./services/StorageService";
import { WatchFolderService } from "./services/WatchFolderService";

export class AppEngine {
    public static win: BrowserWindow
    public static app: App
    public static storageService: StorageService
    public static bridgeService: BridgeService
    public static apiService: ApiService
    private static watchService: WatchFolderService

    public static async init(app: App, win: BrowserWindow) {
        AWS.config.update({ accessKeyId: S3_KEY, secretAccessKey: S3_SECRET, region: S3_REGION });

        this.app = app
        this.win = win
        this.watchService = new WatchFolderService()
        this.storageService = new StorageService()
        this.apiService = new ApiService(this.storageService)
        this.bridgeService = new BridgeService(win, this.apiService, this.storageService, this.watchService)

        await this.storageService.init()

        this.watchService.start(this.storageService.storage.settings.watchPaths)

        this.bridgeService.init()

        accurateInterval(() => { this.watchService.restart(this.storageService.storage.settings.watchPaths) }, CLOCK_TIME, { aligned: true });
    }
}