
import axios from "axios";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, // ignore self-signed certificate
});

const instance = axios.create({
  baseURL: "https://192.168.31.54:3000/api/v1",
  httpsAgent: agent,
});

export default instance;

