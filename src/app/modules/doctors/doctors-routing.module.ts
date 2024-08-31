import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorDetailComponent } from './pages/doctor-detail/doctor-detail.component';
import { DoctorListComponent } from './pages/doctor-list/doctor-list.component';
import { DoctorPostComponent } from './pages/doctor-post/doctor-post.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: DoctorListComponent },
  { path: 'detail/:id', component: DoctorDetailComponent },
  { path: 'create-doctor', component: DoctorPostComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorsRoutingModule {}
