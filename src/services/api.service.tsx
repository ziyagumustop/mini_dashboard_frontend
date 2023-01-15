import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

export const apiService = axios.create();

// export interface AxiosErrorInterface { response: { data: { message: string } } }