export interface Patient {
  id?: string;
  socialSecurityNumber: string;
  height: number;
  weight: number;
  idPatientAppointments: string[];
  personalInformationDto: PersonalInformation;
}

export interface PersonalInformation {
  name: string;
  surname: string;
  idDocument: string;
  document: string;
}

export enum DocumentType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
  NIE = 'NIE',
}
