import { Injectable } from '@angular/core';
import { PatientService } from '../../patients/service/patient.service';
import { DoctorService } from '../../doctors/service/doctor.service';
import { backUrl } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../core/models/page.model';
import {
  Appointment,
  FullAppointment,
} from '../../../core/models/appointment.model';
import { Patient } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private _apiUrl = backUrl + '/appointments'; // Ajusta la URL según tu backend

  constructor(
    private _http: HttpClient,
    private _patientService: PatientService,
    private _doctorService: DoctorService
  ) {}

  getAppointments(page: number, size: number): Observable<Page<Appointment>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<Appointment>>(this._apiUrl, { params });
  }
  getAppointmentById(id: string): Observable<FullAppointment> {
    return this._http.get<FullAppointment>(`${this._apiUrl}/${id}`);
  }

  getAppointmentsByDoctorDocument(
    document: string,
    page: number,
    size: number
  ): Observable<Page<Appointment>> {
    return this._http.get<Page<Appointment>>(
      `${this._apiUrl}/doctors/searchByDocument?document=${document}&page=${page}&size=${size}`
    );
  }

  getAppointmentsByPatientDocument(
    document: string,
    page: number,
    size: number
  ): Observable<Page<Appointment>> {
    return this._http.get<Page<Appointment>>(
      `${this._apiUrl}/patients/searchByDocument?document=${document}&page=${page}&size=${size}`
    );
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    console.log('Creating appointment:', appointment);
    return this._http.post<Appointment>(this._apiUrl, appointment);
  }

  updateAppointment(
    id: string,
    appointment: Partial<Appointment>
  ): Observable<any> {
    return this._http.patch<any>(`${this._apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: string): Observable<any> {
    return this._http.delete<any>(`${this._apiUrl}/${id}`);
  }
}
