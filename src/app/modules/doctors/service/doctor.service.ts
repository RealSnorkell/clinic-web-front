import { Injectable } from '@angular/core';
import { backUrl } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../../../core/models/doctor.model';
import { Page } from '../../../core/models/page.model';
import { Appointment } from '../../../core/models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private _apiUrl = backUrl + '/doctors';

  constructor(private _http: HttpClient) {}

  getDoctors(page: number, size: number): Observable<Page<Doctor>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<Doctor>>(this._apiUrl, { params });
  }

  getDoctorByDocument(document: string): Observable<Doctor> {
    return this._http.get<Doctor>(`${this._apiUrl}/list/${document}`);
  }

  getAppointmentsByDoctorDocument(
    document: string
  ): Observable<Page<Appointment>> {
    return this._http.get<Page<Appointment>>(
      `${backUrl}/appointments/doctors/${document}`
    );
  }

  getDoctor(id: string): Observable<Doctor> {
    return this._http.get<Doctor>(`${this._apiUrl}/${id}`);
  }

  postDoctor(doctor: Doctor): Observable<Doctor> {
    return this._http.post<Doctor>(this._apiUrl, doctor);
  }

  updateDoctor(id: string, doctor: Doctor): Observable<Doctor> {
    return this._http.patch<Doctor>(`${this._apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
