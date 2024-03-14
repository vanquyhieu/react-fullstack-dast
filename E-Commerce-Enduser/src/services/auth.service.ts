

import { path } from "../constants";
import { axiosClient } from "../library/axiosClient";
import { AuthResponse } from "../types/auth.type";
import httpRequest from "../utils/http";

const authService = {
    register: (body: { email: string; password: string }) => {
        return httpRequest.post<AuthResponse>(path.register, body);
    },
    login: (body:{ email: string; password: string }) => {
        return axiosClient.post(`/api/v1/auth/login`, body);
    },
    logout: async() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('cart-storage');
    },
};

export default authService;
