import axios, { type AxiosInstance } from "axios"

const API_BASE_URL = "http://localhost:8000/api"

export const createApiClient = (): AxiosInstance => {
    const apiClient = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 120000,
    })




    apiClient.interceptors.request.use(
        (config) => {
            console.log(`Request to ${config.url}`)
            return config
        },// @ts-ignore
        (error) => Promise.reject(error)
    )

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("API Error:", error)
            // @ts-ignore
            return Promise.reject(error)
        }
    )

    return apiClient
}

const apiClient = createApiClient()
export default apiClient