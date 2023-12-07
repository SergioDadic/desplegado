import axiosClient from "./AxiosClient";

export const axiosSetAveria = (body) => {
  /* */
  axiosClient.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        // method: "POST",
      };
      return config;
    },
    (error) => {
      Promise.reject(error.response.data);
    }
  );
  return axiosClient.post("back/api/v1/Averia/guardar", body);
};

export const axiosGetAveria = () => {
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
  return axiosClient.get("back/api/v1/Averia/leer");
};
