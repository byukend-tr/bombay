import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharingdataService } from '../shared/sharingdata.service';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { Patient } from './../shared/patient';

import { DatePipe } from '@angular/common';
import { HomeService } from '../../home/shared/home.service';

import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  conditionForm: FormGroup;
  message: string;
  patients: any;

  public birthdate: Date;
  public age: any;

  provinceJSON: any;
  // tslint:disable-next-line:max-line-length
  provinces = ['กระบี่', 'กรุงเทพมหานคร', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี', 'เชียงใหม่', 'เชียงราย', 'เพชรบุรี', 'เพชรบูรณ์', 'เลย', 'แพร่', 'แม่ฮ่องสอน'];
  province = '---';
  subDistricts = new Set();
  subDistrict = '---';
  districts = new Set();
  district = '---';
  zipcode = '---';
  location = Array<any>();
  panelDistrict: any;

  a$: Subscription;

  patientId: any;
  patientminit: any;
  patientfName: any;
  patientlName: any;
  patientbirthDay: any;
  patienttel1: any;
  patienttel2: any;
  patientaddress: any;
  patientprovince: any;
  patientdistrict: any;
  patientsubDistrict: any;
  patientzipCode: any;
  

  constructor(
    private auth: AuthService,
    private patientService: PatientService,
    private router: Router,
    private msg: SharingdataService,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.msg.currentMessage.subscribe(async message => {
      this.message = message;
      await this.goToRoot(this.message);
      await this.buildForm();
      await this.loadData();
    }
    );
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
      zipcode: new FormControl()
    });
  }



  loadData() {
    this.a$ = this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      this.setValue(data);
      this.setAge();
      this.province = this.patients[0].province;
      this.subDistrict = this.patients[0].subDistrict;
      this.district = this.patients[0].district;
      this.zipcode = this.patients[0].zipcode;
      this.a$.unsubscribe();
    });
  }
  setValue(data: any) {
    console.log('gggggggggggggggggg');
    console.log(data);

    // console.log(data[0].minit);

    this.patientId = this.patients[0].id;
    

    this.patientminit = this.patients[0].minit;
    this.patientfName = this.patients[0].fName;
    this.patientlName = this.patients[0].lName;
    this.patientbirthDay = this.patients[0].birthDay;
    this.patienttel1 = this.patients[0].tel1;
    this.patienttel2 = this.patients[0].tel2;
    this.patientaddress = this.patients[0].address;
    this.patientprovince = this.patients[0].province;
    this.patientdistrict = this.patients[0].district;
    this.patientsubDistrict = this.patients[0].subDistrict;
    this.patientzipCode = this.patients[0].zipcode;
    console.log(this.conditionForm.value);
  }
  setAge(e = null) {
    let canSetAge = true;

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth();
    const dd = new Date().getDate();
    let birthday;
    if (e === null) {
      birthday = this.patients[0].birthDay.split('-');
    } else {
      birthday = e.target.value.split('-');
    }
    // const yearBirth = new Date(birthday[0]).getFullYear();

    // this.age = yy - yearBirth;
    // this.conditionForm.value.age = this.age;

    const yearBirth = birthday[0];
    const monthBirth = birthday[1];
    const dayBirth = birthday[2];
    if (yearBirth > yy) {
      canSetAge = false;
    } else if (yearBirth === yy) {
      if (monthBirth > mm) {
        canSetAge = false;
      } else if (monthBirth === mm) {
        if (dayBirth > dd) {
          canSetAge = false;
        }
      }
    }

    if (canSetAge) {
      this.age = yy - yearBirth;
      if (mm < monthBirth) {
        this.age -= 1;
      } else if (dd < dayBirth) {
        this.age -= 1;
      }
      this.conditionForm.value.age = this.age;
    } else {
      Swal('เกิดความผิดพลาด!', 'กรุณาเลือกปีเกิดให้ถูกต้อง', 'error');
      this.conditionForm.value.birthDay = 'dd------yyyy';
    }

  }
  validationInput() {
    console.log(this.conditionForm.value);
    console.log(this.patients);
    // this.setValue(this.patients);
    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการแก้ไขข้อมูลของ ' + this.conditionForm.value.fName + ' ' + this.conditionForm.value.lName,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการแก้ไข',
      cancelButtonText: 'ไม่ ต้องการแก้ไข'
    }).then((result) => {
      if (result.value) {
        const id = this.patients[0].id;
        this.patientService.updatePatient(this.conditionForm.value, id);
        this.message = this.conditionForm.value.id;
        this.newMessage();
        console.log(this.patients);


        Swal(
          'แก้ไขข้อมูลเรียบร้อย!',
          '',
          'success'
        );
        this.router.navigate(['/test/detail']);

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้แก้ไขข้อมูลของ' + this.conditionForm.value.fName + ' ' + this.conditionForm.value.lName,
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
    const resultZipcode = new Set();
    this.provinceJSON.forEach(elem => {
      if (elem.district === value) {
        result.add(elem.subDistrict);
      }
    });
    this.subDistricts = result;
    // const subDistrict = <HTMLInputElement[]><any>document.getElementsByName('subDistrict');
    // subDistrict[0].disabled = false;
  }
  selectZipcode(e, value) {
    console.log(this.subDistrict)
    if (value === '---') { return; }
    // const result = new Set();
    this.provinceJSON.forEach(elem => {
      if (elem.subDistrict === value) {
        // result.add(elem.zipcode);
        this.zipcode = elem.zipcode;
        console.log(this.zipcode);
      }
    });
  }
}
