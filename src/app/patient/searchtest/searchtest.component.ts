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
  statusForm: FormGroup;

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
    this.statusForm = new FormGroup({
      status: new FormControl()
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

          data = this.filterDelete(data);
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
            // console.log(172);

            this.showPatient(data);
          } else {
            // console.log(188);
            this.showPatient(data);
          }
        });
      }   // end loop query

    }


  }
  filterDelete(data: Array<any>) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 'delete') {
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
  filterContinue(data: Array<any>) {
    // console.log(data);
    // console.log(this.continueList);
    this.continueList = this.continueList.sort();
    const newData = Array<any>();
    for (let i = 0; i < data.length; i++) {
      // console.log('i ' + this.continueList);
      for (let j = 0; j < this.continueList.length; j++) {
        // console.log(this.continueList.length);
        // console.log(i, j);
        const name = this.continueList[j];
        // console.log('j ' + name);

        if (name === 'resultAbo') {
          // console.log(data[i].resultAbo.resultAbo);
          if (data[i].resultAbo.resultAbo === '-') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'resultAntibody') {
          // console.log(data[i].resultAntibody.resultAntibody);
          // tslint:disable-next-line:max-line-length
          if (data[i].resultAntibody.resultAntibody1 === '-' && (data[i].resultAbo.resultAbo !== 'Group A' && data[i].resultAbo.resultAbo !== 'Group B' && data[i].resultAbo.resultAbo !== 'Group AB' && data[i].resultAbo.resultAbo !== 'Group O')) {
            newData.push(data[i]);
            break;
          }
        } if (name === 'resultSaliva') {
          // console.log(data[i].resultSaliva.resultSaliva);
          // tslint:disable-next-line:max-line-length
          if (data[i].resultSaliva.resultSaliva === '-' && (data[i].resultAbo.resultAbo !== 'Group A' && data[i].resultAbo.resultAbo !== 'Group B' && data[i].resultAbo.resultAbo !== 'Group AB' && data[i].resultAbo.resultAbo !== 'Group O')) {
            newData.push(data[i]);
            break;
          }
        }
        // console.log(i, j);
      }
    }
    // this.conditionList.splice(0, 1);
    return newData;
  }
  filterAbo(data: Array<any>) {
    this.aboList = this.aboList.sort();
    const newData = Array<any>();
    for (let i = 0; i < data.length; i++) {
      const idTest = data[i].resultAbo.resultAbo;
      for (let j = 0; j < this.aboList.length; j++) {

        const name = this.aboList[j];

        if (name === 'Group A with unexpected alloantibody') {
          if (data[i].resultAbo.resultAbo === 'Group A with unexpected alloantibody') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Group B with unexpected alloantibody') {
          if (data[i].resultAbo.resultAbo === 'Group B with unexpected alloantibody') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Group AB with unexpected alloantibody') {
          if (data[i].resultAbo.resultAbo === 'Group AB with unexpected alloantibody') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Group O with unexpected alloantibody') {
          if (data[i].resultAbo.resultAbo === 'Group O with unexpected alloantibody') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Group A') {
          if (data[i].resultAbo.resultAbo === 'Group A') {
            newData.push(data[i]);
            break;
          }
        }
        if (name === 'Group B') {
          if (data[i].resultAbo.resultAbo === 'Group B') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Group AB') {
          if (data[i].resultAbo.resultAbo === 'Group AB') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Group O') {
          if (data[i].resultAbo.resultAbo === 'Group O') {
            newData.push(data[i]);
            break;
          }
        }
      }
    }
    return newData;
  }
  filterAntibody(data: Array<any>) {
    this.antibodyList = this.antibodyList.sort();
    const newData = Array<any>();
    for (let i = 0; i < data.length; i++) {
      const idTest = data[i].resultAntibody.resultAntibody;
      for (let j = 0; j < this.antibodyList.length; j++) {

        const name = this.antibodyList[j];

        if (name === 'พบ') {
          if (data[i].resultAntibody.resultAntibody1 === 'IgM, IgG' || data[i].resultAntibody.resultAntibody2 === 'IgM, IgG') {
            newData.push(data[i]);
            break;
          } else if (data[i].resultAntibody.resultAntibody1 === 'IgM' || data[i].resultAntibody.resultAntibody2 === 'IgM') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'ไม่พบ alloantibody') {
          // tslint:disable-next-line:max-line-length
          if (data[i].resultAntibody.resultAntibody1 === 'ไม่พบ alloantibody' || data[i].resultAntibody.resultAntibody2 === 'ไม่พบ alloantibody') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'ทำการทดลองใหม่') {
          if (data[i].resultAntibody.resultAntibody1 === 'ทำการทดลองใหม่' || data[i].resultAntibody.resultAntibody2 === 'ทำการทดลองใหม่') {
            newData.push(data[i]);
            break;
          }
        }
      }
    }
    return newData;
  }
  filterSaliva(data: Array<any>) {
    this.salivaList = this.salivaList.sort();
    const newData = Array<any>();
    for (let i = 0; i < data.length; i++) {
      const idTest = data[i].resultSaliva.resultSaliva;
      for (let j = 0; j < this.salivaList.length; j++) {

        const name = this.salivaList[j];

        if (name === 'Secretor gr.A') {
          if (data[i].resultSaliva.resultSaliva === 'Secretor gr.A') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Secretor gr.B') {
          if (data[i].resultSaliva.resultSaliva === 'Secretor gr.B') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Secretor gr.AB') {
          if (data[i].resultSaliva.resultSaliva === 'Secretor gr.AB') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Secretor gr.O') {
          if (data[i].resultSaliva.resultSaliva === 'Secretor gr.O') {
            newData.push(data[i]);
            break;
          }
        } if (name === 'Non-Secretor') {
          if (data[i].resultSaliva.resultSaliva === 'Non-Secretor') {
            newData.push(data[i]);
            break;
          }
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 'delete') {
          data.splice(i, 1);
          i -= 1;
        }
      }
      this.isFind = data;
      if (this.isFind.length === 0) {
        this.isFound = false;
      } else {
        this.patients = data;
        this.isFound = true;
      }
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
    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการลบคนไข้รายนี้ใช่หรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการลบ',
      cancelButtonText: 'ไม่ ต้องการลบ'
    }).then((result) => {
      if (result.value) {
        this.statusForm.value.status = 'delete';
        this.patientService.deletePatient(this.statusForm.value, id);
        Swal(
          'ลบรายชื่อคนไข้เรียบร้อย!',
          '',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้รายชื่อลบคนไข้',
          'error'
        );
      }
    });
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
