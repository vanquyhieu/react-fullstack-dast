import { axiosClient } from "../library/axiosClient.ts";
import { SuccessResponseApi } from "../types/util.type.ts";
import { User } from "../utils";

interface BodyUpdateProfile
    extends Omit<
        User,
        '_id' | 'roles' | 'createdAt' | 'updatedAt' | '__v' | 'email'
    > {
    password?: string;
    newPassword?: string;
}

const userService = {
    // getProfile() {
    //     return axiosClient.get<SuccessResponseApi<User>>('/api/v1/auth/profileClient');
    // },
    updateProfile(body: BodyUpdateProfile) {
        return axiosClient.put<SuccessResponseApi<User>>('user', body);
    },
    uploadAvatar(body: FormData) {
        return axiosClient.post<SuccessResponseApi<string>>(
            'user/upload-avatar',
            body,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
    },
};

export default userService;
