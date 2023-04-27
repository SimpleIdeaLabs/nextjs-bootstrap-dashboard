import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../../../components/breadcrumbs';
import Form, { FormAction, FormBody } from '../../../../../components/form';
import Input from '../../../../../components/form/inputs';
import DashboardLayout from '../../../../../layouts/dashboard-layout';
import { authenticatedRequest } from '../../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../../utils/error-handling';
import ProfilePhotoModal from './../_components/profile-photo-modal';

interface SystemUserFormProps {
  mode: 'create' | 'edit';
  userId?: any;
  handleOnFormSubmit: (payload: any) => void;
}

export default function SystemUserForm(props: SystemUserFormProps) {
  const router = useRouter();
  const { userId = null } = props;
  const [optionRoles, setOptionRoles] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [profilePhotoError, setProfilePhotoError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [rolesError, setRoleError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [displayProfilePhotoModal, setDisplayProfilePhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = props;

  const formProperties = (function () {
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
      await fetchRoles();

      /**
       * Fetch User Data
       * If mode is on Edit
       */
      if (mode === 'edit' && userId) {
        await fetchUserData(Number(userId as string));
      }
      setIsLoading(false);
    }
    getData();
  }, [mode, userId]);

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
    setOptionRoles(optionRoles);
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
      if (rawProfilePhoto) {
        const profilePhotoUrl = `${process.env.FILE_UPLOADS_URL}/profile-photos/${rawProfilePhoto}`;
        const profilePhotoBlob = await fetch(profilePhotoUrl).then((response) => response.blob());
        const profilePhotoObjectURL = URL.createObjectURL(profilePhotoBlob);
        setProfilePhoto({ preview: profilePhotoObjectURL });
      }
      setFirstName(_.get(user, 'firstName', ''));
      setLastName(_.get(user, 'lastName', ''));
      setEmail(_.get(user, 'email', ''));
      const userRoles = _.map(_.get(user, 'roles', []), (role) => {
        return {
          value: role.id,
          label: role.name,
        };
      });
      setRoles(userRoles);
    }
  }

  /**
   * Handle Form Submit
   */
  async function _handleOnformSubmit() {
    const { handleOnFormSubmit } = props;
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
      console.log(error);
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          setProfilePhotoError(_.get(validationErrors, 'profilePhoto', null));
          setFirstNameError(_.get(validationErrors, 'firstName', null));
          setLastNameError(_.get(validationErrors, 'lastName', null));
          setEmailError(_.get(validationErrors, 'email', null));
          setRoleError(_.get(validationErrors, 'roles', null));
          setPasswordError(_.get(validationErrors, 'password', null));
          setConfirmPasswordError(_.get(validationErrors, 'confirmPassword', null));
        },
      });
    }
  }

  function resetErrors() {
    setProfilePhotoError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setRoleError('');
    setPasswordError('');
    setConfirmPassword('');
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
                    onClick={() => setDisplayProfilePhotoModal(true)}
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
                  onValueChange={(v) => setFirstName(v)}
                  error={firstNameError}
                />
                <Input
                  type="text"
                  label="Last Name"
                  id={'lastName'}
                  value={lastName}
                  onValueChange={(v) => setLastName(v)}
                  error={lastNameError}
                />
                <Input
                  type="email"
                  label="Email"
                  id={'email'}
                  value={email}
                  onValueChange={(v) => setEmail(v)}
                  error={emailError}
                />
                {!isLoading && optionRoles && optionRoles.length > 0 ? (
                  <Input
                    type="select"
                    label="Role"
                    value={roles}
                    id={'role'}
                    multiSelect
                    options={optionRoles}
                    onValueChange={(roleIds) => setRoles(roleIds)}
                    error={rolesError}
                  />
                ) : null}
                <Input
                  type="password"
                  label="Password"
                  id={'password'}
                  value={password}
                  onValueChange={(v) => setPassword(v)}
                  error={passwordError}
                />
                <Input
                  type="password"
                  label="Confirm Password"
                  id={'confirmPassword'}
                  value={confirmPassword}
                  onValueChange={(v) => setConfirmPassword(v)}
                  error={confirmPasswordError}
                />
              </FormBody>
              <FormAction>
                <button className="btn btn-primary btn-block" type="button" onClick={_handleOnformSubmit}>
                  {formProperties.buttonLabel}
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
      </div>
      <ProfilePhotoModal
        showModal={displayProfilePhotoModal}
        onClose={() => setDisplayProfilePhotoModal(false)}
        profilePhoto={profilePhoto}
        onUpdateProfilePhoto={(newPhoto) => setProfilePhoto(newPhoto)}
      />
    </DashboardLayout>
  );
}
