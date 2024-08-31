import { Component, ViewChild } from '@angular/core';
import { Appointment } from '../../../../core/models/appointment.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AppointmentService } from '../../service/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent {
  displayedColumns: string[] = [
    'date',
    'patient',
    'patientSurname',
    'doctor',
    'doctorSurname',
  ];
  dataSource = new MatTableDataSource<Appointment>();
  searchControl = new FormControl('');
  searchTypeControl = new FormControl('');
  documentControl = new FormControl('');
  appointments: Appointment[] = [];
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _appointmentService: AppointmentService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getAppointments(0, 4);
    this.dataSource.paginator = this.paginator;
    //this.trainingTypeControl.valueChanges.subscribe(() => this.applyFilter());
    this.dataSource.sort = this.sort;
  }

  getAppointments(page: number, size: number): void {
    this._appointmentService.getAppointments(page, size).subscribe({
      next: (value) => {
        if (value && value.content) {
          this.dataSource.data = value.content;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
        } else {
          console.error('Invalid response structure', value);
        }
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
      },
    });
  }

  goToDetail(appointment: Appointment): void {
    if (appointment && appointment.appointmentId) {
      this._router.navigate([
        `/appointments/detail/${appointment.appointmentId}`,
      ]);
    }
  }

  searchAppointmentsByDocument(): void {
    const document = this.documentControl.value;
    const searchType = this.searchTypeControl.value;

    if (document && searchType) {
      if (searchType === 'doctor') {
        this._appointmentService
          .getAppointmentsByDoctorDocument(
            document,
            this.paginator.pageIndex,
            this.paginator.pageSize
          )
          .subscribe(
            (appointments: any) => {
              if (appointments.content.length > 0) {
                this.dataSource.data = appointments.content;
                this.errorMessage = null;
              } else {
                this.showErrorMessage();
                this.getAppointments(0, 4);
              }
            },
            (error) => {
              console.error(
                "Error fetching appointments by doctor's document:",
                error
              );
              this.showErrorMessage();
              this.getAppointments(0, 4);
            }
          );
      } else if (searchType === 'patient') {
        this._appointmentService
          .getAppointmentsByPatientDocument(
            document,
            this.paginator.pageIndex,
            this.paginator.pageSize
          )
          .subscribe(
            (appointments: any) => {
              if (appointments.content.length > 0) {
                this.dataSource.data = appointments.content;
                this.errorMessage = null;
              } else {
                this.showErrorMessage();
                this.getAppointments(0, 4);
              }
            },
            (error) => {
              console.error(
                "Error fetching appointments by patient's document:",
                error
              );
              this.showErrorMessage();
              this.getAppointments(0, 4);
            }
          );
      }
    }
  }
  public onPageChange(event: any): void {
    this.getAppointments(event.pageIndex, event.pageSize);
  }

  showErrorMessage(): void {
    this.errorMessage = 'Documento no encontrado';
    this.documentControl.setValue('');
  }
}
