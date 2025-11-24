import axios from "axios";
const instance = axios.create({
  baseURL: `https://192.168.31.54:3000/api/v1`,
})

export default instance
