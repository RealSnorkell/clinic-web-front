import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SharedModule } from '../../shared/shared.module';
import { PatientDetailComponent } from './pages/patient-detail/patient-detail.component';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { PatientPostComponent } from './pages/patient-post/patient-post.component';

@NgModule({
  declarations: [
    PatientDetailComponent,
    PatientListComponent,
    PatientPostComponent,
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    MatDialogModule,
    FormsModule,
    MatSortModule,
    SharedModule,
  ],
})
export class PatientsModule {}
