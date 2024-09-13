import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export interface Appointment {
  appointmentId?: string;
  doctorId: string;
  patientId: string;
  date: string;
  diagnostic?: string;
  treatment?: string;
}

export interface FullAppointment {
  appointmentId?: string;
  doctor: Doctor;
  patient: Patient;
  date: string;
  diagnostic?: string;
  treatment?: string;
}
