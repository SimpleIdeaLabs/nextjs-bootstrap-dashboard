import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProfilePhotoModal from './profile-photo-modal';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import { Breadcrumbs } from '../../../shared/breadcrumbs';
import Form, { FormBody, FormAction } from '../../../shared/form';
import Input from '../../../shared/form/inputs';
import Spinner from '../../../shared/spinner';

interface SystemUserFormProps {
  mode: 'create' | 'edit';
  userId?: any;
  handleOnFormSubmit: (payload: any) => void;
}

interface SystemUserFormValues {
  profilePhoto: any;
  firstName: string;
  lastName: string;
  email: string;
  roles: any[];
  password: string;
  confirmPassword: string;
}

interface SystemUserFormState {
  formValues: SystemUserFormValues;
  formErrors: any;
  loading: boolean;
  optionRoles: any[];
  displayProfilePhotoModal: boolean;
}

export default function SystemUserForm(props: SystemUserFormProps) {
  const router = useRouter();
  const { userId = null, mode } = props;
  const [systemUserFormState, setSystemUserFormState] = useState<SystemUserFormState>({
    formValues: {
      profilePhoto: '',
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
      password: '',
      confirmPassword: '',
    },
    formErrors: {},
    displayProfilePhotoModal: false,
    optionRoles: [],
    loading: false,
  });

  const formProperties = (function () {
    const { formValues } = systemUserFormState;
    const { firstName = '', lastName = '' } = formValues;
    if (mode === 'create') {
      return {
        formLabel: 'Create System User',
        buttonLabel: 'Create',
        successMessage: `${firstName} ${lastName} user is created!`,
        successRedirect: `/dashboard/users/system-users/list?page=1&limit=10`,
        breadcrumbLink: {
          title: 'Create',
          link: '/dashboard/users/system-users/create',
          active: true,
        },
      };
    } else {
      return {
        formLabel: 'Update System User',
        buttonLabel: 'Update',
        successMessage: `${firstName} ${lastName} user is updated!`,
        successRedirect: `/dashboard/users/system-users/${userId}`,
        breadcrumbLink: {
          title: `Update ${firstName} ${lastName}`,
          link: `/dashboard/users/system-users/{$userId}`,
          active: true,
        },
      };
    }
  })();

  useEffect(() => {
    async function getData() {
      setSystemUserFormState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      /**
       * Fetch User Data
       * If mode is on Edit
       */
      if (mode === 'edit' && userId && systemUserFormState.optionRoles.length) {
        await fetchUserData(Number(userId as string));
      }
      setSystemUserFormState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
    getData();
  }, [mode, userId, systemUserFormState.optionRoles]);

  useEffect(() => {
    fetchRoles();
  }, []);

  function handleValueChange(field: string, value: any) {
    setSystemUserFormState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [field]: value,
      },
    }));
  }

  /**
   * Fetch Roles
   */
  async function fetchRoles() {
    const response = await authenticatedRequest.get(`/role?page=${1}&limit=${1000}`);
    const {
      data: { data: responseData },
    } = response;
    const { roles = [] } = responseData;
    const optionRoles = roles.map((role: any) => ({
      value: role.id,
      label: role.name,
    }));
    setSystemUserFormState((prevState) => ({
      ...prevState,
      optionRoles,
    }));
  }

  /**
   * Fetch User
   */
  async function fetchUserData(userId: number) {
    const response = await authenticatedRequest.get(`/user/${userId}`);
    const {
      data: { data: responseData },
    } = response;
    const { user = null } = responseData;
    if (user) {
      const rawProfilePhoto = _.get(user, 'profilePhoto', '');
      let profilePhoto: any = null;
      if (rawProfilePhoto) {
        const profilePhotoUrl = `${process.env.FILE_UPLOADS_URL}/profile-photos/${rawProfilePhoto}`;
        const profilePhotoBlob = await fetch(profilePhotoUrl).then((response) => response.blob());
        const profilePhotoObjectURL = URL.createObjectURL(profilePhotoBlob);
        profilePhoto = { preview: profilePhotoObjectURL };
      }

      const userRoles = _.map(_.get(user, 'roles', []), (role) => {
        return {
          value: role.id,
          label: role.name,
        };
      });

      setSystemUserFormState((prevState) => ({
        ...prevState,
        formValues: {
          ...prevState.formValues,
          profilePhoto,
          firstName: _.get(user, 'firstName', ''),
          lastName: _.get(user, 'lastName', ''),
          email: _.get(user, 'email', ''),
          roles: userRoles,
        },
      }));
    }
  }

  /**
   * Handle Form Submit
   */
  async function _handleOnformSubmit() {
    const { handleOnFormSubmit } = props;
    const { formValues } = systemUserFormState;
    const { firstName, lastName, email, password, confirmPassword, roles, profilePhoto } = formValues;
    setSystemUserFormState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      await handleOnFormSubmit({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        roles,
        profilePhoto,
      });
      resetErrors();
      toast.success(formProperties.successMessage);
      router.push(formProperties.successRedirect);
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          toast.error('Check your form for errors.');
          setSystemUserFormState((prevState) => ({
            ...prevState,
            formErrors: {
              profilePhoto: _.get(validationErrors, 'profilePhoto', null),
              firstName: _.get(validationErrors, 'firstName', null),
              lastName: _.get(validationErrors, 'lastName', null),
              email: _.get(validationErrors, 'email', null),
              role: _.get(validationErrors, 'role', null),
              password: _.get(validationErrors, 'password', null),
              confirmPassword: _.get(validationErrors, 'confirmPassword', null),
            },
          }));
        },
      });
    } finally {
      setTimeout(() => {
        setSystemUserFormState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
  }

  function resetErrors() {
    setSystemUserFormState((prevState) => ({
      ...prevState,
      formErrors: {},
    }));
  }

  function setDisplayPhotoModal(display: boolean) {
    setSystemUserFormState((prevState) => ({
      ...prevState,
      displayProfilePhotoModal: display,
    }));
  }

  const { formValues, formErrors, loading, optionRoles = [], displayProfilePhotoModal = false } = systemUserFormState;
  const {
    profilePhoto = '',
    firstName = '',
    lastName = '',
    email = '',
    roles = [],
    password = '',
    confirmPassword = '',
  } = formValues;
  const profilePhotoError = _.get(formErrors, 'profilePhoto', null);

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
              title: 'System Users',
              link: '/dashboard/users/system-users/list?page=1&limit=10',
              active: false,
            },
            formProperties.breadcrumbLink,
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
            <Form title={formProperties.formLabel}>
              <FormBody>
                <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                  <img
                    style={{ width: 200, height: 200 }}
                    src={profilePhoto ? (profilePhoto as any).preview : 'https://via.placeholder.com/150'}
                    className={`rounded-circle align-self-center cursor-pointer shadow ${
                      profilePhotoError ? 'border border-danger' : ''
                    }`}
                    alt="Avatar"
                    onClick={() => setDisplayPhotoModal(true)}
                    onLoad={() => {
                      profilePhoto && URL.revokeObjectURL((profilePhoto as any).preview);
                    }}
                  />
                  {profilePhotoError && <p className="form-text text-danger">{profilePhotoError}</p>}
                </div>
                <hr className="my-4" />
                <Input
                  type="text"
                  label="First Name"
                  id={'firstName'}
                  value={firstName}
                  onValueChange={(v) => handleValueChange('firstName', v)}
                  error={_.get(formErrors, 'firstName', null)}
                />
                <Input
                  type="text"
                  label="Last Name"
                  id={'lastName'}
                  value={lastName}
                  onValueChange={(v) => handleValueChange('lastName', v)}
                  error={_.get(formErrors, 'lastName', null)}
                />
                <Input
                  type="email"
                  label="Email"
                  id={'email'}
                  value={email}
                  onValueChange={(v) => handleValueChange('email', v)}
                  error={_.get(formErrors, 'email', null)}
                />
                {!loading && optionRoles && optionRoles.length > 0 ? (
                  <Input
                    type="select"
                    label="Role"
                    value={roles}
                    id={'role'}
                    multiSelect
                    options={optionRoles}
                    onValueChange={(roleIds) => handleValueChange('roles', roleIds)}
                    error={_.get(formErrors, 'role', null)}
                  />
                ) : null}
                <Input
                  type="password"
                  label="Password"
                  id={'password'}
                  value={password}
                  onValueChange={(v) => handleValueChange('password', v)}
                  error={_.get(formErrors, 'password', null)}
                />
                <Input
                  type="password"
                  label="Confirm Password"
                  id={'confirmPassword'}
                  value={confirmPassword}
                  onValueChange={(v) => handleValueChange('confirmPassword', v)}
                  error={_.get(formErrors, 'confirmPassword', null)}
                />
              </FormBody>
              <FormAction>
                <button
                  className="btn btn-outline-primary btn-block"
                  type="button"
                  onClick={_handleOnformSubmit}
                  disabled={systemUserFormState.loading}>
                  {systemUserFormState.loading ? <Spinner /> : formProperties.buttonLabel}
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
      </div>
      <ProfilePhotoModal
        showModal={displayProfilePhotoModal}
        onClose={() => setDisplayPhotoModal(false)}
        profilePhoto={profilePhoto}
        onUpdateProfilePhoto={(newPhoto) => handleValueChange('profilePhoto', newPhoto)}
      />
    </DashboardLayout>
  );
}
