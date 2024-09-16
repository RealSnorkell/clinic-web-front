import { Component } from '@angular/core';
import { Patient } from '../../../../core/models/patient.model';
import { Doctor } from '../../../../core/models/doctor.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../service/appointment.service';
import { DoctorService } from '../../../doctors/service/doctor.service';
import { PatientService } from '../../../patients/service/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../../../../core/models/page.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import moment from 'moment';
import { FullAppointment } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
})
export class AppointmentDetailComponent {
  appointment: FullAppointment = {
    doctor: {
      id: '',
      licenseNum: '',
      mirDate: '',
      idDoctorAppointments: [],
      specializations: [],
      personalInformationDto: {
        name: '',
        surname: '',
        idDocument: '',
        document: '',
      },
    },
    patient: {
      id: '',
      socialSecurityNumber: '',
      height: 0,
      weight: 0,
      idPatientAppointments: [],
      personalInformationDto: {
        name: '',
        surname: '',
        idDocument: '',
        document: '',
      },
    },
    date: '',
  };

  doctor: Doctor = {} as Doctor;
  doctors: Doctor[] = [];
  patient: Patient = {} as Patient;
  patients: Patient[] = [];
  id: string = '';
  isEditing = false;
  appointmentForm: FormGroup;
  visibleButtons: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _appointmentService: AppointmentService,
    private _doctorService: DoctorService,
    private _patientService: PatientService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    public dialog: MatDialog
  ) {
    this.appointmentForm = this._fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      doctorId: ['', Validators.required],
      diagnostic: [''],
      treatment: [''],
    });
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getAppointmentById(this.id);
    });
    this.loadDoctors();
    this.loadPatients();
  }

  loadDoctors() {
    this._doctorService.getDoctors(0, 10).subscribe({
      next: (doctorPage: Page<Doctor>) => {
        if (Array.isArray(doctorPage.content)) {
          this.doctors = doctorPage.content;
        } else {
          console.error('Expected an array of doctors:', doctorPage.content);
        }
        console.log('Doctors loaded:', this.doctors);
      },
      error: (error) => console.error('Error fetching doctors', error),
    });
  }

  loadPatients() {
    this._patientService.getPatients(0, 10).subscribe({
      next: (patientPage: Page<Patient>) => {
        if (Array.isArray(patientPage.content)) {
          this.patients = patientPage.content;
        } else {
          console.error('Expected an array of patients:', patientPage.content);
        }
        console.log('Patients loaded:', this.patients);
      },
      error: (error) => console.error('Error fetching patients', error),
    });
  }

  getAppointmentById(id: string): void {
    this._appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        console.log('The appointment object:', this.appointment);
        this.getPatientById(this.appointment.patient.id as string);
        this.populateForm(); // Populate form with existing appointment data
      },
      error: (err) => console.error('Error fetching appointment', err),
    });
  }

  getPatientById(id: string): void {
    this._patientService.getPatientById(id).subscribe({
      next: (patient) => (this.patient = patient),
      error: (error) => console.error('Error fetching patient', error),
    });
  }

  onDoctorsSelected(event: any) {
    const selectedDoctorId = event.value;
    const selectedDoctor = this.doctors.find(
      (doctor) => doctor.id === selectedDoctorId
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.visibleButtons = !this.visibleButtons;
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      const combinedDateTime = moment(formValues.date)
        .set({
          hour: moment(formValues.time, 'HH:mm').hour(),
          minute: moment(formValues.time, 'HH:mm').minute(),
        })
        .toISOString(); // Esto generará un formato al que habrá que extraer los últimos 5 carácteres.
      let dateToSend = combinedDateTime.substring(
        0,
        combinedDateTime.length - 5
      );

      const updatedAppointment = {
        ...this.appointment,
        date: dateToSend,
        doctor: this.appointmentForm.get('doctorId')?.value,
        treatment: this.appointmentForm.get('treatment')?.value,
        diagnostic: this.appointmentForm.get('diagnostic')?.value,
      };

      console.log('Form Values:', formValues);
      console.log('Updated Appointment:', updatedAppointment);

      this._appointmentService
        .updateAppointment(this.id, updatedAppointment)
        .subscribe({
          next: () => {
            this._snackBar.open('Cita actualizada correctamente', 'Cerrar', {
              duration: 2000,
            });
            console.log(updatedAppointment);
            this.toggleEdit();
            this.getAppointmentById(this.id);
          },
          error: (error) => console.error('Error actualizando cita', error),
        });
    } else {
      console.error('Formulario no válido');
    }
  }

  populateForm(): void {
    if (this.appointment && this.appointment.date) {
      const date = moment(this.appointment.date).format('YYYY-MM-DD');
      const time = moment(this.appointment.date).format('HH:mm');
      this.appointmentForm.patchValue({
        date: date,
        time: time,
        doctorId: this.appointment.doctor.id,
      });
    }
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: '¿Está seguro de querer eliminar esta cita?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteAppointment();
      }
    });
  }

  deleteAppointment(): void {
    this._appointmentService.deleteAppointment(this.id).subscribe({
      next: () => {
        this._snackBar.open('Cita eliminada correctamente', 'Cerrar', {
          duration: 2000,
        });
        this._router.navigate(['/appointments/list']);
      },
      error: (error) => console.error('Error eliminando cita', error),
    });
  }
}
