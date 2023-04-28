import Link from 'next/link';
import DefaultLayout from '../../layouts/default-layout';
import Form, { FormAction, FormBody } from '../../components/form';
import Input from '../../components/form/inputs';
import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useRouter } from 'next/router';
import jsCookie from 'js-cookie';
import { handleHttpRequestError } from '../../utils/error-handling';
import { toast } from 'react-toastify';

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function handleLoginRequest() {
    resetErrors();
    try {
      const payload = {
        email,
        password,
      };
      const {
        data: { data: responseData },
      } = await axios.post(`${process.env.API_URL}/user/login`, payload);
      jsCookie.set('token', responseData.token);
      router.push('/dashboard');
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          setEmailError(_.get(validationErrors, 'email', null));
          setPasswordError(_.get(validationErrors, 'password', null));
          toast.error('Unable to login.');
        },
        unauthorizedRequestCallback: () => {
          setEmailError('Email or Password is incorrect.');
          toast.error('Unable to login.');
        },
        nonAxiosErrorCallback: () => {
          toast.error('Unable to login.');
        },
      });
    }
  }

  function resetErrors() {
    setEmailError('');
    setPasswordError('');
  }

  return (
    <DefaultLayout>
      <div className="row">
        <div className="d-none d-md-block" style={{ height: 150 }}></div>
        <div className={`col-12 col-md-6 col-lg-4 mx-md-auto mt-5`}>
          <Form title="Login">
            <FormBody>
              <Input
                id="email"
                type="email"
                label="Email"
                value={email}
                onValueChange={(v) => setEmail(v)}
                error={emailError}
                placeholder="JohnDoe@email.com"
              />
              <Input
                id="password"
                type="password"
                label="Password"
                value={password}
                onValueChange={(v) => setPassword(v)}
                error={passwordError}
              />
              <Input
                id="remember"
                type="checkbox"
                label="Remember me"
                value={true}
                onValueChange={(v) => setPassword(v)}
                error={null}
              />
              <div className="mb-3">
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
            </FormBody>
            <FormAction>
              <div className="d-grid gap-2 mb-3">
                <button className="btn btn-outline-primary btn-block" onClick={handleLoginRequest}>
                  Login
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
