import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../layouts/dashboard-layout';
import PatientFormLayout from '../../../layouts/patient-form-layout';
import { authenticatedRequest } from '../../../utils/axios-util';
import { handleHttpRequestError } from '../../../utils/error-handling';
import { Breadcrumbs } from '../../shared/breadcrumbs';
import Form, { FormBody, FormAction } from '../../shared/form';
import Input from '../../shared/form/inputs';
import ProfilePhotoModal from './profile-photo-modal';
import { Patient } from '../../../models/patient.model';
import { PatientDemographicsDataParams } from '../../../dtos/patient.dto';

interface SystemUserFormProps {
  mode: 'create' | 'edit';
  patient: Patient | null;
  loading: boolean;
  handleOnFormSubmit: (params: PatientDemographicsDataParams) => void;
}

export default function DemographicsForm(props: SystemUserFormProps) {
  const router = useRouter();
  const { loading = true, patient = null, mode } = props;
  const patientId = _.get(props, 'patient.id', null);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [profilePhotoError, setProfilePhotoError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [middleNameError, setMiddleNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [contactNoError, setContactNoError] = useState('');
  const [displayProfilePhotoModal, setDisplayProfilePhotoModal] = useState(false);

  const formProperties = (function (_patient: any) {
    if (mode !== 'create') {
      return {
        formLabel: 'Create Patient Demographics',
        buttonLabel: 'Create',
        breadcrumbLink: {
          title: 'Create',
          link: '/dashboard/patients/demographics',
          active: true,
        },
      };
    }
    return {
      formLabel: 'Update Patient Demographics',
      buttonLabel: 'Update',
      breadcrumbLink: {
        title: `Update Demographics`,
        link: `/dashboard/patients/demographics/${_patient?.id}`,
        active: true,
      },
    };
  })(patient);

  useEffect(() => {
    async function setUpDemographicsData() {
      try {
        if (patient) {
          const rawProfilePhoto = _.get(patient, 'profilePhoto', '');
          if (rawProfilePhoto) {
            const profilePhotoUrl = `${process.env.FILE_UPLOADS_URL}/patient/photos/${rawProfilePhoto}`;
            const profilePhotoBlob = await fetch(profilePhotoUrl).then((response) => response.blob());
            const profilePhotoObjectURL = URL.createObjectURL(profilePhotoBlob);
            setProfilePhoto({ preview: profilePhotoObjectURL });
          }
          setFirstName(_.get(patient, 'firstName', ''));
          setMiddleName(_.get(patient, 'middleName', ''));
          setLastName(_.get(patient, 'lastName', ''));
          setBirthDate(_.get(patient, 'birthDate', ''));
          setEmail(_.get(patient, 'email', ''));
          setContactNo(_.get(patient, 'contactNo', ''));
        }
      } catch (error) {
        toast.error('Oops something went wrong...');
      }
    }

    if (patient) {
      setUpDemographicsData();
    }
  }, [patient]);

  /**
   * Handle Form Submit
   */
  async function _handleOnformSubmit() {
    const { handleOnFormSubmit } = props;
    await handleOnFormSubmit({
      payload: {
        firstName,
        middleName,
        lastName,
        birthDate,
        email,
        contactNo,
        profilePhoto,
      },
      onSuccess: (_patientId: any) => {
        if (_patientId) {
          toast.success("Successfully updated patient's demographics data.");
          router.push(`/dashboard/patients/additional-data/${_patientId}`);
        }
      },
      onError: (error: unknown) => {
        handleHttpRequestError({
          error,
          badRequestCallback: (validationErrors: any) => {
            setProfilePhotoError(_.get(validationErrors, 'profilePhoto', null));
            setFirstNameError(_.get(validationErrors, 'firstName', null));
            setLastNameError(_.get(validationErrors, 'lastName', null));
            setBirthDateError(_.get(validationErrors, 'birthDate', null));
            setEmailError(_.get(validationErrors, 'email', null));
            setContactNoError(_.get(validationErrors, 'contactNo', null));
          },
        });
      },
    });
  }

  function resetErrors() {
    setProfilePhotoError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Patients',
              link: '/dashboard/patients/list?page=1&limit=10',
              active: false,
            },
            {
              title: 'Create Patient',
              link: '/dashboard/patients/create',
              active: false,
            },
            formProperties.breadcrumbLink,
          ]}
        />

        <PatientFormLayout activeTab={0} mode={mode} patientId={patientId}>
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
                loading={loading}
              />
              <Input
                type="text"
                label="Middle Name"
                id={'middleName'}
                value={middleName}
                onValueChange={(v) => setMiddleName(v)}
                error={middleNameError}
                loading={loading}
              />
              <Input
                type="text"
                label="Last Name"
                id={'lastName'}
                value={lastName}
                onValueChange={(v) => setLastName(v)}
                error={lastNameError}
                loading={loading}
              />
              <Input
                type="date"
                label="Birth Date"
                id={'birthDate'}
                value={birthDate}
                onValueChange={(v) => setBirthDate(v)}
                error={birthDateError}
                loading={loading}
              />
              <Input
                type="email"
                label="Email"
                id={'email'}
                value={email}
                onValueChange={(v) => setEmail(v)}
                error={emailError}
                loading={loading}
              />
              <Input
                type="text"
                label="Contact No"
                id={'contactNo'}
                value={contactNo}
                onValueChange={(v) => setContactNo(v)}
                error={contactNoError}
                loading={loading}
              />
            </FormBody>
            <FormAction>
              <button className="btn btn-outline-primary btn-block" type="button" onClick={_handleOnformSubmit}>
                {formProperties.buttonLabel}
              </button>
            </FormAction>
          </Form>
        </PatientFormLayout>
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
