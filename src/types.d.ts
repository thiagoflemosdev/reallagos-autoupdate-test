import { IPreloadFunctions } from "./main/interfaces/IPreloadFunctions";

declare global {
    interface Window {
        api: IPreloadFunctions;
    }
}