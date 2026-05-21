import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chatly-fm17.onrender.com",
  withCredentials: true, // if using cookies / JWT
});

export default  axiosInstance;
