import axios from 'axios';
import { REACT_APP_API_URL } from '../constants';

export const axiosCliente = () => {
    return axios.create({
        baseURL: REACT_APP_API_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
};

