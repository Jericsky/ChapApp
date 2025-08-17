import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api', //local
    // baseURL: 'https://xwtbpx22ze.execute-api.us-east-1.amazonaws.com/dev/api', //aws lambda
    // baseURL: 'http://54.91.9.19:4000/api', // aws ec2
    
    withCredentials: true,
})