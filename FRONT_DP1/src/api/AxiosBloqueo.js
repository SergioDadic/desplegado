import axiosClient from "./AxiosClient";
import axios from 'axios';

export const axiosSetBloqueo = (body) => {
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
  return axiosClient.post("/api/v1/Bloqueo/guardar", body);
};

export const axiosGetBloqueo = () => {
  /* */
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
  return axiosClient.get("/api/v1/Bloqueo/leer");
};

export const axiosCargaMasivaBloqueos = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post("/api/v1/Bloqueo/CargaMasivaBloqueos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const axiosGetListaBloqueos = (fechaInicio,fechaFin) => {
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
  return axiosClient.get(`/api/v1/Bloqueo/listarBloqueosPorFechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
};

// export const axiosSetCargaMasivaBloqueos = (formData) => {
//   /*  */
//   axiosClient.interceptors.request.use(
//     async (config) => {
//       config.headers = {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         method: "post",
//       };
//       return config;
//     },
//     (error) => {
//       Promise.reject(error.response.data);
//     }
//   );
//   return axiosClient.post("back/api/v1/Bloqueo/CargaMasivaBloqueos", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };
