import Link from 'next/link';
import DefaultLayout from '../../layouts/default-layout';
import Form, { FormAction, FormBody } from '../../components/form';
import Input from '../../components/form/inputs';

function Register() {
  return (
    <DefaultLayout>
      <div className="row">
        <div className="d-none d-md-block" style={{ height: 150 }}></div>
        <div className={`col-12 col-md-4 mx-md-auto mt-5`}>
          <Form title="Register">
            <FormBody>
              <Input
                type="email"
                label="Email"
                id={''}
                value={undefined}
                onValueChange={function (value: any): void {
                  throw new Error('Function not implemented.');
                }}
                error={undefined}
              />
              <Input
                type="password"
                label="Password"
                id={''}
                value={undefined}
                onValueChange={function (value: any): void {
                  throw new Error('Function not implemented.');
                }}
                error={undefined}
              />
              <Input
                type="password"
                label="Confirm Password"
                id={''}
                value={undefined}
                onValueChange={function (value: any): void {
                  throw new Error('Function not implemented.');
                }}
                error={undefined}
              />
              <Input
                type="checkbox"
                label="I agree to privacy policy terms."
                id={''}
                value={undefined}
                onValueChange={function (value: any): void {
                  throw new Error('Function not implemented.');
                }}
                error={undefined}
              />
            </FormBody>
            <FormAction>
              <div className="d-grid gap-2 mb-3">
                <Link className="btn btn-primary btn-block" href="/dashboard/dashboard-analytics">
                  Register
                </Link>
              </div>
              <div className="text-center">
                Or Already have account, <Link href={'/login'}>Login</Link> to our platform!
              </div>
            </FormAction>
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Register;
