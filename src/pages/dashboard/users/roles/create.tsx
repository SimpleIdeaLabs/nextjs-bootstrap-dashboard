import _ from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../../components/shared/breadcrumbs';
import Form, { FormAction, FormBody } from '../../../../components/shared/form';
import Input from '../../../../components/shared/form/inputs';
import Spinner from '../../../../components/shared/spinner';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { RoleService } from '../../../../services/role.service';
import { handleHttpRequestError } from '../../../../utils/error-handling';

interface UserRoleCreatePageState {
  formValues: {
    name: '';
  };
  formErrors: any;
  loading: boolean;
}

export default function UserRoleCreatePage() {
  const router = useRouter();
  const [userRoleCreatePageState, setUserRoleCreatePageState] = useState<UserRoleCreatePageState>({
    formValues: {
      name: '',
    },
    formErrors: {},
    loading: false,
  });

  /**
   * Handle Create Role
   */
  async function handleCreateRole() {
    setUserRoleCreatePageState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const { role } = await RoleService.createRole(userRoleCreatePageState.formValues);
      toast.success(`${role.name} role is created!`);
      router.push('/dashboard/users/roles/list?page=1&limit=10');
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          const { name = null } = validationErrors;
          setUserRoleCreatePageState((prevState) => ({
            ...prevState,
            formErrors: {
              name,
            },
          }));
        },
      });
    } finally {
      setTimeout(() => {
        setUserRoleCreatePageState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
  }

  function handleValueChange(field: string, value: any) {
    setUserRoleCreatePageState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [field]: value,
      },
    }));
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
                  value={userRoleCreatePageState.formValues.name}
                  onValueChange={(v) => handleValueChange('name', v)}
                  error={_.get(userRoleCreatePageState.formErrors, 'name', null)}
                />
              </FormBody>
              <FormAction>
                <button
                  className="btn btn-outline-primary btn-block"
                  type="button"
                  onClick={handleCreateRole}
                  disabled={userRoleCreatePageState.loading}>
                  {userRoleCreatePageState.loading ? <Spinner /> : 'Create'}
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
