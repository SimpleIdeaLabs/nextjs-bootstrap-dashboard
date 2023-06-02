import axios from 'axios';
import {
  DeleteUserParams,
  DeleteUserResponse,
  GetCurrentUserResponse,
  GetUserListParams,
  GetUserListResponse,
  LoginUserParams,
  LoginUserResponse,
} from '../dtos/user.dtos';
import Cookies from 'js-cookie';
import { plainToClass } from 'class-transformer';
import { User } from '../models/user.model';
import * as _ from 'lodash';
import { authenticatedRequest } from '../utils/axios-util';

export class UserService {
  /**
   * Login User
   */
  public static async login(params: LoginUserParams): Promise<LoginUserResponse> {
    const {
      data: { data: responseData },
    } = await axios.post(`${process.env.API_URL}/user/login`, params);
    const response = new LoginUserResponse();
    response.token = responseData.token;
    return response;
  }

  /**
   * Logout User
   */
  public static async logout(callback: () => void) {
    Cookies.remove('token');
    if (_.isFunction(callback)) {
      callback();
    }
  }

  /**
   * Get Current User
   */
  public static async getCurrentUser(): Promise<GetCurrentUserResponse> {
    const token = Cookies.get('token');
    const {
      data: { data: responseData },
    } = await axios.get(`${process.env.API_URL}/user/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const response = new GetCurrentUserResponse();
    response.currentUser = plainToClass(User, responseData);
    return response;
  }

  /**
   * Get System User List
   */
  public static async getUserList(params: GetUserListParams): Promise<GetUserListResponse> {
    const { pagination, search, filter } = params;
    const { page, limit } = pagination;
    const { firstName = '', lastName = '', email = '' } = search;
    const { role = [] } = filter;
    let requestUrl = `/user?page=${page}&limit=${limit}`;

    if (firstName) {
      requestUrl = `${requestUrl}&firstName=${firstName}`;
    }
    if (lastName) {
      requestUrl = `${requestUrl}&lastName=${lastName}`;
    }
    if (email) {
      requestUrl = `${requestUrl}&email=${email}`;
    }

    if (role.length) {
      const filterRoleQueryParams = role.map((f: string) => `role=${f}`).join('&');
      requestUrl = `${requestUrl}&${filterRoleQueryParams}`;
    }
    const {
      data: { data: responseData },
    } = await authenticatedRequest.get(requestUrl);
    const response = new GetUserListResponse();
    response.pagination = responseData.pagination;
    response.users = responseData.users;
    return response;
  }

  /**
   * Get System User
   */

  /**
   * Update System User
   */

  /**
   * Delete System User
   */
  public static async deleteUser(params: DeleteUserParams): Promise<DeleteUserResponse> {
    const { userId } = params;
    const {
      data: { status },
    } = await authenticatedRequest.delete(`/user/${userId}`);
    const response = new DeleteUserResponse();
    response.status = status;
    return response;
  }
}
