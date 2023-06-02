import jsCookie from 'js-cookie';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Form, { FormAction, FormBody } from '../../components/shared/form';
import Input from '../../components/shared/form/inputs';
import DefaultLayout from '../../layouts/default-layout';
import { handleHttpRequestError } from '../../utils/error-handling';
import { UserService } from '../../services/user.service';
import Spinner from '../../components/shared/spinner';

interface LoginPageState {
  formValues: {
    email: string;
    password: string;
  };
  formErrors: any;
  loading: boolean;
}

function Login() {
  const router = useRouter();
  const [loginState, setLoginState] = useState<LoginPageState>({
    formValues: {
      email: '',
      password: '',
    },
    formErrors: {},
    loading: false,
  });

  async function handleLoginRequest() {
    setLoginState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const { token } = await UserService.login(loginState.formValues);
      jsCookie.set('token', token);
      router.push('/dashboard');
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors) => {
          const { email, password } = validationErrors;
          setLoginState((prevState) => ({
            ...prevState,
            formErrors: {
              email,
              password,
            },
          }));
        },
        unauthorizedRequestCallback: () => {
          setLoginState((prevState) => ({
            ...prevState,
            formErrors: {
              ...prevState.formErrors,
              email: 'Invalid credentials',
            },
          }));
          showLoginFailedToast();
        },
        nonAxiosErrorCallback: () => {
          showLoginFailedToast();
        },
      });
    } finally {
      setTimeout(() => {
        setLoginState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 500);
    }
  }

  function showLoginFailedToast() {
    toast.error('Unable to login.');
  }

  function handleValueChange(field: string, value: any) {
    setLoginState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [field]: value,
      },
    }));
  }

  function resetErrors() {
    setLoginState((prevState) => ({
      ...prevState,
      formErrors: {},
    }));
  }

  return (
    <DefaultLayout>
      <div className="row">
        <div className="d-none d-md-block" style={{ height: 150 }}></div>
        <div className="col-12 col-md-6 col-lg-4 mx-md-auto mt-5">
          <Form title="Login">
            <FormBody>
              <Input
                id="email"
                type="email"
                label="Email"
                value={loginState.formValues.email}
                onValueChange={(v) => handleValueChange('email', v)}
                error={_.get(loginState.formErrors, 'email', null)}
                placeholder="JohnDoe@email.com"
              />
              <Input
                id="password"
                type="password"
                label="Password"
                value={loginState.formValues.password}
                onValueChange={(v) => handleValueChange('password', v)}
                error={_.get(loginState.formErrors, 'password', null)}
              />
              <Input
                id="remember"
                type="checkbox"
                label="Remember me"
                value={true}
                onValueChange={(v) => console.log(v)}
                error={null}
              />
              <div className="mb-3">
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
            </FormBody>
            <FormAction>
              <div className="d-grid gap-2 mb-3">
                <button
                  className="btn btn-outline-primary btn-block"
                  onClick={handleLoginRequest}
                  disabled={loginState.loading}>
                  {loginState.loading ? <Spinner /> : 'Login'}
                </button>
              </div>
              <div className="text-center">
                Or <Link href={'/register'}>Register</Link> to our platform!
              </div>
            </FormAction>
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Login;
