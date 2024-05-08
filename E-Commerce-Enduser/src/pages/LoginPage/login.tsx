import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSchemaValidate } from '../../hooks';
import { authService } from '../../services';
import { toast } from 'react-toastify';
import { isAxiosUnprocessableEntityError, saveAccessToken } from '../../utils';
import { ErrorResponseApi } from '../../types/util.type.ts';
import InputField from '../../components/shared/InputField.tsx';
import Button from '../../components/shared/Button.tsx';
import useAuth from '../../hooks/useAuth.tsx';
import { ObjectSchema } from 'yup';


interface FormData {
  email?: string; // Make email and password optional
  password?: string;
}
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => {
      return login(body.email||'', body.password||'');
    },
  });

  const schema = useSchemaValidate('login') as Yup.ObjectSchema<Partial<FormData>>;

  const { handleSubmit, control, setError, reset } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleLogin = (payload: FormData) => {
    loginMutation.mutate(payload, {
      onSuccess: (data) => {
        () => isAuthenticated === true;
        navigate('/');
        reset();
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<FormData, 'confirmPassword'>>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirmPassword'>, {
                type: 'server',
                message: formError[key as keyof Omit<FormData, 'confirmPassword'>],
              });
            });
          }
        } else {
          console.log(error);
        }
      },
    });
  };

  return (
    <div className="bg-[linear-gradient(-180deg,#f53d2d,#f63)]">
      <div className="container">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form className="space-y-6 rounded bg-white p-10 shadow-sm" noValidate onSubmit={handleSubmit(handleLogin)}>
              <div className="text-2xl ">Đăng nhập</div>
              <InputField name="email" control={control} type="email" placeholder="Email" />
              <InputField name="password" control={control} type="password" placeholder="Password" />
              <div className="mt-3">
                <Button
                  primary
                  type="submit"
                  className="flex text-white w-full items-center justify-center py-4 bg-[linear-gradient(-180deg,#f53d2d,#f63)]"
                  isLoading={loginMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <span className="text-gray-400">Bạn chưa có tài khoản?</span>
                <Link className="ml-1 text-red-400" to="/register">
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
