import Link from 'next/link';
import DefaultLayout from '../../layouts/default-layout';
import Form, { FormAction, FormBody } from '../../components/form';
import Input from '../../components/form/inputs';

function ForgotPassword() {
  return (
    <DefaultLayout>
      <div className="row">
        <div className="d-none d-md-block" style={{ height: 150 }}></div>
        <div className={`col-12 col-md-4 mx-md-auto mt-5`}>
          <Form title="Forgot Password">
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
            </FormBody>
            <FormAction>
              <div className="d-grid gap-2 mb-3">
                <Link className="btn btn-primary btn-block" href="/dashboard/dashboard-analytics">
                  Send Reset Link
                </Link>
              </div>
              <div className="text-center">
                <Link href={'/login'}>Login</Link> to our platform!
              </div>
            </FormAction>
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default ForgotPassword;
