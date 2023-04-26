import Form, { FormAction, FormBody } from '../../../../components/form';
import Input from '../../../../components/form/inputs';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { useState } from 'react';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import _ from 'lodash';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function CreateSystemUser() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  async function handleCreateRole() {
    try {
      const {
        data: { status, message },
      } = await authenticatedRequest.post('/role', {
        name,
      });
      if (!status) {
        throw new Error(message);
      }
      setName('');
      setNameError('');
      toast.success(`${name} role is created!`);
      router.push('/dashboard/users/roles/list?page=1&limit=10');
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          console.log(validationErrors);
          setNameError(_.get(validationErrors, 'name', null));
        },
      });
    }
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Users',
              link: '/users',
              active: false,
            },
            {
              title: 'Roles',
              link: '/dashboard/users/roles/list?page=1&limit=10',
              active: false,
            },
            {
              title: 'Create',
              link: '/dashboard/users/roles/create',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
            <Form title="Create User Role">
              <FormBody>
                <Input
                  type="text"
                  label="Name"
                  id="name"
                  value={name}
                  onValueChange={(v) => setName(v)}
                  error={nameError}
                />
              </FormBody>
              <FormAction>
                <button className="btn btn-primary btn-block" type="button" onClick={handleCreateRole}>
                  Create
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
