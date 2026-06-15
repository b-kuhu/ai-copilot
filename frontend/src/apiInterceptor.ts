import axios from 'axios';

const server = "http://localhost:4000";

const api = axios.create({
    baseURL: server,
    withCredentials: true,
})

let isRefreshing = false; // refresh token endpoint is being called when true
let failedQueue: any[] = []; // all the requests/apis that failed due to access token expired. using this we can call again those apis that failed after getting new access token


const processQueue = (error: any | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if(error){
            prom.reject(error);
        }
        else {
            prom.resolve(token)
        }
    })
    failedQueue = []; // no request pending to process
}

api.interceptors.response.use(
    (response) => response, // if response is successful, return the response as it is
    async(error) => {
        const originalRequest = error.config; // the request that failed due to access token expired (contains header, configuration, url, method, data)
        if(error.response?.status === 403 && !originalRequest._retry) {
            if(isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({resolve, reject})
                }).then(() => {
                    return api(originalRequest);
                })
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try{
                await api.post('api/v1/refresh')
                processQueue(null)
                return api(originalRequest);
            }catch(err) {   
                processQueue(err, null)
                return Promise.reject(err);
            }finally{
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;