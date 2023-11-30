import axiosClient from "./AxiosClient";
import axios from 'axios';

export const axiosSetPedido = (body) => {
  /* */
  axiosClient.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        method: "POST",
      };
      return config;
    },
    (error) => {
      Promise.reject(error.response.data);
    }
  );
  return axiosClient.post("/api/v1/Pedido/guardar", body);
};

export const axiosGetPedido = () => {
  /*  */
  axiosClient.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        method: "GET",
      };
      return config;
    },
    (error) => {
      Promise.reject(error.response.data);
    }
  );
  return axiosClient.get("/api/v1/Pedido/leer");
};

export const axiosCargaMasivaPedidos = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post("api/v1/Pedido/CargaMasivaPedidos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const axiosSetCargaMasivaPedidos = (formData) => {
  /*  */
  axiosClient.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        method: "post",
      };  
      return config;
    },
    (error) => {
      Promise.reject(error.response.data);
    }
  );
  return axiosClient.post("api/v1/Pedido/CargaMasivaPedidos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
