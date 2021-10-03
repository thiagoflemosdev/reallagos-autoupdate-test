export interface IApiResult {
    status: number
    code: number
    message?: string
    title?: string
    data?: any
    meta?: any
}