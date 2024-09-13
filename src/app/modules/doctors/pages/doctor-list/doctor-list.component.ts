import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Doctor } from '../../../../core/models/doctor.model';
import { DoctorService } from '../../service/doctor.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css',
})
export class DoctorListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'surname',
    'documentType',
    'document',
    'licenseNum',
    'mirDate',
  ];

  dataSource = new MatTableDataSource<Doctor>();
  filterValue = new FormControl('');

  filteredDoctors: Doctor[] = [];
  doctors: Doctor[] = [];

  public errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _doctorService: DoctorService, private router: Router) {}

  ngOnInit(): void {
    this.getDoctors(0, 4);
    this.dataSource.paginator = this.paginator;
  }

  getDoctors(page: number, size: number): void {
    this._doctorService.getDoctors(page, size).subscribe({
      next: (value) => {
        console.log(value);
        if (value && value.content) {
          this.doctors = value.content;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
          console.log(this.doctors);
        } else {
          console.error('Invalid response structure', value);
        }
      },
      error: (err) => {
        console.error('Error fetching doctors', err);
      },
    });
  }

  getDoctorByDocument(): void {
    const document = this.filterValue.value;
    if (document) {
      this._doctorService.getDoctorByDocument(document).subscribe({
        next: (doctor: Doctor) => {
          if (doctor) {
            this.doctors = [doctor];
            this.dataSource.data = this.doctors;
            this.errorMessage = null;
          } else {
            this.errorMessage =
              'No existe ningún doctor asociado con ese documento.';
            this.filterValue.setValue('');
            this.getDoctors(0, 4);
          }
        },
        error: (error) => {
          console.error('Error fetching doctor by document', error);
          this.errorMessage =
            'No existe ningún doctor asociado con ese documento.';
          this.filterValue.setValue('');
          this.getDoctors(0, 4);
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un documento válido.';
      this.filterValue.setValue('');
      this.getDoctors(0, 5);
    }
  }
  public onPageChange(event: any): void {
    this.getDoctors(event.pageIndex, event.pageSize);
  }

  goToDetail(doctor: Doctor): void {
    if (doctor && doctor.id) {
      this.router.navigate([`/doctors/detail/${doctor.id}`]);
    }
  }
}
