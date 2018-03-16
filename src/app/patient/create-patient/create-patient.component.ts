import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { Patient } from './../shared/patient';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {

  conditionForm: FormGroup;

  constructor(
    private auth: AuthService,
    private patientService: PatientService
  ) {

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl('1235468755120'),
      minit: new FormControl('นางสาว'),
      fName: new FormControl('พัชราภา'),
      lName: new FormControl('ไชยเชื้อ'),
      birthDay: new FormControl('1995-10-11'),
      age: new FormControl('22'),
      tel1: new FormControl('0895564203'),
      tel2: new FormControl('0994264286'),
      address: new FormControl('239 ถ. ห้วยแก้ว'),
      province: new FormControl('เชียงใหม่'),
      district: new FormControl('เมือง เชียงใหม่'),
      subDistrict: new FormControl('สุเทพ'),
      zip: new FormControl('50200')
    });
  }
  validationInput() {
    this.patientService.createPatient(this.conditionForm.value);
  }
  validationForm() {
    this.validationInput();

  }

}
