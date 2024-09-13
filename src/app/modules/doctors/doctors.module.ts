import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorsRoutingModule } from './doctors-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { DoctorDetailComponent } from './pages/doctor-detail/doctor-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { DoctorListComponent } from './pages/doctor-list/doctor-list.component';
import { DoctorPostComponent } from './pages/doctor-post/doctor-post.component';
import { GoBackButtonComponent } from '../../shared/components/go-back-button/go-back-button.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    DoctorDetailComponent,
    DoctorListComponent,
    DoctorPostComponent,
  ],
  imports: [
    CommonModule,
    DoctorsRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    MatSortModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    SharedModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
})
export class DoctorsModule {}
