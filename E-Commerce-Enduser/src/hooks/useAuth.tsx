import { create } from 'zustand';
import { axiosClient } from '../library/axiosClient';
import { persist, createJSONStorage } from 'zustand/middleware';
import config from '../constants/config';
import { json } from 'stream/consumers';
import { saveProfile } from '../utils';
import { toast } from 'react-toastify';
import { User } from '../types/user.type';

interface FormData {
  email: string;
  password: string;
}
interface Auth {
  user: User | null;
  setUser: (user: User) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    error: string;
    user?: User;
  }>;
  logout: () => void;
}

const useAuth = create(
  persist<Auth>(
    (set) => ({
      user: null, //Lưu thông tin của user sau khi login thành công {id: 1, name: 'john'}
      setUser: (user: User) => {
        set({ user });
      },
      isLoading: false, // set trạng thái cho sự kiện login
      isAuthenticated: false, //trạng thái user đã login chưa
      login: async (email: string, password: string) => {
        try {
          //Khi nhấn nút login thì cập nhật trạng thái loading
          set({ isLoading: true });
          //dùng thư viện axiosClient để handle việc check, gửi và lưu token xuống localStorage
          const response = await axiosClient.post(config.urlAPI + '/api/v1/auth/login', { email, password });
          console.log('useAuth', response);
          //Check nếu login thành công
          if (response && response.status === 200) {
            localStorage.setItem('access_token', response.data.data.access_token);
            //Gọi tiếp API lấy thông tin User
            const data = await axiosClient.get(config.urlAPI + '/api/v1/auth/getProfile');
            console.log('dataUseAuth',data)
            toast.success(data.data.message);
            saveProfile(data.data.data)          
            set({ user: data.data.data, isLoading: false, isAuthenticated:true});
            //trả lại thông tin cho hàm login
            return { error: '', isLoading: false, user: data.data.data, isAuthenticated: true };
          }
          //Ngược lại thất bại
          else {
            set({ isLoading: false, isAuthenticated: false  });
            return { isAuthenticated: false, isLoading: false, error: 'Username or password is invalid' };
          }
        } catch (error) {
          //Gọi API lỗi
          console.log('login error', error);
          set({ isLoading: false ,  isAuthenticated:false});
          return { isAuthenticated: false, isLoading: false, error: 'Login failed' };
        }
      },
      logout: () => {
        // Xóa trạng thái user và isAuthenticated
        toast.success("See you again!")
        set({ user: null, isAuthenticated: false, isLoading: false  });
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useAuth;
