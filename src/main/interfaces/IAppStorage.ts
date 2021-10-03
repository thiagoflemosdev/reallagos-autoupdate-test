export interface IAppStorage {
    upload_timestamp: string,
    session_token: string,
    device_info: {
        uuid: string,
        description: string,
        client: {
            uuid: string,
            name: string,
            cpf: string
        }
    }
    settings: {
        timestamp: string,
        watchPaths: string[]
    }
}