import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../service/patient.service';
import { Router } from '@angular/router';
import { Patient } from '../../../../core/models/patient.model';
import { DocumentType } from '../../../../core/models/common.model';

@Component({
  selector: 'app-patient-post',
  templateUrl: './patient-post.component.html',
  styleUrl: './patient-post.component.css',
})
export class PatientPostComponent {
  patientForm!: FormGroup;
  documentTypes: string[] = Object.values(DocumentType);
  inputMessage: string = '';

  constructor(
    private _fb: FormBuilder,
    private _patientService: PatientService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.patientForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      documentType: ['', Validators.required],
      document: ['', Validators.required],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      socialSecurityNumber: ['', Validators.required],
      idAppointments: [[]],
    });
  }

  submitForm(): void {
    if (this.patientForm.valid) {
      const formValues = this.patientForm.value;
      const newPatient: Patient = {
        personalInformationDto: {
          name: formValues.name,
          surname: formValues.surname,
          idDocument: formValues.documentType,
          document: formValues.document,
        },
        weight: formValues.weight,
        height: formValues.height,
        socialSecurityNumber: formValues.socialSecurityNumber,
        idPatientAppointments: [],
      };
      this.createPatient(newPatient);
    }
  }

  private createPatient(newPatient: Patient): void {
    console.log(newPatient);
    this._patientService.createPatient(newPatient).subscribe({
      next: (createdPatient: Patient) => {
        this.inputMessage = 'Patient created';
        this._router.navigate(['/patients/list']);
      },
      error: (error) => {
        console.error('Error creando al paciente:', error);
      },
    });
  }
}
