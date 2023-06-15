import { AdminRegion } from 'ph-geo-admin-divisions/lib/dtos';
import { Patient } from '../models/patient.model';
import { Pagination, PaginationParams } from './shared.dto';

export class GetPatientDataParams {
  patientId!: number;
}

export class GetPatientDataResponse {
  patient!: Patient;
}

export class GetPatientListParams {
  pagination!: Pagination;
  search!: {
    firstName: string;
    lastName: string;
    controlNo: string;
  };
}

export class GetPatientListResponse {
  patients!: Patient[];
  pagination!: Pagination;
}

export class GetPatientDemographicsParams extends GetPatientDataParams {}

export class GetPatientDemographicsResponse extends GetPatientDataResponse {}

export class GetPatientAdditionalDataParams extends GetPatientDataParams {}

export class GetPatientAdditionalDataResponse extends GetPatientDataResponse {}

export class DeletePatientParams {
  patientId!: number;
}

export class DeletePatientResponse {
  status!: boolean;
}
