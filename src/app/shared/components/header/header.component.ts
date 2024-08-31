import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showPatientButton = true;
  showDoctorButton = true;
  showAppointmentButton = true;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this._router.url;
        this.showPatientButton = url.includes('patients');
        this.showDoctorButton = url.includes('doctors');
        this.showAppointmentButton = url.includes('appointments');
      });
  }

  navigateToCreatePatient() {
    this._router.navigate(['/patients/create-patient']);
  }

  navigateToCreateDoctor() {
    this._router.navigate(['/doctors/create-doctor']);
  }

  navigateToCreateAppointment() {
    this._router.navigate(['/appointments/create-appointment']);
  }
}
