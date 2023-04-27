import Link from 'next/link';
import Form, { FormAction, FormBody } from '../../../../components/form';
import Input from '../../../../components/form/inputs';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { toast } from 'react-toastify';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import _ from 'lodash';
import ProfilePhotoModal from './_components/profile-photo-modal';

export default function CreateSystemUser() {
  const router = useRouter();
  const [optionRoles, setOptionRoles] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roles, setRoles] = useState([]);
  const [rolesError, setRoleError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [displayProfilePhotoModal, setDisplayProfilePhotoModal] = useState(false);

  useEffect(() => {
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
    fetchRoles();
  }, []);

  async function handleCreateUser() {
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      for (let i = 0; i < roles.length; i++) {
        formData.append(`roles[${i}][id]`, (roles[i] as any).value);
      }
      formData.append('profilePhoto', profilePhoto);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      const {
        data: { status, message },
      } = await authenticatedRequest.post('/user', formData, config);
      if (!status) {
        throw new Error(message);
      }

      resetErrors();

      toast.success(`${firstName} ${lastName} user is created!`);
      router.push('/dashboard/users/system-users/list?page=1&limit=10');
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
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
            {
              title: 'Create',
              link: '/dashboard/users/system-users/create',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
            <Form title="Create System User">
              <FormBody>
                <div className="d-flex flex-row justify-content-center mt-3">
                  <img
                    style={{ width: 200, height: 200 }}
                    src={profilePhoto ? (profilePhoto as any).preview : 'https://via.placeholder.com/150'}
                    className="rounded-circle align-self-center cursor-pointer shadow"
                    alt="Avatar"
                    onClick={() => setDisplayProfilePhotoModal(true)}
                    onLoad={() => {
                      URL.revokeObjectURL((profilePhoto as any).preview);
                    }}
                  />
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
                <Input
                  type="select"
                  label="Role"
                  value={[]}
                  id={'role'}
                  multiSelect
                  options={optionRoles}
                  onValueChange={(roleIds) => setRoles(roleIds)}
                  error={rolesError}
                />
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
                <button className="btn btn-primary btn-block" type="button" onClick={handleCreateUser}>
                  Create
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
