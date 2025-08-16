import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
    // baseURL: 'https://xwtbpx22ze.execute-api.us-east-1.amazonaws.com/dev/api',
    
    withCredentials: true,
})