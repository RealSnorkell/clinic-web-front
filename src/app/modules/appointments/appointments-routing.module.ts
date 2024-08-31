import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentPostComponent } from './pages/appointment-post/appointment-post.component';
import { AppointmentDetailComponent } from './pages/appointment-detail/appointment-detail.component';
import { AppointmentListComponent } from './pages/appointment-list/appointment-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'create-appointment', component: AppointmentPostComponent },
  { path: 'detail/:id', component: AppointmentDetailComponent },
  { path: 'list', component: AppointmentListComponent },
  { path: 'appointments/list/:doctorId', component: AppointmentListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
