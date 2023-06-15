import { plainToClass } from 'class-transformer';
import {
  DeletePatientParams,
  DeletePatientResponse,
  GetPatientAdditionalDataParams,
  GetPatientAdditionalDataResponse,
  GetPatientDemographicsParams,
  GetPatientDemographicsResponse,
  GetPatientListParams,
  GetPatientListResponse,
} from '../dtos/patient.dto';
import { authenticatedRequest } from '../utils/axios-util';
import { Patient } from '../models/patient.model';

export class PatientService {
  /**
   * Get Patient List
   */
  public static async getPatientList(params: GetPatientListParams): Promise<GetPatientListResponse> {
    const { pagination, search } = params;
    const { page, limit } = pagination;
    const { firstName = '', lastName = '', controlNo = '' } = search;
    let requestUrl = `/patient?page=${page}&limit=${limit}`;

    if (firstName || lastName || controlNo) {
      if (firstName) {
        requestUrl = `${requestUrl}&firstName=${firstName}`;
      }
      if (lastName) {
        requestUrl = `${requestUrl}&lastName=${lastName}`;
      }
      if (controlNo) {
        requestUrl = `${requestUrl}&controlNo=${controlNo}`;
      }
    }
    const response = await authenticatedRequest.get(requestUrl);
    const {
      data: { data: responseData },
    } = response;
    const getPatientListResponse = new GetPatientListResponse();
    getPatientListResponse.patients = responseData.patients;
    getPatientListResponse.pagination = responseData.pagination;
    return getPatientListResponse;
  }

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

  public static async deletePatient(params: DeletePatientParams): Promise<DeletePatientResponse> {
    const { patientId } = params;
    await authenticatedRequest.delete(`/patient/${patientId}`);
    const deletePatientResponse = new DeletePatientResponse();
    deletePatientResponse.status = true;
    return deletePatientResponse;
  }
}
