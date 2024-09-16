import { ViewChild, Component, Input, OnInit } from '@angular/core';
import { DoctorService } from '../../service/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from '../../../../core/models/doctor.model';

import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  Appointment,
  FullAppointment,
} from '../../../../core/models/appointment.model';
import { MatPaginator } from '@angular/material/paginator';
import { AppointmentService } from '../../../appointments/service/appointment.service';

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css',
})
export class DoctorDetailComponent implements OnInit {
  protected id: string = '';
  public doctor!: Doctor;
  protected visibleButtons: boolean = true;
  protected dataSource = new MatTableDataSource<Doctor>();
  protected appointmentsDataSource = new MatTableDataSource<Appointment>();
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'document'];
  protected appointmentDisplayedColumns: string[] = [
    'date',
    'patientName',
    'patientSurname',
    'socialSecurityNumber',
    'diagnostic',
    'treatment',
  ];

  private allAppointments: Appointment[] = [];
  protected activeAppointmentsCount = 0;
  protected isEditing = false;

  @Input() pageLengthAppointments = 0;
  @Input() pageSizeAppointments = 5;
  @ViewChild('paginatorAppointments') paginatorAppointments!: MatPaginator;

  constructor(
    private _doctorService: DoctorService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getDoctorById(this.id);
    });
  }

  getDoctorById(id: string): void {
    this._doctorService.getDoctor(id).subscribe({
      next: (value) => {
        this.doctor = value;
        this.loadAllAppointments();
      },
      error: (error) => {
        console.error('Error getting doctor', error);
      },
    });
  }

  loadAllAppointments(): void {
    this._doctorService
      .getAppointmentsByDoctorDocument(
        this.doctor.personalInformationDto.document
      )
      .subscribe({
        next: (response) => {
          this.allAppointments = response.content;
          this.pageLengthAppointments = response.totalElements;
          this.updateAppointmentsDataSource(0, this.pageSizeAppointments);
          console.log('Citas', this.allAppointments);
          console.log(this.allAppointments);
        },
        error: (error) => {
          console.error('Error fetching appointments', error);
        },
      });
  }

  updateAppointmentsDataSource(pageIndex: number, pageSize: number): void {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    if (startIndex < this.allAppointments.length) {
      this.appointmentsDataSource.data = this.allAppointments.slice(
        startIndex,
        Math.min(endIndex, this.allAppointments.length)
      );
    } else {
      this.appointmentsDataSource.data = [];
    }
  }

  goToAppointmentDetails(appointment: Appointment): void {
    if (appointment && appointment.appointmentId) {
      this._routerNav.navigate([
        `/appointments/detail/${appointment.appointmentId}`,
      ]);
    }
  }

  onAppointmentsPageChange(event: any): void {
    this.updateAppointmentsDataSource(event.pageIndex, event.pageSize);
  }

  enableEditing(): void {
    this.isEditing = !this.isEditing;
    this.visibleButtons = !this.visibleButtons;
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDoctor();
      }
    });
  }

  deleteDoctor(): void {
    this._doctorService.deleteDoctor(this.id).subscribe({
      next: () => {
        console.log('Doctor successfully deleted');
        this._routerNav.navigate(['/doctors/list']);
      },
      error: (error) => {
        console.error('Error deleting doctor', error);
      },
    });
    this.doctor.idDoctorAppointments.forEach((appointmentId) => {
      this._appointmentService.deleteAppointment(appointmentId).subscribe({
        next: () => {
          console.log('Successfully deleted appointment: ', appointmentId);
        },
        error: () => {
          console.log('Error deleting', appointmentId, ' appointment');
        },
      });
    });
  }

  onSubmit(): void {
    if (this.doctor) {
      this._doctorService.updateDoctor(this.id, this.doctor).subscribe({
        next: () => {
          console.log('Doctor successfully updated');
          this.enableEditing();
          this._snackBar.open('Doctor actualizado correctamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating doctor', error);
        },
      });
      this.doctor.idDoctorAppointments.forEach((appointmentId) => {
        this._appointmentService.getAppointmentById(appointmentId).subscribe({
          next: (appointment) => {
            appointment.doctor = this.doctor;
            this._appointmentService.updateAppointment(
              appointmentId,
              appointment
            );
          },
          error: (error) => {
            console.log(
              'Error updating appointments for updated doctor. ',
              error
            );
          },
        });
      });
    }
  }

  modifyDoctor(): void {
    this.enableEditing();
  }
}
