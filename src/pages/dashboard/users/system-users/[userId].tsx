import _ from 'lodash';
import { useRouter } from 'next/router';
import { authenticatedRequest } from '../../../../utils/axios-util';
import SystemUserForm from '../../../../components/dashboard/users/system-users/system-user-form';
import { useEffect, useState } from 'react';

interface UpdateSystemUserState {
  userId: null | number;
  optionRoles: any[];
  formValues: {
    profilePhoto: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: any[];
    password: string;
    confirmPassword: string;
  };
  formErrors: any;
  loading: boolean;
}

export default function UpdateSystemUser() {
  const router = useRouter();
  const [updateSystemUserState, setUpdateSystemUserState] = useState<UpdateSystemUserState>({
    userId: null,
    optionRoles: [],
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
    loading: true,
  });

  useEffect(() => {}, [router.query]);

  async function handleUpdateUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles: any[];
    profilePhoto: any;
  }) {
    const { firstName, lastName, email, password, confirmPassword, roles, profilePhoto } = payload;
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    for (let i = 0; i < roles.length; i++) {
      formData.append(`roles[${i}][id]`, (roles[i] as any).value);
    }

    if (password) {
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
    }

    if (profilePhoto.path) {
      formData.append('profilePhoto', profilePhoto);
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    const {
      data: { status, message },
    } = await authenticatedRequest.patch(`/user/${userId}`, formData, config);
    if (!status) {
      throw new Error(message);
    }
  }

  return <SystemUserForm mode="edit" handleOnFormSubmit={handleUpdateUser} userId={userId} />;
}
