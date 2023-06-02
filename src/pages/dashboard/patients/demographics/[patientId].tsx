import _ from 'lodash';
import { useRouter } from 'next/router';
import { authenticatedRequest } from '../../../../utils/axios-util';
import DemographicsForm from '../../../../components/dashboard/patients/demographics-form';
import { useEffect, useState } from 'react';
import { Patient } from '../../../../models/patient.model';
import { PatientService } from '../../../../services/patient.service';
import { PatientDemographicsDataParams } from '../../../../dtos/patient.dto';

export default function UpdatePatientDemographics() {
  const router = useRouter();
  const [patientId, setPatientId] = useState<number | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _patientId = _.get(router, 'query.patientId', null);

    /**
     * Get Patient
     * Additional Data
     */
    async function getPatientAdditionalData() {
      if (!patientId) return;
      const { patient = null } = await PatientService.getDemographics({
        patientId,
      });
      setPatient(patient);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    if (_patientId) {
      setPatientId(Number(_patientId));
      getPatientAdditionalData();
    }
  }, [router, patientId]);

  async function handleUpdateDemographics(params: PatientDemographicsDataParams) {
    const { payload, onError, onSuccess } = params;
    try {
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
        onError(new Error(message));
      }
      if (patientId) {
        onSuccess(patientId);
      }
    } catch (error) {
      onError(error);
    }
  }

  return (
    <DemographicsForm mode="edit" handleOnFormSubmit={handleUpdateDemographics} patient={patient} loading={loading} />
  );
}
