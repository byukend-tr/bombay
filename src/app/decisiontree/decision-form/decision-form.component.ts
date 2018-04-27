import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../auth/shared/auth.service';
import { DecisiontreeService } from '../shared/decisiontree.service';
import { Decisiontree } from './../shared/decisiontree';
import { log } from '@firebase/database/dist/esm/src/core/util/util';


import Swal from 'sweetalert2';

// JSON File
// import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
// import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
// @Injectable()

@Component({
  selector: 'app-decision-form',
  templateUrl: './decision-form.component.html',
  styleUrls: ['./decision-form.component.css']
})
export class DecisionFormComponent implements OnInit {

  addCondition = false;
  conditionForm: FormGroup;
  selectSaliva: any;

  // private _url = 'assets/trainingdata.json';
  // herbs = [];
  trainingImport: string[];
  training$: Subscription;

  constructor(private auth: AuthService,
    private decisiontreeService: DecisiontreeService,
    // private _http: Http,
    private httpService: HttpClient
  ) {

  }

  ngOnInit() {
    this.buildForm();
    // this.validationForm();

  }

  buildForm() {
    this.conditionForm = new FormGroup({
      AntiA: new FormControl(),
      AntiB: new FormControl(),
      AntiAB: new FormControl(),
      Acell: new FormControl(),
      Bcell: new FormControl(),
      Ocell: new FormControl(),
      groupAbo: new FormControl(),
      secretor: new FormControl(),
      nonSecretor: new FormControl(),
      nss: new FormControl(),
      TestAntiA: new FormControl(),
      TestAntiB: new FormControl(),
      TestAntiH: new FormControl(),
      groupSaliva: new FormControl(),
      checkBoxAdd: new FormControl(),
      status: new FormControl()
    });
  }
  groupType() {
    const additionData = this.conditionForm.value.groupAbo;
    if (additionData === 'Group A' || additionData === 'Group B' || additionData === 'Group AB' || additionData === 'Group O') {
      return false;
    } else {
      return true;
    }
  }
  groupAboChange(e) {
    const selected = <HTMLInputElement[]><any>document.getElementsByName('checkbox');
    this.selectSaliva = e.target.checked;
    console.log(e.target.checked);
    if (e.target.checked === false) {
      document.getElementById('saliva').style.display = 'none';
    } else {
      document.getElementById('saliva').style.display = 'block';

    }
  }
  setDatagroupAbo() {
    this.conditionForm.value.secretor = null;
    this.conditionForm.value.nonSecretor = null;
    this.conditionForm.value.nss = null;
    this.conditionForm.value.TestAntiA = '-2';
    this.conditionForm.value.TestAntiB = '-2';
    this.conditionForm.value.TestAntiH = '-2';
    this.conditionForm.value.groupSaliva = null;
    this.conditionForm.value.result = this.conditionForm.value.groupAbo;
    this.conditionForm.value.status = 'addition';
  }
  setDatagroupSaliva() {
    this.conditionForm.value.secretor = null;
    this.conditionForm.value.nonSecretor = null;
    this.conditionForm.value.nss = null;
    this.conditionForm.value.TestAntiA = '-1';
    this.conditionForm.value.TestAntiB = '-1';
    this.conditionForm.value.TestAntiH = '-1';
    this.conditionForm.value.groupSaliva = null;
    this.conditionForm.value.result = this.conditionForm.value.groupAbo;
    this.conditionForm.value.status = 'addition';
  }
  validationInput() {
    const valueGroupAbo = this.conditionForm.value.groupAbo;
    const valueGroupSaliva = this.conditionForm.value.groupSaliva;
    let canCreate;
    console.log(this.selectSaliva);
    console.log(valueGroupAbo, this.conditionForm.value.groupSaliva);

    if (!this.groupType()) {
      this.setDatagroupAbo();
      canCreate = true;
    } else if (this.groupType() && this.selectSaliva === true) {
      this.setDatagroupSaliva();
      canCreate = true;
    } else if (valueGroupAbo === 'Group A with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.A') {
      this.conditionForm.value.result = 'para-Bombay A';
      canCreate = true;
    } else if (valueGroupAbo === 'Group B with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.B') {
      this.conditionForm.value.result = 'para-Bombay B';
      canCreate = true;
    } else if (valueGroupAbo === 'Group AB with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.AB') {
      this.conditionForm.value.result = 'para-Bombay AB';
      canCreate = true;
    } else if (valueGroupAbo === 'Group O with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.O') {
      this.conditionForm.value.result = 'para-Bombay O';
      canCreate = true;
    } else if (valueGroupAbo === 'Group O with unexpected alloantibody' && valueGroupSaliva === 'Non-Secretor') {
      this.conditionForm.value.result = 'O Bombay';
      canCreate = true;
    } else {
      canCreate = false;
    }
    console.log(canCreate);

    if (canCreate === true) {
      this.createCondition();

    }


  }

