import { PersonalInformation } from './patient.model';

export interface Doctor {
  id: string;
  licenseNum: string;
  mirDate: Date;
  idDoctorAppointments: string[];
  specializations: string[];
  personalInformationDto: PersonalInformation;
}
