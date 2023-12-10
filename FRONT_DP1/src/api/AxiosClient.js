import axios from 'axios';

const axiosClient = axios.create({
      // "proxy": "http://localhost:8080", esto estaba en el package.json
    
    // baseURL: `http://localhost:8080`,
    baseURL: `${process.env.REACT_APP_API_URL}`,
    withCredentials: false,
    responseType: "json",
    crossDomain: true,
    // withCredentials:false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
});

export default axiosClient;