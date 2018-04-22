import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


import { SharingdataService } from '../shared/sharingdata.service';
import { PatientService } from '../shared/patient.service';
import { LoginComponent } from '../../auth/login/login.component';

import { Relatives } from '../shared/relatives';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-relatives-form',
  templateUrl: './relatives-form.component.html',
  styleUrls: ['./relatives-form.component.css']
})
export class RelativesFormComponent implements OnInit {

  patients: any;
  relatives: any;
  findRelatives: any;
  message: string;
  isFound = false;

  conditionForm: FormGroup;
  relativeForm: FormGroup;

  constructor(private patientService: PatientService,
    private msg: SharingdataService) { }

  ngOnInit() {
    this.buildForm();
    this.buildForm2();
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.loadData();
      this.loadRelative();
      // console.log('aaaa' + message);
    }
    );
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl(),
      fName: new FormControl(),
      lName: new FormControl()
    });

  }
  buildForm2() {
    // this.relativeForm = new FormGroup({
    //   patientId: new FormGroup({
    //     relativeId: new FormGroup({
    //       relativeName: new FormControl()
    //     })
    //   })

    // });
    this.relativeForm = new FormGroup({
      relativeName: new FormControl()
    });
  }

  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
    });
  }
  loadRelative() {

    this.patientService.relativesOfPatient(this.message).subscribe(data => {
      console.log('dataaaa' + data);

      this.relatives = new Array<Relatives>();

      this.patientService.loaddetailPatient(data, (cb, i) => {
        this.relatives.push({
          patientId: cb[0].id,
          fName: cb[0].fName,
          lName: cb[0].lName,
          relativeId: data[i].key,
          relativeName: data[i].relativeName
        });
        // console.log(data);
      });
    });
  }
  searchRelatives() {
    this.patientService.queryRelatives(this.conditionForm.value.fName).subscribe(data => {
      this.findRelatives = data;
      if (this.relatives != null) {
        this.isFound = true;
      } else {
        this.isFound = false;
      }
      console.log(this.isFound);
      // this.buildForm2();
    });
  }
  addRelatives(relativeId: string) {
    // this.relativeForm.value.patientId = this.message;
    // this.relativeForm.value.relativeId = relativeId;

    // this.addOtherRelatives(this.relativeForm.value, this.message, relativeId);
    console.log(relativeId);

    console.log(this.conditionForm.value.fName);
    console.log(this.conditionForm.value.lName);
    console.log(this.conditionForm.value.id);
    console.log(this.conditionForm.value.id);
    this.patientService.detailPatient(relativeId).subscribe(data => {

      console.log(data);
      // this.oppositeRelatives(this.relativeForm.value.relativeName, relativeId);
      Swal({
        title: 'คุณแน่ใจใช่หรือไม่?',
        text: 'คุณต้องการที่จะเพิ่มรายชื่อญาติ คือ ' + data[0].fName + ' ' + data[0].lName,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่ ต้องการเพิ่ม',
        cancelButtonText: 'ไม่ ต้องการเพิ่ม'
      }).then((result) => {
        if (result.value) {

          this.conditionForm.value.fName = data[0].fName;
          this.conditionForm.value.lName = data[0].lName;
          let sex = this.validationRelative(data);
          let canSet = this.checkRelativeName(sex, this.relativeForm.value);
          if (canSet) {

            this.patientService.addRelatives(this.relativeForm.value, this.message, relativeId);


            this.patientService.detailPatient(this.message).subscribe(patient => {
              this.conditionForm.value.fName = patient[0].fName;
              this.conditionForm.value.lName = patient[0].lName;
              sex = this.validationRelative(patient);
              this.relativeForm.value.relativeName = this.getRelativeName(this.relativeForm.value.relativeName, sex);
              // this.relativeForm.value.relativeName = this.oppositeRelatives(this.relativeForm.value.relativeName, patient[0].minit);

              canSet = this.checkRelativeName(sex, this.relativeForm.value);
              if (canSet) {
                this.patientService.addRelatives(this.relativeForm.value, relativeId, this.message);
              }
            });
            // sex = this.validationRelative(data);
            // this.getRelativeName(this.message, sex);
            // this.oppositeRelatives(this.relativeForm.value.relativeName, this.message);
            Swal(
              'เพิ่มรายชื่อญาติรายใหม่!',
              data[0].fName + ' ' + data[0].lName + ' เรียบร้อย',
              'success'
            );
          } else {
            Swal(
              'ผิดพลาด!',
              'ยังไม่ได้เพิ่มรายชื่อญาติ  กรุณาเลือกชื่อความสัมพันธ์ให้ถูกต้อง' + data[0].fName + ' ' + data[0].lName,
              'error'
            );
          }


        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal(
            'ยกเลิก!',
            'ยังไม่ได้เพิ่มรายชื่อญาติ' + data[0].fName + ' ' + data[0].lName,
            'error'
          );
        }
      });
    });

  }
  checkRelativeName(sex: string, relativeName: string) {
    let canSet = true;
    if (sex === 'male') {
      if (relativeName === 'แม่' || relativeName === 'ย่า/ยาย' || relativeName === 'ภรรยา') {
        canSet = false;
      }
    } else if (sex === 'female') {
      if (relativeName === 'พ่อ' || relativeName === 'ปู่/ตา' || relativeName === 'สามี') {
        canSet = false;
      }
    }
    return canSet;
  }
  validationRelative(patient: Array<any>) {
    console.log(patient[0].minit);
    if (patient[0].minit === 'นาง' || patient[0].minit === 'นางสาว' || patient[0].minit === 'เด็กหญิง') {
      return 'female';
    } else if (patient[0].minit === 'นาย' || patient[0].minit === 'เด็กชาย') {
      return 'male';
    }
  }
  // oppositeRelatives(relativeName: string, minit: string) {
  //   this.patientService.detailPatient(relativeId).subscribe(data => {
  //     console.log(data);
  //     this.conditionForm.value.fName = data[0].fName;
  //     this.conditionForm.value.lName = data[0].lName;
  //     const sex = this.validationRelative(data);
  //     this.relativeForm.value.relativeName = this.getRelativeName(relativeName, sex);
  //     this.patientService.addRelatives(this.relativeForm.value, relativeId, this.message);
  //   });
  //   // this.patientService.detailPatient(patient[0].id).subscribe(data => {
  //   //   console.log(data);
  //   // });
  // }
  getRelativeName(relativeName: string, sex: string) {
    let newRelative;
    if (relativeName === 'พ่อ' && sex === 'male') {
      newRelative = 'ลูก';
    } else if (relativeName === 'แม่' && sex === 'female') {
      newRelative = 'ลูก';
    } else if (relativeName === 'สามี' && sex === 'male') {
      newRelative = 'ภรรยา';
    } else if (relativeName === 'ภรรยา' && sex === 'female') {
      newRelative = 'สามี';
    } else if (relativeName === 'ลูก' && sex === 'male') {
      newRelative = 'พ่อ';
    } else if (relativeName === 'ลูก' && sex === 'female') {
      newRelative = 'แม่';
    } else if (relativeName === 'พี่/น้อง') {
      newRelative = 'พี่/น้อง';
    } else if (relativeName === 'ปู่/ตา' && sex === 'male') {
      newRelative = 'หลาน';
    } else if (relativeName === 'ย่า/ยาย' && sex === 'female') {
      newRelative = 'หลาน';
    } else if (relativeName === 'หลาน'  && sex === 'male') {
      newRelative = 'ปู่/ตา';
    } else if (relativeName === 'หลาน' && sex === 'female') {
      newRelative = 'ย่า/ยาย';
    }
    return newRelative;
  }
  deleteRelative(id: string) {
    this.patientService.deleteRelative(this.message, id);
  }

}
