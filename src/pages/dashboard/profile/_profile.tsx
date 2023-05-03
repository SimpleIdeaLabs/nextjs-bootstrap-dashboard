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

function ProfilePage() {
  const router = useRouter();
  const currentUser = useContext<any>(UserContext);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [profilePhotoError, setProfilePhotoError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [displayProfilePhotoModal, setDisplayProfilePhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      await fetchUserData();
      setIsLoading(false);
    }
    getData();
  }, [currentUser]);

  /**
   * Fetch User
   */
  async function fetchUserData() {
    if (currentUser) {
      const response = await authenticatedRequest.get(`/user/${currentUser.id}`);
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
      }
    }
  }

  function resetErrors() {
    setProfilePhotoError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
  }

  /**
   * Update Profile
   */
  async function handleUpdateProfile() {
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);

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
      } = await authenticatedRequest.patch(`/user/current`, formData, config);
      if (!status) {
        throw new Error(message);
      }

      resetErrors();
      toast.success('Profile successfully updated.');
      router.push('/dashboard/profile');
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          setProfilePhotoError(_.get(validationErrors, 'profilePhoto', null));
          setFirstNameError(_.get(validationErrors, 'firstName', null));
          setLastNameError(_.get(validationErrors, 'lastName', null));
          setEmailError(_.get(validationErrors, 'email', null));
        },
      });
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
          <Form title={'Update Profile'}>
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
            </FormBody>
            <FormAction>
              <button className="btn btn-outline-primary btn-block" type="button" onClick={handleUpdateProfile}>
                Update
              </button>
            </FormAction>
          </Form>
        </div>
      </div>
      <ProfilePhotoModal
        showModal={displayProfilePhotoModal}
        onClose={() => setDisplayProfilePhotoModal(false)}
        profilePhoto={profilePhoto}
        onUpdateProfilePhoto={(newPhoto) => setProfilePhoto(newPhoto)}
      />
    </div>
  );
}

export default ProfilePage;
