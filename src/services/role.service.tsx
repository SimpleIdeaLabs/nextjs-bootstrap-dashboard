import { plainToClass } from 'class-transformer';
import {
  CreateRoleParams,
  CreateRoleResponse,
  DeleteRoleParams,
  DeleteRoleResponse,
  GetRoleListParams,
  GetRoleListResponse,
  GetRoleParams,
  GetRoleResponse,
  UpdateRoleParams,
  UpdateRoleResponse,
} from '../dtos/role.dto';
import { authenticatedRequest } from '../utils/axios-util';
import { Role } from '../models/role.model';

export class RoleService {
  /**
   * Get Role Lists
   */
  public static async getRoleList(params: GetRoleListParams): Promise<GetRoleListResponse> {
    const { page, limit, keyword = null } = params;
    let fetchRolesUrl = `/role?page=${page}&limit=${limit}`;
    if (keyword) {
      fetchRolesUrl += `&keyword=${keyword}`;
    }
    const response = await authenticatedRequest.get(fetchRolesUrl);
    const {
      data: { data: responseData },
    } = response;
    const roleListResponse = new GetRoleListResponse();
    roleListResponse.pagination = responseData.pagination;
    roleListResponse.roles = responseData.roles;
    return roleListResponse;
  }

  /**
   * Get Role
   */
  public static async getRole(params: GetRoleParams): Promise<GetRoleResponse> {
    const { roleId } = params;
    const {
      data: { data: responseData },
    } = await authenticatedRequest.get(`/role/${roleId}`);
    const getRoleResponse = new GetRoleResponse();
    getRoleResponse.role = plainToClass(Role, responseData.role);
    return getRoleResponse;
  }

  /**
   * Create Role
   */
  public static async createRole(params: CreateRoleParams): Promise<CreateRoleResponse> {
    const {
      data: { data: responseData },
    } = await authenticatedRequest.post('/role', params);
    const createRoleResponse = new CreateRoleResponse();
    createRoleResponse.role = plainToClass(Role, responseData);
    return createRoleResponse;
  }

  /**
   * Update Role
   */
  public static async updateRole(params: UpdateRoleParams): Promise<UpdateRoleResponse> {
    const { roleId, name } = params;
    const {
      data: { data: responseData },
    } = await authenticatedRequest.patch(`/role/${roleId}`, {
      name,
    });
    console.log(responseData);
    const updateRoleResponse = new UpdateRoleResponse();
    updateRoleResponse.role = plainToClass(Role, responseData.role);
    return updateRoleResponse;
  }

  /**
   * Delete Role
   */
  public static async deleteRole(params: DeleteRoleParams): Promise<DeleteRoleResponse> {
    const { roleId } = params;
    const {
      data: { status },
    } = await authenticatedRequest.delete(`/role/${roleId}`);
    const deleteRoleResponse = new DeleteRoleResponse();
    deleteRoleResponse.status = status;
    return deleteRoleResponse;
  }
}
