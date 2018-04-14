import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharingdataService } from '../shared/sharingdata.service';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { Patient } from './../shared/patient';

import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


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
        const id = this.conditionForm.value.id;
        const isFound = this.patientService.createPatient(this.conditionForm.value, id);
        this.message = this.conditionForm.value.id;
        this.newMessage();


        if (isFound) {
          Swal(
            'สร้างรายไข้คนไข้รายใหม่!',
            this.conditionForm.value.fName + ' ' + this.conditionForm.value.lName + ' เรียบร้อย',
            'success'
          );
          this.router.navigate(['/test/detail']);
        } else {
          Swal('เกิดความผิดพลาด!', 'มีเลขบัตรประชาชนดังกล่าวในระบบเรียบร้อยแล้ว', 'error');
        }

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



    let isSuccess = false;
    if (this.conditionForm.value.id) {
      if (this.conditionForm.value.fName && this.conditionForm.value && this.conditionForm.value.minit) {
        if (this.conditionForm.value.birthDay) {
          if (this.conditionForm.value.tel1) {
            // if (this.conditionForm.value.tel2) {
            // tslint:disable-next-line:max-line-length
            if (this.conditionForm.value.address && this.conditionForm.value.province && this.conditionForm.value.district && this.conditionForm.value.subDistrict) {
              if (this.conditionForm.value.zip) {
                isSuccess = true;
              }
            }
            // }
          }
        }
      }

    }


    if (isSuccess) {
      this.validationInput();
    } else {
      Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
    }



    // Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
    // Swal('เกิดความผิดพลาด!', 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง', 'error');
  }
  setAge() {
    const yy = new Date().getFullYear();
    const mm = new Date().getMonth();
    const dd = new Date().getDate();
    const today: any = yy + '-' + mm + '-' + dd;
    console.log('today ' + today);
    console.log('b ' + this.conditionForm.value.birthDay);

    const age = today - this.conditionForm.value.birthDay;
    console.log('age ' + age);

  }
  newMessage() {
    this.msg.changeMessage(this.message);
  }

}
