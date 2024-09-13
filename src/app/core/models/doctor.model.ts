import { PersonalInformation } from './common.model';

export interface Doctor {
  id?: string;
  licenseNum: string;
  mirDate: Date | string;
  idDoctorAppointments: string[];
  specializations: string[];
  personalInformationDto: PersonalInformation;
}
