import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharingdataService } from '../shared/sharingdata.service';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { Patient } from './../shared/patient';

import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
// import * as $ from 'jquery';

// declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {


  conditionForm: FormGroup;
  resultAboForm: FormGroup;
  resultAntibodyForm: FormGroup;
  resultSalivaForm: FormGroup;
  resultForm: FormGroup;
  statusForm: FormGroup;


  message: string;

  public birthdate: Date;
  public age: any;

  currentURL = '';

  constructor(
    private auth: AuthService,
    private patientService: PatientService,
    private router: Router,
    private msg: SharingdataService
  ) {

  }

  ngOnInit() {

    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.buildForm();
      this.goToRoot(this.message);
    });
    // $.Thailand({
    //   $district: $('#district'), // input ของตำบล
    //   $amphoe: $('#amphoe'), // input ของอำเภอ
    //   $province: $('#province'), // input ของจังหวัด
    //   $zipcode: $('#zipcode'), // input ของรหัสไปรษณีย์
    // });
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl(this.message),
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
      zip: new FormControl(),

    });
    this.resultForm = new FormGroup({
      result: new FormControl()
    });
    this.statusForm = new FormGroup({
      status: new FormControl()
    });
    this.resultAboForm = new FormGroup({
      idAbo: new FormControl(),
      resultAbo: new FormControl()
    });
    this.resultAntibodyForm = new FormGroup({
      idAntibody: new FormControl(),
      resultAntibody: new FormControl()
    });
    this.resultSalivaForm = new FormGroup({
      idSaliva: new FormControl(),
      resultSaliva: new FormControl()
    });
  }
  goToRoot(message: string) {
    if (message === 'default message') {
      if (this.getPath() === '/test/detail') {
        this.router.navigate(['/test']);
      } else if (this.getPath() === '/blood/detail') {
        this.router.navigate(['/blood']);
      }
    }
  }
  getPath() {
    return this.router.url;
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
        this.setResult(id);

        if (isFound) {
          Swal(
            'เพิ่มคนไข้รายใหม่เรียบร้อย!',
            '',
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
  setResult(id: string) {
    this.resultForm.value.result = '-';
    this.patientService.updateResult(this.resultForm.value, id, 'result');

    this.statusForm.value.result = 'ok';
    this.patientService.updateStatus(this.statusForm.value, id, 'status');

    this.resultAboForm.value.idAbo = '-';
    this.resultAboForm.value.resultAbo = '-';
    this.patientService.updateResult(this.resultAboForm.value, id, 'resultAbo');

    this.resultAntibodyForm.value.idAntibody = '-';
    this.resultAntibodyForm.value.resultAntibody = '-';
    this.patientService.updateResult(this.resultAntibodyForm.value, id, 'resultAntibody');

    this.resultSalivaForm.value.idSaliva = '-';
    this.resultSalivaForm.value.resultSaliva = '-';
    this.patientService.updateResult(this.resultSalivaForm.value, id, 'resultSaliva');
  }
  setAge() {
    const yy = new Date().getFullYear();
    const mm = new Date().getMonth();
    const dd = new Date().getDate();

    const birthday = this.conditionForm.value.birthDay.split();

    const yearBirth = new Date(birthday[0]).getFullYear();
    this.age = yy - yearBirth;
    this.conditionForm.value.age = this.age;
  }

  newMessage() {
    this.msg.changeMessage(this.message);
  }


}
