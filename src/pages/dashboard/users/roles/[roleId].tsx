import Form, { FormAction, FormBody } from '../../../../components/shared/form';
import Input from '../../../../components/shared/form/inputs';
import { Breadcrumbs } from '../../../../components/shared/breadcrumbs';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { useEffect, useState } from 'react';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Spinner from '../../../../components/shared/spinner';
import { RoleService } from '../../../../services/role.service';

interface UserRoleUpdatePageState {
  roleId: null | number;
  formValues: {
    name: string;
  };
  formErrors: any;
  loading: boolean;
}

export default function UserRoleUpdatePage() {
  const router = useRouter();
  const [userRoleUpdatePageState, setUserRoleUpdatePageState] = useState<UserRoleUpdatePageState>({
    roleId: null,
    formValues: {
      name: '',
    },
    formErrors: {},
    loading: true,
  });

  useEffect(() => {
    if (!_.isEmpty(router.query)) {
      const roleId = parseInt(router.query.roleId as string);
      setUserRoleUpdatePageState((prevState) => ({
        ...prevState,
        roleId,
      }));
      fetchRole(roleId);
    }
  }, [router.query]);

  async function fetchRole(roleId: number) {
    try {
      const { role } = await RoleService.getRole({
        roleId,
      });
      setUserRoleUpdatePageState((prevState) => ({
        ...prevState,
        formValues: {
          name: role.name,
        },
      }));
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    } finally {
      setTimeout(() => {
        setUserRoleUpdatePageState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
  }

  async function handleUpdateRole() {
    const { roleId, formValues } = userRoleUpdatePageState;
    if (!roleId) return;
    setUserRoleUpdatePageState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const { role } = await RoleService.updateRole({
        roleId,
        name: formValues.name,
      });
      resetErrors();
      toast.success(`${role.name} role is updated!`);
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          const { name = null } = validationErrors;
          setUserRoleUpdatePageState((prevState) => ({
            ...prevState,
            formErrors: {
              name,
            },
          }));
        },
      });
    } finally {
      setTimeout(() => {
        setUserRoleUpdatePageState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
  }

  function resetErrors() {
    setUserRoleUpdatePageState((prevState) => ({
      ...prevState,
      formErrors: {},
    }));
  }

  function handleValueChange(field: string, value: any) {
    setUserRoleUpdatePageState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [field]: value,
      },
    }));
  }

  if (!userRoleUpdatePageState.roleId) {
    return null;
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
              title: `${userRoleUpdatePageState.formValues.name}`,
              link: `/dashboard/users/roles/${userRoleUpdatePageState.roleId}`,
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
            <Form title="Create User Role" loading={userRoleUpdatePageState.loading}>
              <FormBody>
                <Input
                  type="text"
                  label="Name"
                  id="name"
                  value={userRoleUpdatePageState.formValues.name}
                  onValueChange={(v) => handleValueChange('name', v)}
                  error={_.get(userRoleUpdatePageState.formErrors, 'name', null)}
                  loading={userRoleUpdatePageState.loading}
                />
              </FormBody>
              <FormAction>
                <button
                  className="btn btn-outline-primary btn-block"
                  type="button"
                  onClick={handleUpdateRole}
                  disabled={userRoleUpdatePageState.loading}>
                  {userRoleUpdatePageState.loading ? <Spinner /> : 'Update'}
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
