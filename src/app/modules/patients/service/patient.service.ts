import { Injectable } from '@angular/core';
import { Doctor } from '../../../core/models/doctor.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../../../core/models/appointment.model';
import { Page } from '../../../core/models/page.model';
import { backUrl } from '../../../environment';
import { Patient } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private _apiUrl = backUrl + '/patients';
  constructor(private _http: HttpClient) {}

  getPatients(page: number, size: number): Observable<Page<Patient>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<Patient>>(this._apiUrl, { params });
  }

  getPatientById(id: string): Observable<Patient> {
    return this._http.get<Patient>(`${this._apiUrl}/${id}`);
  }
  createPatient(patient: Patient): Observable<Patient> {
    return this._http.post<Patient>(this._apiUrl, patient);
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this._http.patch<Patient>(`${this._apiUrl}/${patient.id}`, patient);
  }

  deletePatient(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }

  getPatientByDocument(document: string): Observable<Patient> {
    return this._http.get<Patient>(`${this._apiUrl}/list/${document}`);
  }

  getAppointmentsByPatientDocument(
    document: string
  ): Observable<Page<Appointment>> {
    return this._http.get<Page<Appointment>>(
      `${backUrl}/appointments/patients/${document}`
    );
  }
}
