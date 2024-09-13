import { PersonalInformation } from './common.model';

export interface Patient {
  id?: string;
  socialSecurityNumber: string;
  height: number;
  weight: number;
  idPatientAppointments: string[];
  personalInformationDto: PersonalInformation;
}
