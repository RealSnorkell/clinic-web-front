import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  {
    path: 'doctors',
    loadChildren: () =>
      import('./modules/doctors/doctors.module').then((m) => m.DoctorsModule),
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./modules/patients/patients.module').then(
        (m) => m.PatientsModule
      ),
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('./modules/appointments/appointments.module').then(
        (m) => m.AppointmentsModule
      ),
  },
];
