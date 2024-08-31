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

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
})
export class PatientDetailComponent {
  protected id: string = '';
  public patient?: Patient;
  protected dataSource = new MatTableDataSource<Patient>();
  protected appointmentsDataSource = new MatTableDataSource<Appointment>();
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'document'];
  protected appointmentDisplayedColumns: string[] = [
    'date',
    'doctorName',
    'doctorSurname',
    'diagnostic',
  ];
  protected activeAppointmentsCount = 0;
  protected isEditing = false;
  // protected trainingSheetsDataSource = new MatTableDataSource<TrainingSheet>();
  /*   protected trainingSheetsDisplayedColumns: string[] = [
    'trainingType',
    'observations',
  ]; */
  @Input() pageLengthAppointments = 0;
  @Input() pageSizeAppointments = 5;
  @Input() pageLengthTrainingSheets = 0;
  @Input() pageSizeTrainingSheets = 5;
  @ViewChild('paginatorAppointments') paginatorAppointments!: MatPaginator;
  @ViewChild('paginatorTrainingSheets') paginatorTrainingSheets!: MatPaginator;

  private allAppointments: Appointment[] = [];

  constructor(
    private _patientService: PatientService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getPatientById(this.id);
      this.loadAllAppointments(this.id); // Load all appointments initially
      //this.loadAllTrainingSheets(this.id); // Default page size for training sheets
    });
  }

  ngAfterViewInit(): void {
    this.appointmentsDataSource.paginator = this.paginatorAppointments;
    //this.trainingSheetsDataSource.paginator = this.paginatorTrainingSheets;
  }

  getPatientById(id: string): void {
    this._patientService.getPatientById(id).subscribe({
      next: (value) => {
        this.patient = value;
      },
      error: (error) => {
        console.error('Error fetching patient', error);
      },
    });
  }

  loadAllAppointments(patientId: string): void {
    this._patientService.getAppointmentsByPatientId(patientId).subscribe({
      next: (response) => {
        this.allAppointments = response.content;
        this.pageLengthAppointments = response.totalElements;
        this.updateAppointmentsDataSource(0, this.pageSizeAppointments); // Initialize with the first page of appointments
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

  /* loadAllTrainingSheets(athleteId: string): void {
    this._patientService.getTrainingSheetsByAthleteId(athleteId).subscribe({
      next: (response) => {
        this.allTrainingSheets = response.content;
        this.pageLengthTrainingSheets = response.totalElements;
        this.updateTrainingSheetsDataSource(0, this.pageSizeTrainingSheets); // Initialize with the first page of training sheets
      },
      error: (err) => {
        console.error('Error fetching training sheets', err);
      },
    });
  } 
  updateTrainingSheetsDataSource(pageIndex: number, pageSize: number): void {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    if (startIndex < this.allTrainingSheets.length) {
      this.trainingSheetsDataSource.data = this.allTrainingSheets.slice(
        startIndex,
        Math.min(endIndex, this.allTrainingSheets.length)
      );
    } else {
      this.trainingSheetsDataSource.data = [];
    }
  } */

  /*  onTrainingSheetsPageChange(event: any): void {
    this.updateTrainingSheetsDataSource(event.pageIndex, event.pageSize);
  } */

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteAthlete();
      }
    });
  }

  deleteAthlete(): void {
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
      this._patientService.updatePatient(this.id, this.patient).subscribe({
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
  }

  modifyPatient(): void {
    this.toggleEdit();
  }

  goToAppointments(patient: Patient): void {
    if (patient && patient.id) {
      this._routerNav.navigate([`/appointments/list/${patient.id}`]);
    }
  }

  // goToTrainingSheetDetails(trainingSheet: TrainingSheet): void {
  //   if (trainingSheet && trainingSheet.id) {
  //     this._routerNav.navigate([`/training-sheets/detail/${trainingSheet.id}`]);
  //   }
  // }

  goToAppointmentDetails(appointment: Appointment): void {
    if (appointment && appointment.appointmentId) {
      this._routerNav.navigate([
        `/appointments/detail/${appointment.appointmentId}`,
      ]);
    }
  }
}
