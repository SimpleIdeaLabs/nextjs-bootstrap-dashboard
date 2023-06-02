import { User } from '../models/user.model';
import { Pagination, PaginationParams } from './shared.dto';

export class LoginUserParams {
  email!: string;
  password!: string;
}

export class LoginUserResponse {
  token!: string;
}

export class GetCurrentUserResponse {
  currentUser!: User;
}

export class GetUserListParams {
  pagination!: PaginationParams;
  search!: {
    firstName: string;
    lastName: string;
    email: string;
  };
  filter!: {
    role: any[];
  };
}

export class GetUserListResponse {
  users!: User[];
  pagination!: Pagination;
}

export class DeleteUserParams {
  userId!: number;
}

export class DeleteUserResponse {
  status!: boolean;
}
