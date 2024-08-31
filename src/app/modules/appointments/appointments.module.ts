import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { AppointmentDetailComponent } from './pages/appointment-detail/appointment-detail.component';
import { AppointmentListComponent } from './pages/appointment-list/appointment-list.component';
import { AppointmentPostComponent } from './pages/appointment-post/appointment-post.component';

@NgModule({
  declarations: [
    AppointmentDetailComponent,
    AppointmentListComponent,
    AppointmentPostComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppointmentsRoutingModule,
    FormsModule,
    SharedModule,
  ],
})
export class AppointmentsModule {}
