import Link from 'next/link';
import Form, { FormAction, FormBody } from '../../../../components/form';
import Input from '../../../../components/form/inputs';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { useEffect, useState } from 'react';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import _ from 'lodash';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function UpdateUserRole() {
  const router = useRouter();
  const roleId = _.get(router, 'query.roleId', null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    async function getRole() {
      if (!roleId) return;
      try {
        const {
          data: { data: responseData },
        } = await authenticatedRequest.get(`/role/${roleId}`);
        const role = _.get(responseData, 'role', null);
        if (role) {
          setName(role.name);
        }
      } catch (error) {
        console.log(error);
        handleHttpRequestError({
          error,
        });
      }
    }
    getRole();
  }, [roleId]);

  async function handleUpdateRole() {
    try {
      const {
        data: { status, message },
      } = await authenticatedRequest.patch(`/role/${roleId}`, {
        name,
      });
      if (!status) {
        throw new Error(message);
      }
      setName('');
      setNameError('');
      toast.success(`${name} role is updated!`, {
        onClose: () => router.push('/dashboard/users/roles/list'),
      });
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
              link: '/dashboard/users/roles/list',
              active: false,
            },
            {
              title: 'Update',
              link: '/dashboard/users/roles/create',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-8 mx-auto`}>
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
                <button className="btn btn-primary btn-block" type="button" onClick={handleUpdateRole}>
                  Update
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
