import axiosClient from "./AxiosClient";

export const axiosInicializaSimulacion = (duracion,fechaInicio) => {
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
  return axiosClient.get(`/api/v1/simulacion/genetico/iniciacion?durarion=${duracion}&fechaInicio=${fechaInicio}`);
};

export const axiosGetListaVehiculos = (limit,minutos) => {
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
    return axiosClient.get(`/api/v1/simulacion/listarVehiculos?limit=${limit}&minutos=${minutos}`);
  };

  export const axiosGetPedidosSeleccionados = () => {
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
    return axiosClient.get("/api/v1/simulacion/listarPedidosSeleccionados");
  };

  export const axiosGetVehiculosDisponibles = () => {
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
    return axiosClient.get("/api/v1/simulacion/listarVehiculosDisponibles");
  };
    

  export const axiosGetListaVehiculosSeleccionados = (tipo) => {
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
    return axiosClient.get(`/api/v1/simulacion/listarVehiculosSeleccionados?tipo=${tipo}`);
  };