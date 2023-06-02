import { authenticatedRequest } from '../../../../utils/axios-util';
import DemographicsForm from '../_components/demographics-form';

interface CreatePatientDemographicsParams {
  payload: {
    profilePhoto: any;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: string;
    email: string;
    contactNo: string;
  };
  callback: (patientId: any) => void;
}

export default function CreatePatientDemographics() {
  /**
   * Create Patient
   * Demographics data
   */
  async function handleCreatePatientDemographics(params: CreatePatientDemographicsParams) {
    const { payload, callback } = params;
    const { firstName, middleName, lastName, birthDate, email, contactNo, profilePhoto } = payload;

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('middleName', middleName);
    formData.append('lastName', lastName);
    formData.append('birthDate', birthDate);
    formData.append('email', email);
    formData.append('contactNo', contactNo);
    formData.append('profilePhoto', profilePhoto);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    const {
      data: {
        status,
        message,
        data: {
          patient: { id: patientId },
        },
      },
    } = await authenticatedRequest.post('/patient/demographics', formData, config);
    if (!status) {
      throw new Error(message);
    }
    callback(patientId);
  }

  return <DemographicsForm mode="create" handleOnFormSubmit={handleCreatePatientDemographics} />;
}
