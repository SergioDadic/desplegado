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
  return axiosClient.get(`/back/api/v1/simulacion/genetico/iniciacion?durarion=${duracion}&fechaInicio=${fechaInicio}`);
};

export const axiosGetListaVehiculos = (limit,minutos,continuidad) => {
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
    return axiosClient.get(`/back/api/v1/simulacion/listarVehiculosFiltrado?limit=${limit}&minutos=${minutos}&continuidad=${continuidad}`);
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
    return axiosClient.get("/back/api/v1/simulacion/listarPedidosSeleccionados");
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
    return axiosClient.get("/back/api/v1/simulacion/listarVehiculosDisponibles");
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
    return axiosClient.get(`/back/api/v1/simulacion/listarVehiculosSeleccionados?tipo=${tipo}`);
  };

  export const axiosSetFlota = (body) => {
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
    return axiosClient.post("/back/api/v1/simulacion/inicializarVehiculos", body);
  };