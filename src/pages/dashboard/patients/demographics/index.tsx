import DemographicsForm from '../../../../components/dashboard/patients/demographics-form';
import { PatientDemographicsDataParams } from '../../../../dtos/patient.dto';
import { authenticatedRequest } from '../../../../utils/axios-util';

export default function CreatePatientDemographics() {
  /**
   * Create Patient
   * Demographics data
   */
  async function handleCreatePatientDemographics(params: PatientDemographicsDataParams) {
    const { payload, onSuccess, onError } = params;
    try {
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
        onError(new Error(message));
      }
      onSuccess(patientId);
    } catch (error) {
      onError(error);
    }
  }

  return (
    <DemographicsForm
      mode="create"
      handleOnFormSubmit={handleCreatePatientDemographics}
      loading={false}
      patient={null}
    />
  );
}