  validationForm() {
    let validationSuccess = true;
    // tslint:disable-next-line:max-line-length
    if (!this.conditionForm.value.AntiA || !this.conditionForm.value.AntiB || !this.conditionForm.value.AntiAB || !this.conditionForm.value.Acell || !this.conditionForm.value.Bcell || !this.conditionForm.value.Ocell || !this.conditionForm.value.groupAbo) {
      // tslint:disable-next-line:max-line-length
      validationSuccess = false;
      // tslint:disable-next-line:max-line-length
    } else if (!this.groupType()) { // Abo
      this.setDatagroupAbo();
    } else if (this.groupType()) { // Saliva
      this.setDatagroupSaliva();
    } else if (this.groupType()) { // Abo and Saliva
      // tslint:disable-next-line:max-line-length
      if (!this.conditionForm.value.secretor || !this.conditionForm.value.nonSecretor || !this.conditionForm.value.nss || !this.conditionForm.value.TestAntiA || !this.conditionForm.value.TestAntiB || !this.conditionForm.value.TestAntiH || !this.conditionForm.value.groupSaliva) {
        validationSuccess = false;
      }
    }


    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'ต้องการเพิ่มข้อมูลการเรียนรู้',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการเพิ่ม',
      cancelButtonText: 'ไม่ ต้องการเพิ่ม'
    }).then((result) => {
      if (result.value) {
        if (validationSuccess) {
          this.validationInput();
          Swal(
            'เพิ่มข้อมูลลการเรียนรู้เรียบร้อยแล้ว!', '',
            'success'
          );
        } else {
          Swal(
            'ผิดพลาด!', 'กรุณากรอกเงื่อนไขให้ครบถ้วน',
            'error'
          );
        }

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้เพิ่มเงื่อนไขการเรียนรู้',
          'error'
        );
      }
    });

  }

  createCondition(): void { // Input data

    this.decisiontreeService.createDecisionTree(this.conditionForm.value);

  }
  importJson(event) {

    this.training$ = this.httpService.get('./../assets/trainingdata.json').subscribe(
      data => {
        this.trainingImport = data as string[];	 // FILL THE ARRAY WITH DATA.
        // console.log(this.trainingImport);
        this.setJsonToFirebase(this.trainingImport);
        this.training$.unsubscribe();
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }
  setJsonToFirebase(data: Array<any>) {
    for (let i = 0; i < data.length; i++) {

      this.conditionForm.value.AntiA = data[i].AntiA;
      this.conditionForm.value.AntiB = data[i].AntiB;
      this.conditionForm.value.AntiAB = data[i].AntiAB;
      this.conditionForm.value.Acell = data[i].Acell;
      this.conditionForm.value.Bcell = data[i].Bcell;
      this.conditionForm.value.Ocell = data[i].Ocell;
      this.conditionForm.value.groupAbo = data[i].groupAbo;


      this.conditionForm.value.TestAntiA = data[i].TestAntiA;
      this.conditionForm.value.TestAntiB = data[i].TestAntiB;
      this.conditionForm.value.TestAntiH = data[i].TestAntiH;
      this.conditionForm.value.groupSaliva = data[i].groupSaliva;
      this.conditionForm.value.result = data[i].result;

      this.conditionForm.value.status = data[i].status;

      this.decisiontreeService.createDecisionTree(this.conditionForm.value);
    }
  }
}

