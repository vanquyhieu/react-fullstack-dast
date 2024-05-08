import getSchema from "../utils/schema";
import * as Yup from 'yup';

// Assuming FormData is defined somewhere in your codebase
interface FormData {
  email?: string;
  password?: string;
  confirmPassword?: string; // Making confirmPassword optional as it's not always present
}

function useSchemaValidate(type: 'login' | 'register' | 'priceMinMax') {
    const registerSchema = getSchema().pick([
        'email',
        'password',
        'confirmPassword',
    ]) as Yup.ObjectSchema<Partial<FormData>>; // Adjusted to match the expected type

    const loginSchema = registerSchema.pick(['email', 'password']);

    const priceMinMaxSchema = getSchema().pick(['price_min', 'price_max']);

    switch (type) {
        case 'login':
            return loginSchema;
        case 'register':
            return registerSchema;
        case 'priceMinMax':
            return priceMinMaxSchema;
        default:
            break;
    }
}

export default useSchemaValidate;
