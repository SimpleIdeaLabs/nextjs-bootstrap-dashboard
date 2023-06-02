import _ from 'lodash';
import { useRouter } from 'next/router';
import { authenticatedRequest } from '../../../../utils/axios-util';
import AdditionalDataForm from '../../../../components/dashboard/patients/additional-data-form';
import { PatientService } from '../../../../services/patient.service';
import { useEffect, useState } from 'react';
import { Patient } from '../../../../models/patient.model';

export interface HandleUpdateAdditionalDataParams {
  payload: {
    emergencyContactFirstName: string;
    emergencyContactMiddleName: string;
    emergencyContactLastName: string;
    emergencyContactNo: string;
    address1: string;
    address2: string;
    province: string;
    municipality: string;
    baranggay: string;
    postal: string;
  };
  onSuccess: () => void;
  onError: (params: any) => void;
}

export default function PatientAdditionalData() {
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
      const { patient = null } = await PatientService.getAdditionalData({
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

  /**
   * Update
   * Additional
   * Patient Data
   */
  async function handleUpdateAdditionalData(params: HandleUpdateAdditionalDataParams) {
    const { payload, onSuccess, onError } = params;
    try {
      const {
        data: { status, message },
      } = await authenticatedRequest.patch(`/patient/${patientId}/additional-data`, payload);
      if (!status) {
        onError(new Error(message));
      }
      onSuccess();
    } catch (error) {
      onError(error);
    }
  }

  return <AdditionalDataForm handleOnFormSubmit={handleUpdateAdditionalData} patient={patient} loading={loading} />;
}
