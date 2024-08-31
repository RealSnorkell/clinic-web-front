import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { PatientDetailComponent } from './pages/patient-detail/patient-detail.component';
import { PatientPostComponent } from './pages/patient-post/patient-post.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PatientListComponent },
  { path: 'detail/:id', component: PatientDetailComponent },
  { path: 'create-patient', component: PatientPostComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
