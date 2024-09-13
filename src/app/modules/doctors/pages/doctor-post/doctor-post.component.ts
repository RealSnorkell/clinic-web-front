import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Doctor } from '../../../../core/models/doctor.model';
import { DoctorService } from '../../service/doctor.service';
import { DocumentType } from '../../../../core/models/common.model';

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
      mirDate: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.doctorForm.valid) {
      const formValues = this.doctorForm.value;
      const newDoc: Doctor = {
        licenseNum: formValues.licenseNum,
        mirDate: formValues.mirDate.toISOString().split('T')[0],
        personalInformationDto: {
          name: formValues.name,
          surname: formValues.surname,
          idDocument: formValues.documentType,
          document: formValues.document,
        },
        specializations: [],
        idDoctorAppointments: [],
      };
      this.postDoctor(newDoc);
    }
  }

  private postDoctor(newDoctor: Doctor): void {
    this.isLoading = true; // Mostrar el spinner
    console.log(newDoctor);
    this._doctorService.postDoctor(newDoctor).subscribe({
      next: (createdDoctor: Doctor) => {
        this.isLoading = false; // Ocultar el spinner
        this.inputMessage = '¡Doctor creado con éxito!';
        this._router.navigate(['/doctors/list']);
      },
      error: (error: any) => {
        console.error('Error creando al doctor:', error);
      },
    });
  }
}
