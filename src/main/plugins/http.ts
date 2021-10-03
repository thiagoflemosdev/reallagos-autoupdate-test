import Axios from 'axios'

export const get = async (url: string, params = {}, headers = {}, options = {}): Promise<any> => {
    return await Axios.get(url, Object.assign({ params, headers }, options))
}

export const post = async (url: string, data: any, headers = {}, options = {}): Promise<any> => {
    return await Axios.post(url, data, Object.assign({ headers }, options))
}

export const patch = async (url: string, data: any, headers = {}, options = {}): Promise<any> => {
    return await Axios.patch(url, data, Object.assign({ headers }, options))
}

export const put = async (url: string, data: any, headers = {}, options = {}): Promise<any> => {
    return await Axios.put(url, data, Object.assign({ headers }, options))
}