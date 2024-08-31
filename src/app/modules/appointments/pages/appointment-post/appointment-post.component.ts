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
      patientName: [{ value: '', disabled: true }, Validators.required],
      patientSurname: [{ value: '', disabled: true }, Validators.required],
      patientDocument: [{ value: '', disabled: true }, Validators.required],
      doctorId: ['', Validators.required],
      doctorName: [{ value: '', disabled: true }, Validators.required],
      doctorSurname: [{ value: '', disabled: true }, Validators.required],
      doctorDocument: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
  }

  loadDoctors() {
    this._doctorService.getDoctors(0, 10).subscribe({
      next: (response) => {
        this.doctors = response.content;
      },
      error: (error) => console.error('Error fetching doctors:', error),
    });
  }

  loadPatients() {
    this._patientService.getPatients(0, 20).subscribe({
      next: (response) => {
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
        patientName: selectedPatient.personalInformationDto.name,
        patientSurname: selectedPatient.personalInformationDto.surname,
        patientDocument: selectedPatient.personalInformationDto.document,
      });
    }
  }

  onDoctorSelected(event: any) {
    console.log('Selected coach event:', event);
    const selectedDoctor = this.doctors.find((c) => c.id === event.value);
    if (selectedDoctor) {
      this.appointmentForm.patchValue({
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.personalInformationDto.name,
        doctorSurname: selectedDoctor.personalInformationDto.surname,
        doctorDocument: selectedDoctor.personalInformationDto.document,
      });
    }
  }

  submitForm() {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.getRawValue(); // Use getRawValue() to include disabled fields

      // Combinar la fecha y la hora en un solo objeto ISO string con formato adecuado
      /* const combinedDateTime = moment(formValues.date)
        .set({
          hour: moment(formValues.time, 'HH:mm').hour(),
          minute: moment(formValues.time, 'HH:mm').minute(),
        })
        .toISOString(); */ // Esto generará el formato 2021-01-14T03:07:22.000Z automáticamente

      // Crear el objeto de la nueva cita
      const newAppointment = {
        id: formValues.id,
        //date: combinedDateTime,
        doctorId: formValues.doctorId,
        doctorName: formValues.doctorName,
        doctorSurname: formValues.doctorSurname,
        doctorDocument: formValues.doctorDocument,
        patientId: formValues.patientId,
        patientName: formValues.patientName,
        patientSurname: formValues.patientSurname,
        patientDocument: formValues.patientDocument,
        /*  trainingTypeRecord:
          TrainingTypeRecordMap[
            formValues.trainingType as FriendlyTrainingType
          ], */ // Convertir el tipo de entrenamiento
      };

      console.log('New Appointment:', newAppointment);

      this._appointmentService.createAppointment(newAppointment).subscribe({
        next: (createdAppointment: Appointment) => {
          this.showSnackBar('Cita creada exitosamente', 'Éxito');
          this.resetForm();
          this._router.navigate([
            '/appointments/detail',
            createdAppointment.appointmentId,
          ]); // Redirigir a la página de detalles de la cita
        },
        error: (error) => {
          console.error('Error al crear la cita:', error);
          if (error.status === 400 && error.error) {
            console.error('Detalles del error:', error.error);
            this.showSnackBar(
              `Error al crear la cita: ${error.error}`,
              'Error'
            );
          } else {
            this.showSnackBar(
              'Error al crear la cita. Por favor, inténtelo de nuevo más tarde.',
              'Error'
            );
          }
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
