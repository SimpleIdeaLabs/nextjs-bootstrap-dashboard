import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/user-context';
import { authenticatedRequest } from '../../../utils/axios-util';
import Form, { FormBody, FormAction } from '../../../components/form';
import Input from '../../../components/form/inputs';
import ProfilePhotoModal from '../users/system-users/_components/profile-photo-modal';
import { handleHttpRequestError } from '../../../utils/error-handling';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

function ProfileSecurityPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');

  function resetErrors() {
    setPasswordError('');
    setConfirmPasswordError('');
  }

  /**
   * Update Profile Password
   */
  async function handleUpdateProfilePassword() {
    try {
      const {
        data: { status, message },
      } = await authenticatedRequest.patch(`/user/current/password`, {
        password,
        confirmPassword,
        currentPassword,
      });
      if (!status) {
        throw new Error(message);
      }
      resetErrors();
      toast.success('Profile password successfully updated.');
      router.push('/dashboard/profile');
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        unauthorizedRequestCallback: () => {
          resetErrors();
          setCurrentPasswordError('Invalid current password');
          toast.error('Unable to reset password.');
        },
        badRequestCallback: (validationErrors: any) => {
          setPasswordError(_.get(validationErrors, 'password', null));
          setConfirmPasswordError(_.get(validationErrors, 'confirmPassword', null));
          setCurrentPasswordError(_.get(validationErrors, 'currentPassword', null));
        },
      });
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
          <Form title={'Update Password'}>
            <FormBody>
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
              <Input
                type="password"
                label="Current Password"
                id={'currentPassword'}
                value={currentPassword}
                onValueChange={(v) => setCurrentPassword(v)}
                error={currentPasswordError}
              />
            </FormBody>
            <FormAction>
              <button className="btn btn-primary btn-block" type="button" onClick={handleUpdateProfilePassword}>
                Update Password
              </button>
            </FormAction>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSecurityPage;
