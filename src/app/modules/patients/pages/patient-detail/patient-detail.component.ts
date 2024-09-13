import { Component, Input, ViewChild } from '@angular/core';
import { Appointment } from '../../../../core/models/appointment.model';
import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../service/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../../../appointments/service/appointment.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
})
export class PatientDetailComponent {
  protected id: string = '';
  public patient!: Patient;
  protected visibleButtons: boolean = true;
  protected dataSource = new MatTableDataSource<Patient>();
  protected appointmentsDataSource = new MatTableDataSource<Appointment>();
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'document'];
  protected appointmentDisplayedColumns: string[] = [
    'date',
    'doctorName',
    'doctorSurname',
    'licenseNum',
    'diagnostic',
    'treatment',
  ];
  protected activeAppointmentsCount = 0;
  protected isEditing = false;

  @Input() pageLengthAppointments = 0;
  @Input() pageSizeAppointments = 4;
  @ViewChild('paginatorAppointments') paginatorAppointments!: MatPaginator;

  private allAppointments: Appointment[] = [];

  constructor(
    private _patientService: PatientService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    private _appointmentService: AppointmentService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getPatientById(this.id);
    });
  }

  ngAfterViewInit(): void {
    this.appointmentsDataSource.paginator = this.paginatorAppointments;
  }

  getPatientById(id: string): void {
    this._patientService.getPatientById(id).subscribe({
      next: (value) => {
        this.patient = value;
        console.log(this.patient);
        this.loadAllAppointments();
      },
      error: (error) => {
        console.error('Error fetching patient', error);
      },
    });
  }

  loadAllAppointments(): void {
    this._patientService
      .getAppointmentsByPatientDocument(
        this.patient.personalInformationDto.document
      )
      .subscribe({
        next: (response) => {
          this.allAppointments = response.content;
          this.pageLengthAppointments = response.totalElements;
          this.updateAppointmentsDataSource(0, this.pageSizeAppointments); // Initialize with the first page of appointments
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

  onAppointmentsPageChange(event: any): void {
    this.updateAppointmentsDataSource(event.pageIndex, event.pageSize);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePatient();
      }
    });
  }

  deletePatient(): void {
    this._patientService.deletePatient(this.id).subscribe({
      next: () => {
        console.log('Patient deleted successfully');
        this._routerNav.navigate(['']);
      },
      error: (error) => {
        console.error('Error deleting patient', error);
      },
    });
  }

  saveChanges(): void {
    if (this.patient) {
      console.log('Patient updated: ', this.patient);
      this._patientService.updatePatient(this.patient).subscribe({
        next: () => {
          console.log('Patient updated successfully');
          this.toggleEdit();
          this._snackBar.open('Paciente actualizado correctamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating patient', error);
        },
      });
    }
    this.visibleButtons = true;
  }

  modifyPatient(): void {
    this.toggleEdit();
    this.visibleButtons = false;
  }

  goToAppointments(patient: Patient): void {
    if (patient && patient.id) {
      this._routerNav.navigate([`/appointments/list/${patient.id}`]);
    }
  }

  goToAppointmentDetails(appointment: Appointment): void {
    if (appointment && appointment.appointmentId) {
      this._routerNav.navigate([
        `/appointments/detail/${appointment.appointmentId}`,
      ]);
    }
  }
}
