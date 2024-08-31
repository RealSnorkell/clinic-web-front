import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export interface Appointment {
  appointmentId: string;
  doctor: Doctor;
  patient: Patient;
  date: Date;
  diagnostic: string;
  treatment: string;
}
