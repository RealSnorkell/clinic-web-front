import { Component, ViewChild } from '@angular/core';
import { Patient } from '../../../../core/models/patient.model';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../service/patient.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {
  public dataSource = new MatTableDataSource<Patient>();
  public displayedColumns: string[] = [
    'name',
    'surname',
    'social security',
    'document',
    'weight',
    'height',
  ];

  public searchControl = new FormControl();
  patients: Patient[] = [];

  public errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private _patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.getPatients(0, 4);
    this.dataSource.paginator = this.paginator;
  }

  getPatients(page: number, size: number): void {
    this._patientService.getPatients(page, size).subscribe({
      next: (value) => {
        if (value && value.content) {
          this.patients = value.content;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
          console.log(value.content);
          console.log(this.patients);
        } else {
          console.error('Invalid response structure', value);
        }
      },
      error: (error) => {
        console.error('Error fetching patients', error);
      },
    });
  }

  getPatientByDocument(): void {
    const document = this.searchControl.value;
    if (document) {
      this._patientService.getPatientByDocument(document).subscribe({
        next: (patient: Patient) => {
          if (patient) {
            this.patients = [patient];
            this.dataSource.data = this.patients;
            this.errorMessage = null;
          } else {
            this.errorMessage = 'No existe ningún paciente con ese documento.';
            this.searchControl.setValue('');
            this.getPatients(0, 4);
          }
        },
        error: (error) => {
          console.error('Error fetching patient by document', error);
          this.errorMessage = 'No existe ningún paciente con ese documento';
          this.searchControl.setValue('');
          this.getPatients(0, 4);
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un documento válido.';
      this.searchControl.setValue('');
      this.getPatients(0, 4);
    }
  }

  public onPageChange(event: any): void {
    this.getPatients(event.pageIndex, event.pageSize);
  }

  goToDetail(patient: Patient): void {
    if (patient) {
      this.router.navigate([`/patients/detail/${patient.id}`]);
    }
  }
}
