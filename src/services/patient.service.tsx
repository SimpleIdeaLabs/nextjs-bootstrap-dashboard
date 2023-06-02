import { plainToClass } from 'class-transformer';
import {
  GetPatientAdditionalDataParams,
  GetPatientAdditionalDataResponse,
  GetPatientDemographicsParams,
  GetPatientDemographicsResponse,
} from '../dtos/patient.dto';
import { authenticatedRequest } from '../utils/axios-util';
import { Patient } from '../models/patient.model';

export class PatientService {
  /**
   * Get Patient's
   * Demographics
   */
  public static async getDemographics(params: GetPatientDemographicsParams): Promise<GetPatientDemographicsResponse> {
    const { patientId } = params;
    const {
      data: { data: responseData },
    } = await authenticatedRequest.get(`/patient/${patientId}/demographics`);
    const response = new GetPatientDemographicsResponse();
    response.patient = plainToClass(Patient, responseData.patient);
    return response;
  }

  /**
   * Get Patient's
   * Additional Data
   */
  public static async getAdditionalData(
    params: GetPatientAdditionalDataParams
  ): Promise<GetPatientAdditionalDataResponse> {
    const { patientId } = params;
    const {
      data: { data: responseData },
    } = await authenticatedRequest.get(`/patient/${patientId}/additional-data`);
    const response = new GetPatientAdditionalDataResponse();
    response.patient = plainToClass(Patient, responseData.patient);
    return response;
  }
}
