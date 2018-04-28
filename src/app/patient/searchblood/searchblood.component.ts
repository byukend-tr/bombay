import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { PatientService } from '../shared/patient.service';
import { Observable } from 'rxjs/Observable';
import { SharingdataService } from '../shared/sharingdata.service';
import Swal from 'sweetalert2';

import { NgForm } from '@angular/forms';
import { HomeService } from '../../home/shared/home.service';

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

  provinceJSON: any;
  // tslint:disable-next-line:max-line-length
  provinces = ['กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'ปทุมธานี', 'พระนครศรีอยุธยา', 'อ่างทอง', 'ลพบุรี', 'สิงห์บุรี', 'ชัยนาท', 'สระบุรี', 'ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'นครนายก', 'สระแก้ว', 'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศรีสะเกษ', 'อุบลราชธานี', 'ยโสธร', 'ชัยภูมิ', 'อำนาจเจริญ', 'บึงกาฬ', 'หนองบัวลำภู', 'ขอนแก่น', 'อุดรธานี', 'เลย', 'หนองคาย', 'มหาสารคาม', 'ร้อยเอ็ด', 'กาฬสินธุ์', 'สกลนคร', 'นครพนม', 'มุกดาหาร', 'เชียงใหม่', 'ลำพูน', 'ลำปาง', 'อุตรดิตถ์', 'แพร่', 'น่าน', 'พะเยา', 'เชียงราย', 'แม่ฮ่องสอน', 'นครสวรรค์', 'อุทัยธานี', 'กำแพงเพชร', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 'พิจิตร', 'เพชรบูรณ์', 'ราชบุรี', 'กาญจนบุรี', 'สุพรรณบุรี', 'นครปฐม', 'สมุทรสาคร', 'สมุทรสงคราม', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'นครศรีธรรมราช', 'กระบี่', 'พังงา', 'ภูเก็ต', 'สุราษฎร์ธานี', 'ระนอง', 'ชุมพร', 'สงขลา', 'สตูล', 'ตรัง', 'พัทลุง', 'ปัตตานี', 'ยะลา', 'นราธิวาส'];
  selectedProvince: '---';
  subDistricts = new Set();
  subDistrict: '---';
  districts = new Set();
  district: '---';
  location = Array<any>();
  panelDistrict: any;

  @Output() messageEvent = new EventEmitter<string>(); // use for sharing msg service

  constructor(private patientService: PatientService,
    private formBuilder: FormBuilder,
    private router: Router,
    private msg: SharingdataService,
    private homeService: HomeService) { }

  ngOnInit() {
    this.buildForm();
    const isFound = false;
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
      subDistrict: new FormControl(),

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
  validateForm() {
    if (this.conditionForm.value.id) {
      if (this.conditionForm.value.id.length !== 13) {
        Swal('เกิดความผิดพลาด!', 'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก', 'error');
      } else {
        this.checkCondition();
      }
    } else {
      this.checkCondition();
    }
  }
  checkCondition() {
    if (this.conditionForm.value.id) {
      this.conditionList.push('id');
    } if (this.conditionForm.value.fName) {
      this.conditionList.push('fName');
    } if (this.conditionForm.value.lName) {
      this.conditionList.push('lName');
    } if (this.conditionForm.value.province) {
      this.conditionList.push('province');
    }
    if (this.conditionForm.value.district) {
      this.conditionList.push('district');
    }
    if (this.conditionForm.value.subDistrict) {
      this.conditionList.push('subDistrict');
    }
    if (this.conditionBloodList.length !== 0) {
      this.conditionList.push('blood');
    }

    if (this.conditionList.length === 0) {
      Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลการค้นหา', 'error');
      this.conditionList = [];
    } else {
      this.search();
    }
  }
  search() {
    let filedName = null;
    let filed = null;

    if (this.conditionList.length > 0) {
      if (this.conditionList[0] === 'id') { // first query
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
      } else if (this.conditionList[0] === 'blood') {     // condition have blood only
        this.patientService.blood().subscribe(data => {
          data = this.filterBlood(data);
          this.showPatient(data);
        });
      } // end first query

      if (this.conditionList[0] !== 'blood') {
        this.patientService.namePatient(filed, filedName).subscribe(data => {
          // console.log(data);

          for (let i = 0; i < data.length; i++) {
            data = this.filterNotConfirmBlood(data);
          }
          // filter
          this.conditionList.splice(0, 1);
          for (let i = 0; i < this.conditionList.length; i++) {
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
          // if (this.conditionList[this.conditionList.length - 1] !== 'blood') {
          this.showPatient(data);
          // } else {
          // this.showPatient(data);
          // }
        });
      }
    }


  }
  filterNotConfirmBlood(data: Array<any>) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].result.result === '-') {
        data.splice(i, 1);
        i -= 1;
      }
    }
    return data;
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
    const newData = Array<any>();
    for (let j = 0; j < this.conditionBloodList.length; j++) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].result.result === this.conditionBloodList[j]) {
          newData.push(data[i]);
        }
      }
    }
    return newData;
  }
  showPatient(data: Array<any>) {
    this.isFind = data;
    if (this.isFind.length === 0) {
      this.isFound = false;

    } else {
      this.patients = data;
      this.isFound = true;
    }
    this.buildForm(); // Clear value in search
    this.conditionList = [];
    this.clearValueInCheckedbox();
  }
  viewDetail(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/blood/detail']);

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
  }

  selectDistrict(e, value) {
    // console.log(this.selectedProvince);
    if (value === '---') { return; }
    this.districts = new Set();
    this.panelDistrict = new FormControl('---');
    this.subDistricts = new Set();
    this.panelDistrict = new FormControl('---');
    const query = this.homeService.district(value).subscribe(data => {
      this.provinceJSON = data;
      const result = new Set();
      data.forEach(elem => {
        result.add(elem.district);
      });
      this.districts = result;
    });
    // const district = <HTMLInputElement[]><any>document.getElementsByName('district');
    // district[0].disabled = false;
  }

  selectSubDistrict(e, value) {
    if (value === '---') { return; }
    const result = new Set();
    this.provinceJSON.forEach(elem => {
      if (elem.district === value) {
        result.add(elem.subDistrict);
      }
    });
    this.subDistricts = result;
    // const subDistrict = <HTMLInputElement[]><any>document.getElementsByName('subDistrict');
    // subDistrict[0].disabled = false;
  }
}
