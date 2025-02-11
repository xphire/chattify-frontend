import axios from 'axios'


export const axiosInstance = axios.create({
    baseURL : 'http://localhost:3000/api/1.0',
    withCredentials : true

})