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

export interface PatientDemographicsValue {
  profilePhoto: any;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  email: string;
  contactNo: string;
}

interface SystemUserFormProps {
  mode: 'create' | 'edit';
  patient: Patient | null;
  loading: boolean;
  handleOnFormSubmit: (params: PatientDemographicsValue, onSuccess: (patientId?: number) => void) => void;
}

interface PatientDemographicsFormState {
  formValues: PatientDemographicsValue;
  formErrors: any;
  loading: boolean;
  displayProfilePhotoModal: boolean;
}

export default function DemographicsForm(props: SystemUserFormProps) {
  const router = useRouter();
  const { loading = true, patient = null, mode } = props;
  const patientId = _.get(props, 'patient.id', null);
  const [demographicsFormState, setDemographicsFormState] = useState<PatientDemographicsFormState>({
    formValues: {
      profilePhoto: '',
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      email: '',
      contactNo: '',
    },
    formErrors: {},
    displayProfilePhotoModal: false,
    loading: false,
  });

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
          let profilePhoto: any = null;
          if (rawProfilePhoto) {
            const profilePhotoUrl = `${process.env.FILE_UPLOADS_URL}/patient/photos/${rawProfilePhoto}`;
            const profilePhotoBlob = await fetch(profilePhotoUrl).then((response) => response.blob());
            const profilePhotoObjectURL = URL.createObjectURL(profilePhotoBlob);
            profilePhoto = { preview: profilePhotoObjectURL };
          }

          setDemographicsFormState((prevState) => ({
            ...prevState,
            formValues: {
              ...prevState.formValues,
              profilePhoto,
              firstName: _.get(patient, 'firstName', ''),
              middleName: _.get(patient, 'middleName', ''),
              lastName: _.get(patient, 'lastName', ''),
              birthDate: _.get(patient, 'birthDate', ''),
              email: _.get(patient, 'email', ''),
              contactNo: _.get(patient, 'contactNo', ''),
            },
          }));
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
    const { formValues } = demographicsFormState;
    const {
      profilePhoto = '',
      firstName = '',
      middleName = '',
      lastName = '',
      birthDate = '',
      email = '',
      contactNo = '',
    } = formValues;

    try {
      setDemographicsFormState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      await handleOnFormSubmit(
        {
          firstName,
          middleName,
          lastName,
          birthDate,
          email,
          contactNo,
          profilePhoto,
        },
        (patientId) => {
          toast.success("Successfully updated patient's demographics data.");
          router.push(`/dashboard/patients/additional-data/${patientId}`);
        }
      );
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          setDemographicsFormState((prevState) => ({
            ...prevState,
            formErrors: {
              profilePhoto: _.get(validationErrors, 'profilePhoto', null),
              firstName: _.get(validationErrors, 'firstName', null),
              lastName: _.get(validationErrors, 'lastName', null),
              birthDate: _.get(validationErrors, 'birthDate', null),
              email: _.get(validationErrors, 'email', null),
              contactNo: _.get(validationErrors, 'contactNo', null),
            },
          }));
        },
      });
    } finally {
      setDemographicsFormState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }

  function handleValueChange(field: string, value: any) {
    setDemographicsFormState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [field]: value,
      },
    }));
  }

  function resetErrors() {
    setDemographicsFormState((prevState) => ({
      ...prevState,
      formErrors: {},
    }));
  }

  function displayPhotoModal(display: boolean) {
    setDemographicsFormState((prevState) => ({
      ...prevState,
      displayProfilePhotoModal: display,
    }));
  }

  const { formValues, formErrors } = demographicsFormState;
  const {
    profilePhoto = '',
    firstName = '',
    middleName = '',
    lastName = '',
    birthDate = '',
    email = '',
    contactNo = '',
  } = formValues;
  const profilePhotoError = _.get(formErrors, 'profilePhoto', null);

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
                  onClick={() => displayPhotoModal(true)}
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
                loading={loading}
              />
              <Input
                type="text"
                label="Middle Name"
                id={'middleName'}
                value={middleName}
                onValueChange={(v) => handleValueChange('middleName', v)}
                error={_.get(formErrors, 'middleName', null)}
                loading={loading}
              />
              <Input
                type="text"
                label="Last Name"
                id={'lastName'}
                value={lastName}
                onValueChange={(v) => handleValueChange('lastName', v)}
                error={_.get(formErrors, 'lastName', null)}
                loading={loading}
              />
              <Input
                type="date"
                label="Birth Date"
                id={'birthDate'}
                value={birthDate}
                onValueChange={(v) => handleValueChange('birthDate', v)}
                error={_.get(formErrors, 'birthDate', null)}
                loading={loading}
              />
              <Input
                type="email"
                label="Email"
                id={'email'}
                value={email}
                onValueChange={(v) => handleValueChange('email', v)}
                error={_.get(formErrors, 'email', null)}
                loading={loading}
              />
              <Input
                type="text"
                label="Contact No"
                id={'contactNo'}
                value={contactNo}
                onValueChange={(v) => handleValueChange('contactNo', v)}
                error={_.get(formErrors, 'contactNo', null)}
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
        showModal={demographicsFormState.displayProfilePhotoModal}
        onClose={() => displayPhotoModal(false)}
        profilePhoto={profilePhoto}
        onUpdateProfilePhoto={(newPhoto) => handleValueChange('profilePhoto', newPhoto)}
      />
    </DashboardLayout>
  );
}
