import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../../../core/models/doctor.model';
import { Patient } from '../../../../core/models/patient.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentService } from '../../service/appointment.service';
import { DoctorService } from '../../../doctors/service/doctor.service';
import { PatientService } from '../../../patients/service/patient.service';
import moment from 'moment';

@Component({
  selector: 'app-appointment-post',
  templateUrl: './appointment-post.component.html',
  styleUrl: './appointment-post.component.css',
})
export class AppointmentPostComponent implements OnInit {
  appointmentForm: FormGroup;
  creationMessage: string = '';
  doctors: Doctor[] = [];
  patients: Patient[] = [];

  constructor(
    private _fb: FormBuilder,
    private _appointmentService: AppointmentService,
    private _doctorService: DoctorService,
    private _patientService: PatientService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.appointmentForm = this._fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
  }

  loadDoctors() {
    this._doctorService.getDoctors(0, 10).subscribe({
      next: (response) => {
        console.log('Doctors ', response);
        this.doctors = response.content;
      },
      error: (error) => console.error('Error fetching doctors:', error),
    });
  }

  loadPatients() {
    this._patientService.getPatients(0, 10).subscribe({
      next: (response) => {
        console.log('Patients ', response);
        this.patients = response.content;
      },
      error: (error) => console.error('Error fetching patients:', error),
    });
  }

  onPatientSelected(event: any) {
    const selectedPatient = this.patients.find((a) => a.id === event.value);
    if (selectedPatient) {
      this.appointmentForm.patchValue({
        patientId: selectedPatient.id,
      });
    }
  }

  onDoctorSelected(event: any) {
    console.log('Selected doctor event:', event);
    const selectedDoctor = this.doctors.find((c) => c.id === event.value);
    if (selectedDoctor) {
      this.appointmentForm.patchValue({
        doctorId: selectedDoctor.id,
      });
    }
  }

  submitForm() {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.getRawValue(); // Use getRawValue() to include disabled fields
      // Combinar la fecha y la hora en un solo objeto ISO string con formato adecuado
      const combinedDateTime = moment(formValues.date)
        .set({
          hour: moment(formValues.time, 'HH:mm').hour() + 2,
          minute: moment(formValues.time, 'HH:mm').minute(),
        })
        .toISOString(); // Esto generará el formato 2021-01-14T03:07:22.000Z automáticamente
      let dateToSend = combinedDateTime.substring(
        0,
        combinedDateTime.length - 5
      );
      console.log(dateToSend);
      // Crear el objeto de la nueva cita
      const newAppointment: Appointment = {
        doctorId: formValues.doctorId,
        patientId: formValues.patientId,
        date: dateToSend,
        diagnostic: '',
        treatment: '',
      };

      console.log('New Appointment:', newAppointment);

      this._appointmentService.createAppointment(newAppointment).subscribe({
        next: (createdAppointment: Appointment) => {
          this.showSnackBar('Cita creada exitosamente', 'Éxito');
          this.resetForm();
          this._router.navigate(['/appointments/list']); // Redirigir a la página de lista citas.
        },
        error: (error) => {
          console.error('Error al crear la cita:', error);
          this.showSnackBar(
            'Error al crear la cita. Por favor, inténtelo de nuevo más tarde.',
            'Error'
          );
        },
      });
    } else {
      console.error('Error al crear la cita: Formulario inválido');
      console.log('Form Controls:', this.appointmentForm.controls);
      Object.keys(this.appointmentForm.controls).forEach((key) => {
        const controlErrors = this.appointmentForm.get(key)?.errors;
        if (controlErrors != null) {
          console.log('Key control: ' + key + ', errors: ', controlErrors);
        }
      });
      this.showSnackBar(
        'Formulario inválido. Revise los datos ingresados.',
        'Okay'
      );
    }
  }

  showSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  resetForm() {
    this.appointmentForm.reset();
    Object.keys(this.appointmentForm.controls).forEach((key) => {
      this.appointmentForm.get(key)?.setErrors(null);
      this.appointmentForm.get(key)?.markAsPristine();
      this.appointmentForm.get(key)?.markAsUntouched();
    });
  }
}
