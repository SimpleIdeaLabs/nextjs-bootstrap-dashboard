export class User {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  profilePhoto!: string;
  roles!: {
    id: number,
    key: string
  }
}
