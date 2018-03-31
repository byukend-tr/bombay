import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharingdataService } from '../shared/sharingdata.service';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { Patient } from './../shared/patient';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {

  conditionForm: FormGroup;
  message: string;

  constructor(
    private auth: AuthService,
    private patientService: PatientService,
    private router: Router,
    private msg: SharingdataService
  ) {

  }

  ngOnInit() {
    this.buildForm();
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
  validationInput() {

    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการที่จะสร้างรายไข้คนไข้รายใหม่ คือ ' + this.conditionForm.value.fName + ' ' + this.conditionForm.value.lName,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการเพิ่ม',
      cancelButtonText: 'ไม่ ต้องการเพิ่ม'
    }).then((result) => {
      if (result.value) {
        this.patientService.createPatient(this.conditionForm.value);
        this.message = this.conditionForm.value.id;
        this.newMessage();
        this.router.navigate(['/test/detail']);
        Swal(
          'สร้างรายไข้คนไข้รายใหม่!',
          this.conditionForm.value.fName + ' ' + this.conditionForm.value.lName + ' เรียบร้อย',
          'success'
        );
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้สร้างรายไข้คนไข้' + this.conditionForm.value.fName + ' ' + this.conditionForm.value.lName,
          'error'
        );
      }
    });


  }
  validationForm() {
    this.validationInput();

  }
  newMessage() {
    this.msg.changeMessage(this.message);
  }

}
