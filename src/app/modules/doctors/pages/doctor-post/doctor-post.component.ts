import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../service/doctor.service';
import { Router } from '@angular/router';
import { Doctor } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-post',
  templateUrl: './doctor-post.component.html',
  styleUrl: './doctor-post.component.css',
})
export class DoctorPostComponent {
  doctorForm!: FormGroup;
  documentTypes: string[] = Object.values(DocumentType);
  inputMessage: string = '';
  isLoading = false; // Variable para el estado de carga

  constructor(
    private _fb: FormBuilder,
    private _doctorService: DoctorService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.doctorForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      documentType: ['', Validators.required],
      document: ['', Validators.required],
      specializations: [[]],
      licenseNum: ['', Validators.required],
      birthday: ['', Validators.required],
      mirDate: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.doctorForm.valid) {
      const formValues = this.doctorForm.value;
      const newDoc = {
        personalInformation: {
          name: formValues.name,
          surname: formValues.surname,
          documentType: formValues.documentType,
          document: formValues.document,
          birthDay: formValues.birthday,
        },
        licenseNum: formValues.licenseNum,
        specializations: [],
        mirDate: formValues.mirDate,
      };
      this.postDoctor(newDoc);
    }
  }

  private postDoctor(newDoctor: any): void {
    this.isLoading = true; // Mostrar el spinner
    this._doctorService.postDoctor(newDoctor).subscribe({
      next: (createdDoctor: Doctor) => {
        this.isLoading = false; // Ocultar el spinner
        if (createdDoctor && createdDoctor.id) {
          this.inputMessage = 'Doctor created';
          this._router.navigate(['/doctors/detail', createdDoctor.id]); // Redirigir a la página de detalles del doctor.
        } else {
          console.error('El objeto creado no tiene un ID:', createdDoctor);
        }
      },
      error: (error: any) => {
        console.error('Error creando al doctor:', error);
      },
    });
  }
}
