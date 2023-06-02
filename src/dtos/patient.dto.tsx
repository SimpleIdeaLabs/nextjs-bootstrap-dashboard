import { AdminRegion } from "ph-geo-admin-divisions/lib/dtos";
import { Patient } from "../models/patient.model";

export class GetPatientDataParams {
  patientId!: number;
}

export class GetPatientDataResponse {
  patient!: Patient;
}

export class GetPatientDemographicsParams extends GetPatientDataParams {}

export class GetPatientDemographicsResponse extends GetPatientDataResponse {}

export class GetPatientAdditionalDataParams extends GetPatientDataParams {
}

export class GetPatientAdditionalDataResponse extends GetPatientDataResponse {
}

export class PatientDemographicsDataParams {
  payload!: {
    profilePhoto: any;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: string;
    email: string;
    contactNo: string;
  };
  onSuccess!: (patientId?: number) => void;
  onError!: (params: any) => void;
}
