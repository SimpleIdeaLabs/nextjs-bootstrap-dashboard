import _ from 'lodash';
import { useRouter } from 'next/router';
import { authenticatedRequest } from '../../../../utils/axios-util';
import DemographicsForm from '../../../../components/dashboard/patients/additional-data-form';

interface HandleUpdateDemographicsParams {
  payload: {
    profilePhoto: any;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: string;
    email: string;
    contactNo: string;
  };
  callback: (patientId: number) => void;
}

export default function UpdatePatientDemographics() {
  const router = useRouter();
  const patientId = _.get(router, 'query.patientId', null);

  async function handleUpdateDemographics(params: HandleUpdateDemographicsParams) {
    const { payload, callback } = params;
    const { firstName, middleName, lastName, birthDate, email, contactNo, profilePhoto } = payload;

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('middleName', middleName);
    formData.append('lastName', lastName);
    formData.append('birthDate', birthDate);
    formData.append('email', email);
    formData.append('contactNo', contactNo);

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
    } = await authenticatedRequest.patch(`/patient/${patientId}/demographics`, formData, config);
    if (!status) {
      throw new Error(message);
    }
    if (patientId) {
      callback(Number(patientId));
    }
  }

  return <DemographicsForm mode="edit" handleOnFormSubmit={handleUpdateDemographics} patientId={patientId} />;
}
