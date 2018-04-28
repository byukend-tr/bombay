import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { PatientService } from '../shared/patient.service';
import { Observable } from 'rxjs/Observable';
import { SharingdataService } from '../shared/sharingdata.service';

import Swal from 'sweetalert2';

import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'app-searchtest',
  templateUrl: './searchtest.component.html',
  styleUrls: ['./searchtest.component.css']
})
export class SearchtestComponent implements OnInit {

  conditionForm: FormGroup;
  id: any;
  isFound = false;
  isFind = Array<any>();
  patients: any;
  canAddNew = false;

  message: string;

  test: string;

  conditionList: any = [];
  continueList: any = [];
  aboList: any = [];
  antibodyList: any = [];
  salivaList: any = [];

  privileage: string;
  profile: any = {};

  @Output() messageEvent = new EventEmitter<string>(); // use for sharing msg service

  constructor(private patientService: PatientService,
    private formBuilder: FormBuilder,
    private router: Router,
    private msg: SharingdataService,
    public auth: AuthService) {
    this.auth.getCurrentLoggedInOnInit(data => {
      this.profile = data;
      this.getPersonalnformation(this.profile);
    });
  }

  ngOnInit() {
    this.buildForm();
    const isFound = false;
    // this.query();
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl(),
      fName: new FormControl(),
      lName: new FormControl(),
    });
  }
  getPersonalnformation(email: any) {
    this.auth.getUserProfile(email.email).subscribe(data => {
      this.privileage = data[0].privilege;
    });

  }

  query() {
    // console.log('queryyy');
    this.patientService.query().subscribe(data => {
      this.patients = data;
      if (data.length !== 0) { this.isFound = true; }
    });
  }
  validateForm() {
    if (this.conditionForm.value.id) {
      if (this.conditionForm.value.id.length !== 13) {
        Swal('เกิดความผิดพลาด!', 'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก', 'error');
      } else {
        this.checkCondition();
        this.canAddNew = true;
        this.id = this.conditionForm.value.id;
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
    } if (this.continueList.length !== 0) {
      this.conditionList.push('continue');
    } if (this.aboList.length !== 0) {
      this.conditionList.push('abo');
    } if (this.antibodyList.length !== 0) {
      this.conditionList.push('antibody');
    } if (this.salivaList.length !== 0) {
      this.conditionList.push('saliva');
    }
    console.log(this.conditionList);


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

    // if (this.conditionForm.value.id) {
    //   this.patientService.detailPatient(this.conditionForm.value.id).subscribe(data => {
    //     this.showPatient(data);
    //   });
    // } else if (this.conditionForm.value.fName) {
    //   this.patientService.namePatient(this.conditionForm.value.fName, 'fName').subscribe(data => {
    //     this.showPatient(data);
    //   });
    // } else if (this.conditionForm.value.lName) {
    //   this.patientService.namePatient(this.conditionForm.value.lName, 'lName').subscribe(data => {
    //     this.showPatient(data);
    //   });
    // } else {
    //   this.query();
    // }
    if (this.conditionList.length > 0) {
      if (this.conditionList[0] === 'id') {  // first query
        filed = this.conditionForm.value.id;
        filedName = 'id';
      } else if (this.conditionList[0] === 'fName') {
        filed = this.conditionForm.value.fName;
        filedName = 'fName';
      } else if (this.conditionList[0] === 'lName') {
        filed = this.conditionForm.value.lName;
        filedName = 'lName';
      } else if (this.conditionList[0] === 'continue') {
        this.patientService.blood().subscribe(data => {
          data = this.filterContinue(data);
          this.showPatient(data);
        });
      } else if (this.conditionList[0] === 'abo') {
        this.patientService.blood().subscribe(data => {
          data = this.filterAbo(data);
          this.showPatient(data);
        });
      } else if (this.conditionList[0] === 'antibody') {
        this.patientService.blood().subscribe(data => {
          data = this.filterAntibody(data);
          this.showPatient(data);
        });
      } else if (this.conditionList[0] === 'saliva') {
        this.patientService.blood().subscribe(data => {
          data = this.filterSaliva(data);
          this.showPatient(data);
        });
      }   // end first query


      // tslint:disable-next-line:max-line-length
      if (this.conditionList[0] !== 'continue' && this.conditionList[0] !== 'abo' && this.conditionList[0] !== 'antibody' && this.conditionList[0] !== 'saliva') {    // loop query
        this.patientService.namePatient(filed, filedName).subscribe(data => {
          console.log(data);

          // filter
          this.conditionList.splice(0, 1);
          for (let i = 0; i < this.conditionList.length; i++) {
            console.log(this.conditionList[i]);

            if (this.conditionList[i] === 'fName') {
              data = this.filterFirstName(data);
            } else if (this.conditionList[i] === 'lName') {
              data = this.filterLastName(data);
            } else if (this.conditionList[i] === 'continue') {
              console.log('continueeeeee');

              data = this.filterContinue(data);
            } else if (this.conditionList[i] === 'abo') {
              console.log('aboooooo');

              data = this.filterAbo(data);
            } else if (this.conditionList[i] === 'antibody') {
              console.log('antibodyyyy');

              data = this.filterAntibody(data);
            } else if (this.conditionList[i] === 'saliva') {
              console.log('salivaaaaa');

              data = this.filterSaliva(data);
            }
          }
          // end filter

          // tslint:disable-next-line:max-line-length
          if (this.conditionList[this.conditionList.length - 1] !== 'continue' && this.conditionList[this.conditionList.length - 1] !== 'abo' && this.conditionList[this.conditionList.length - 1] !== 'antibody' && this.conditionList[this.conditionList.length - 1] !== 'saliva') {
            console.log(172);

            this.showPatient(data);
          } else {
            console.log(188);
            this.showPatient(data);
          }
        });
      }   // end loop query

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
  filterContinue(data: Array<any>) {
    console.log(data);
    console.log(this.continueList);

    const newData = Array<any>();
    for (let i = 0; i < data.length; i++) {
      console.log(this.continueList);
      for (let j = 0; j < this.continueList.length; j++) {
        console.log(this.continueList.length);
        console.log(i, j);
        const name = this.continueList[j];
        console.log(name);

        if (name === 'resultAbo') {
          console.log(data[i].resultAbo.resultAbo);
          if (data[i].resultAbo.resultAbo === '-') {
            newData.push(data[i]);
            i++;
          }
        } if (name === 'resultAntibody') {
          console.log(data[i].resultAntibody.resultAntibody);
          if (data[i].resultAntibody.resultAntibody === '-') {
            newData.push(data[i]);
            i++;
          }
        } if (name === 'resultSaliva') {
          console.log(data[i].resultSaliva.resultSaliva);
          if (data[i].resultSaliva.resultSaliva === '-') {
            newData.push(data[i]);
            i++;
          }
        }
        console.log(i, j);
      }
    }
    // this.conditionList.splice(0, 1);
    return newData;
  }
  filterAbo(data: Array<any>) {
    const newData = Array<any>();
    for (let j = 0; j < this.aboList.length; j++) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].this.aboList[j].this.aboList[j] === this.aboList[j]) {
          newData.push(data[i]);
        }
      }
    }
    return newData;
  }
  filterAntibody(data: Array<any>) {
    const newData = Array<any>();
    for (let j = 0; j < this.antibodyList.length; j++) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].this.antibodyList[j].this.antibodyList[j] === this.antibodyList[j]) {
          newData.push(data[i]);
        }
      }
    }
    return newData;
  }
  filterSaliva(data: Array<any>) {
    const newData = Array<any>();
    for (let j = 0; j < this.salivaList.length; j++) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].this.salivaList[j].this.salivaList[j] === this.salivaList[j]) {
          newData.push(data[i]);
        }
      }
    }
    return newData;
  }
  showPatient(data: Array<any>) {
    this.isFind = data;
    // console.log(this.isFind);
    if (this.isFind.length === 0) {
      this.isFound = false;
      // console.log(this.isFound);

    } else {
      this.patients = data;
      this.isFound = true;
      // console.log(this.isFound);
    }
    this.buildForm(); // Clear value in search
    this.conditionList = [];
    this.clearValueInCheckedbox();
  }
  clearValueInCheckedbox() {
    // continue
    const abo = <HTMLInputElement[]><any>document.getElementsByName('abo');
    const antibody = <HTMLInputElement[]><any>document.getElementsByName('antibody');
    const saliva = <HTMLInputElement[]><any>document.getElementsByName('saliva');
    abo[0].checked = false;
    antibody[0].checked = false;
    saliva[0].checked = false;

    // abo
    const Awith = <HTMLInputElement[]><any>document.getElementsByName('Awith');
    const Bwith = <HTMLInputElement[]><any>document.getElementsByName('Bwith');
    const ABwith = <HTMLInputElement[]><any>document.getElementsByName('ABwith');
    const Owith = <HTMLInputElement[]><any>document.getElementsByName('Owith');
    const A = <HTMLInputElement[]><any>document.getElementsByName('A');
    const B = <HTMLInputElement[]><any>document.getElementsByName('B');
    const AB = <HTMLInputElement[]><any>document.getElementsByName('AB');
    const O = <HTMLInputElement[]><any>document.getElementsByName('O');
    Awith[0].checked = false;
    Bwith[0].checked = false;
    ABwith[0].checked = false;
    Owith[0].checked = false;
    A[0].checked = false;
    B[0].checked = false;
    AB[0].checked = false;
    O[0].checked = false;

    // antibody
    const alloantibody = <HTMLInputElement[]><any>document.getElementsByName('alloantibody');
    const noalloantibody = <HTMLInputElement[]><any>document.getElementsByName('noalloantibody');
    const error = <HTMLInputElement[]><any>document.getElementsByName('error');
    alloantibody[0].checked = false;
    noalloantibody[0].checked = false;
    error[0].checked = false;

    // saliva
    const secretorA = <HTMLInputElement[]><any>document.getElementsByName('secretorA');
    const secretorB = <HTMLInputElement[]><any>document.getElementsByName('secretorB');
    const secretorAB = <HTMLInputElement[]><any>document.getElementsByName('secretorAB');
    const secretorO = <HTMLInputElement[]><any>document.getElementsByName('secretorO');
    const nonSecretor = <HTMLInputElement[]><any>document.getElementsByName('nonSecretor');
    secretorA[0].checked = false;
    secretorB[0].checked = false;
    secretorAB[0].checked = false;
    secretorO[0].checked = false;
    nonSecretor[0].checked = false;

    this.continueList = [];
    this.aboList = [];
    this.antibodyList = [];
    this.salivaList = [];
  }
  viewDetail(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/test/detail']);

  }
  phenotype(id: string, test: string) {
    this.message = id;
    this.test = test;
    this.newMessage();
    this.router.navigate(['/test/phenotype']);
  }
  deletePatient(id: string) {
    // console.log('delete' + id);

    //  ********************************************************************
  }
  createPatient() {
    this.message = this.id;
    this.newMessage();
  }
  newMessage() {
    this.msg.changeMessage(this.message);
    this.msg.testName(this.test);
  }


  // checkStep(e, value) {
  //   const abo = <HTMLInputElement[]><any>document.getElementsByName('abo');
  //   const antibody = <HTMLInputElement[]><any>document.getElementsByName('antibody');
  //   const saliva = <HTMLInputElement[]><any>document.getElementsByName('saliva');
  //   if (e.target.checked === true) {
  //     // this.conditionBloodList.push(value);


  //     abo[0].disabled = false;
  //     antibody[0].disabled = false;
  //     saliva[0].disabled = false;
  //   } else {

  //     abo[0].disabled = true;
  //     antibody[0].disabled = true;
  //     saliva[0].disabled = true;
  //     abo[0].checked = false;
  //     antibody[0].checked = false;
  //     saliva[0].checked = false;
  //   }
  // }
  selectContinue(e, value) {
    if (e.target.checked === true) {
      this.continueList.push(value);
    } else {
      for (let i = 0; i < this.continueList.length; i++) {
        if (this.continueList[i] === value) {
          this.continueList.splice(i, 1);
        }
      }
    }
    console.log(this.continueList);

  }
  selectAbo(e, value) {
    if (e.target.checked === true) {
      this.aboList.push(value);
    } else {
      for (let i = 0; i < this.aboList.length; i++) {
        if (this.aboList[i] === value) {
          this.aboList.splice(i, 1);
        }
      }
    }
    console.log(this.aboList);

  }
  selectAntibody(e, value) {
    if (e.target.checked === true) {
      this.antibodyList.push(value);
    } else {
      for (let i = 0; i < this.antibodyList.length; i++) {
        if (this.antibodyList[i] === value) {
          this.antibodyList.splice(i, 1);
        }
      }
    }
    console.log(this.antibodyList);

  }
  selectSaliva(e, value) {
    if (e.target.checked === true) {
      this.salivaList.push(value);
    } else {
      for (let i = 0; i < this.salivaList.length; i++) {
        if (this.salivaList[i] === value) {
          this.salivaList.splice(i, 1);
        }
      }
    }
    console.log(this.salivaList);

  }
}
