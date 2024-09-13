import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { GoBackButtonComponent } from './components/go-back-button/go-back-button.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ConfirmDialogComponent, GoBackButtonComponent],
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    MatDialogModule,
  ],
  exports: [GoBackButtonComponent, ConfirmDialogComponent],
})
export class SharedModule {}
