import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { PatientService } from '../shared/patient.service';
import { Observable } from 'rxjs/Observable';
import { SharingdataService } from '../shared/sharingdata.service';
import Swal from 'sweetalert2';

import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-searchblood',
  templateUrl: './searchblood.component.html',
  styleUrls: ['./searchblood.component.css']
})
export class SearchbloodComponent implements OnInit {

  address: { district: string, amphoe: string, province: string, zipcode: number };


  conditionForm: FormGroup;

  isFound = false;
  isFind = Array<any>();
  patients: any;

  message: string;

  conditionBloodList: any = [];
  conditionList: any = [];

  @Output() messageEvent = new EventEmitter<string>(); // use for sharing msg service

  constructor(private patientService: PatientService,
    private formBuilder: FormBuilder,
    private router: Router,
    private msg: SharingdataService
  ) { }

  ngOnInit() {
    this.buildForm();
    const isFound = false;
    // this.query();
    this.conditionList = [];
    this.clearValueInCheckedbox();

  }


  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl(),
      fName: new FormControl(),
      lName: new FormControl(),
      province: new FormControl(),
      district: new FormControl(),
      subDistrict: new FormControl()
    });
  }
  query() {
    console.log('queryyy');
    this.patientService.query().subscribe(data => {
      this.patients = data;
      if (data.length !== 0) { this.isFound = true; }
      console.log(this.patients);
    });


  }

  search() {
    if (this.conditionForm.value.id) {
      this.conditionList.push('id');
    } if (this.conditionForm.value.fName) {
      this.conditionList.push('fName');
    } if (this.conditionForm.value.lName) {
      this.conditionList.push('lName');
    } if (this.conditionForm.value.province) {
      this.conditionList.push('province');
    } if (this.conditionForm.value.district) {
      this.conditionList.push('district');
    } if (this.conditionForm.value.subDistrict) {
      this.conditionList.push('subDistrict');
    } if (this.conditionBloodList.length !== 0) {
      this.conditionList.push('blood');
    } if (this.conditionList.length === 0) {
      Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลการค้นหา', 'error');
    }

    // console.log('conditionList ' + this.conditionList);

    // for (let i = 0; i < this.conditionList.length; i++) {
    //   if(this.conditionList[i] === 'fName'){
    //     filterFirstName();
    //   }
    // }
    let filedName = null;
    let filed = null;
    // console.log(this.conditionList.length);

    if (this.conditionList.length > 0) {
      if (this.conditionList[0] === 'id') {
        filed = this.conditionForm.value.id;
        filedName = 'id';
      } else if (this.conditionList[0] === 'fName') {
        filed = this.conditionForm.value.fName;
        filedName = 'fName';
      } else if (this.conditionList[0] === 'lName') {
        filed = this.conditionForm.value.lName;
        filedName = 'lName';
      } else if (this.conditionList[0] === 'province') {
        filed = this.conditionForm.value.province;
        filedName = 'province';
      } else if (this.conditionList[0] === 'district') {
        filed = this.conditionForm.value.district;
        filedName = 'district';
      } else if (this.conditionList[0] === 'subDistrict') {
        filed = this.conditionForm.value.subDistrict;
        filedName = 'subDistrict';
      } else if (this.conditionList[0] === 'blood') {
        this.patientService.blood(this.conditionBloodList[0]).subscribe(data => {
          this.showPatient(data);

          this.buildForm(); // Clear value in search
          this.conditionList = [];
          this.clearValueInCheckedbox();
          this.conditionList.splice(0, 1);
        });
      }

      if (this.conditionList[0] !== 'blood') {
        // filedName = 'blood';
        // console.log('conditionList!!!!!!!!! ' + this.conditionList);
        this.patientService.namePatient(filed, filedName).subscribe(data => {
          // console.log(data);


          // console.log('conditionBefore ' + this.conditionList);
          // filter
          this.conditionList.splice(0, 1);
          for (let i = 0; i < this.conditionList.length; i++) {
            console.log('conditionForrrrr ' + this.conditionList[i]);
            if (this.conditionList[i] === 'fName') {
              data = this.filterFirstName(data);
            } else if (this.conditionList[i] === 'lName') {
              data = this.filterLastName(data);
            } else if (this.conditionList[i] === 'province') {
              data = this.filterProvince(data);
            } else if (this.conditionList[i] === 'district') {
              data = this.filterDistrict(data);
            } else if (this.conditionList[i] === 'subDistrict') {
              data = this.filterSubDistrict(data);
            } else if (this.conditionList[i] === 'blood') {
              data = this.filterBlood(data);
            }
          }
          // end filter
          this.showPatient(data);

          this.buildForm(); // Clear value in search
          this.conditionList = [];
          this.clearValueInCheckedbox();
        });
      }
    }


  }
  filterFirstName(data: Array<any>) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].fName !== this.conditionForm.value.fName) {
        data.splice(i, 1);
        i -= 1;
      }
    }
    return data;
  }
  filterLastName(data: Array<any>) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].lName !== this.conditionForm.value.lName) {
        data.splice(i, 1);
        i -= 1;
      }
    }
    return data;
  }
  filterProvince(data: Array<any>) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].province !== this.conditionForm.value.province) {
        data.splice(i, 1);
        i -= 1;
      }
    }
    return data;
  }
  filterDistrict(data: Array<any>) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].district !== this.conditionForm.value.district) {
        data.splice(i, 1);
        i -= 1;
      }
    }
    return data;
  }
  filterSubDistrict(data: Array<any>) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].subDistrict !== this.conditionForm.value.subDistrict) {
        data.splice(i, 1);
        i -= 1;
      }
    }
    return data;
  }

  filterBlood(data: Array<any>) {
    console.log(this.conditionBloodList);

    for (let j = 0; j < this.conditionBloodList.lenght; j++) {
      console.log(this.conditionBloodList[j]);
      for (let i = 0; i < data.length; i++) {
        if (data[i].result !== this.conditionBloodList[j]) {
          data.splice(i, 1);
          i -= 1;
        }
      }
    }
    return data;
  }
  showPatient(data: Array<any>) {
    this.isFind = data;
    console.log(this.isFind);
    if (this.isFind.length === 0) {
      this.isFound = false;
      // console.log(this.isFound);

    } else {
      this.patients = data;
      this.isFound = true;
      // console.log(this.isFound);
    }
  }
  viewDetail(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/blood/detail']);

  }

  deletePatient(id: string) {
    console.log('delete' + id);

    //  ********************************************************************
  }

  newMessage() {
    this.msg.changeMessage(this.message);
  }
  clearValueInCheckedbox() {
    const Apara = <HTMLInputElement[]><any>document.getElementsByName('Apara');
    const Bpara = <HTMLInputElement[]><any>document.getElementsByName('Bpara');
    const ABpara = <HTMLInputElement[]><any>document.getElementsByName('ABpara');
    const Opara = <HTMLInputElement[]><any>document.getElementsByName('Opara');

    const A = <HTMLInputElement[]><any>document.getElementsByName('A');
    const B = <HTMLInputElement[]><any>document.getElementsByName('B');
    const AB = <HTMLInputElement[]><any>document.getElementsByName('AB');
    const O = <HTMLInputElement[]><any>document.getElementsByName('O');

    Apara[0].checked = false;
    Bpara[0].checked = false;
    ABpara[0].checked = false;
    Opara[0].checked = false;

    A[0].checked = false;
    B[0].checked = false;
    AB[0].checked = false;
    O[0].checked = false;
    this.conditionBloodList = [];
  }
  selectBlood(e, value) {
    if (e.target.checked === true) {
      this.conditionBloodList.push(value);
    } else {
      for (let i = 0; i < this.conditionBloodList.length; i++) {
        if (this.conditionBloodList[i] === value) {
          this.conditionBloodList.splice(i, 1);
        }
      }
    }
    // console.log(this.conditionBloodList);

  }

}
