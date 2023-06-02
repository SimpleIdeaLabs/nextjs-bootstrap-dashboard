import { AdminRegion } from "ph-geo-admin-divisions/lib/dtos";

export class Patient {
  id!: number;

  controlNo!: string;

  profilePhoto!: string;

  firstName!: string;

  middleName!: string;

  lastName!: string;

  email!: string;

  contactNo!: string;

  birthDate!: string;

  emergencyContactFirstName!: string;

  emergencyContactMiddleName!: string;

  emergencyContactLastName!: string;

  emergencyContactNo!: string;

  address1!: string;

  address2!: string;

  stateOrProvince!: AdminRegion;

  cityOrTown!: AdminRegion;

  baranggay!: AdminRegion;

  postalOrZip!: string;
}
