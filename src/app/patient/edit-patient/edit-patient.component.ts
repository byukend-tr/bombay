import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharingdataService } from '../shared/sharingdata.service';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { Patient } from './../shared/patient';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  conditionForm: FormGroup;
  message: string;
  patients: any;

  constructor(
    private auth: AuthService,
    private patientService: PatientService,
    private router: Router,
    private msg: SharingdataService
  ) { }

  ngOnInit() {
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.buildForm();
      this.loadData();
    }
    );
  }
  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl(),
      minit: new FormControl(),
      fName: new FormControl(),
      lName: new FormControl(),
      birthDay: new FormControl(),
      age: new FormControl(),
      tel1: new FormControl(),
      tel2: new FormControl(),
      address: new FormControl(),
      province: new FormControl(),
      district: new FormControl(),
      subDistrict: new FormControl(),
      zip: new FormControl()
    });
  }
  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      // console.log(this.patients[0].id);
      // this.buildForm2();
    });
  }
  validationInput() {
    const id = this.patients[0].id;
    this.patientService.createPatient(this.conditionForm.value, id);
    this.message = this.conditionForm.value.id;
    this.newMessage();
    this.router.navigate(['/test/detail']);
  }
  validationForm() {
    this.validationInput();

  }

  newMessage() {
    this.msg.changeMessage(this.message);
  }

}
