import { Role } from '../models/role.model';
import { Pagination, PaginationParams } from './shared.dto';

export class GetRoleListParams extends PaginationParams {
  keyword?: string;
}

export class GetRoleListResponse {
  roles!: Role[];
  pagination!: Pagination;
}

export class GetRoleParams {
  roleId!: number;
}

export class GetRoleResponse {
  role!: Role;
}

export class UpdateRoleParams {
  roleId!: number;
  name!: string;
}

export class UpdateRoleResponse {
  role!: Role;
}

export class CreateRoleParams {
  name!: string;
}

export class CreateRoleResponse {
  role!: Role;
}

export class DeleteRoleParams {
  roleId!: number;
}

export class DeleteRoleResponse {
  status!: boolean;
}
