import { User } from './user.type';
import { SuccessResponseApi } from './util.type.ts';

export interface data {
    access_token: string;
    refreshtoken: string;
    user: User;
}

export type AuthResponse = SuccessResponseApi<data>;
