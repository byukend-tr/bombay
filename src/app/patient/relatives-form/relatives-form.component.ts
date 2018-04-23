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
  relativeForm2: FormGroup;

  conditionList: any = [];
  isFind = Array<any>();

  constructor(private patientService: PatientService,
    private msg: SharingdataService) { }

  ngOnInit() {
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.buildForm();
      this.buildForm2();
      this.loadData();
      this.loadRelative();
      this.conditionList = [];
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
    this.relativeForm = new FormGroup({
      relativeName: new FormControl()
    });
    this.relativeForm2 = new FormGroup({
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
      });
    });
  }
  checkInputId() {
    if (this.conditionForm.value.id.length === 13) {
      return true;
    } else {
      return false;
    }
  }
  searchRelatives() {
    if (this.conditionForm.value.id) {
      if (this.checkInputId) {
        this.conditionList.push('id');
      } else {
        Swal('เกิดความผิดพลาด!', 'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก', 'error');
        // ********************************************************************************
      }
    } if (this.conditionForm.value.fName) {
      this.conditionList.push('fName');
    } if (this.conditionForm.value.lName) {
      this.conditionList.push('lName');
    }

    if (this.conditionList.length === 0) {
      Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลการค้นหา', 'error');
    } else {

      let filedName = null;
      let filed = null;

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
        }
        console.log(filed, filedName);

        // console.log(this.conditionList.length);
        // console.log(this.conditionList);

        this.patientService.queryRelatives(filed, filedName).subscribe(data => {
          // console.log(data);
          this.conditionList.splice(0, 1);
          // console.log(this.conditionList);

          // console.log(this.conditionList.length);
          for (let i = 0; i < this.conditionList.length; i++) {
            console.log('conditionForrrrr ' + this.conditionList[i]);
            if (this.conditionList[i] === 'fName') {
              data = this.filterFirstName(data);
            } else if (this.conditionList[i] === 'lName') {
              data = this.filterLastName(data);
            }
          }

          this.showPatient(data);
          this.buildForm(); // Clear value in search
          this.conditionList = [];
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
  showPatient(data: Array<any>) {
    this.findRelatives = data;
    console.log(this.findRelatives);
    if (this.findRelatives.length === 0) {
      this.isFound = false;
      // console.log(this.isFound);

    } else {
      this.findRelatives = data;
      this.isFound = true;
      // console.log(this.isFound);
    }
  }
  addRelatives(relativeId: string) {

    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการที่จะเพิ่มรายชื่อญาติ ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการเพิ่ม',
      cancelButtonText: 'ไม่ ต้องการเพิ่ม'
    }).then((result) => {
      if (result.value) {
        this.addRelative1(relativeId, this.addRelative2(relativeId));

        Swal(
          'เพิ่มรายชื่อญาติรายใหม่เรียบร้อย!',
          '',
          'success'
        );


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้เพิ่มรายชื่อญาติ',
          'error'
        );
      }
      // if (result.value) {
      //   this.patientService.detailPatient(relativeId).subscribe(data => {   // เอาชื่อ-นามสกุล

      //     this.conditionForm.value.fName = data[0].fName;
      //     this.conditionForm.value.lName = data[0].lName;
      //     let sex = this.validationRelative(data);
      //     let canSet = this.checkRelativeName(sex, this.relativeForm.value.relativeName);
      //     if (canSet) {

      //       this.patientService.addRelatives(this.relativeForm.value, this.message, relativeId); // แอดด้านที่ 1
      //       console.log('add 1 okkokoko');


      //       this.patientService.detailPatient(this.message).subscribe(patient => {
      //         this.conditionForm.value.fName = patient[0].fName;
      //         this.conditionForm.value.lName = patient[0].lName;
      //         sex = this.validationRelative(patient);
      //         this.relativeForm.value.relativeName = this.getRelativeName(this.relativeForm.value.relativeName, sex);
      //         console.log(this.relativeForm.value.relativeName);



      //         canSet = this.checkRelativeName(sex, this.relativeForm.value.relativeName);
      //         if (canSet) {
      //           this.patientService.addRelatives(this.relativeForm.value, relativeId, this.message); // แอดด้านที่ 2
      //           Swal(
      //             'เพิ่มรายชื่อญาติรายใหม่เรียบร้อย!',
      //             '',
      //             'success'
      //           );

      //         } else {
      //           Swal(
      //             'ผิดพลาด!',
      //             'ยังไม่ได้เพิ่มรายชื่อญาติ  กรุณาเลือกชื่อความสัมพันธ์ให้ถูกต้อง',
      //             'error'
      //           );
      //         }
      //       });

      //     } else {
      //       Swal(
      //         'ผิดพลาด!',
      //         'ยังไม่ได้เพิ่มรายชื่อญาติ  กรุณาเลือกชื่อความสัมพันธ์ให้ถูกต้อง',
      //         'error'
      //       );
      //     }


      //   });
      // } else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal(
      //     'ยกเลิก!',
      //     'ยังไม่ได้เพิ่มรายชื่อญาติ',
      //     'error'
      //   );
      // }
    });

  }
  addRelative1(relativeId: string, callback) {
    this.patientService.detailPatient(relativeId).subscribe(data => {
      // this.conditionForm.value.fName = data[0].fName;
      // this.conditionForm.value.lName = data[0].lName;
      const sex1 = this.validationRelative(data[0].minit);
      const relativeName1 = this.relativeForm.value.relativeName;
      const canSet1 = this.checkRelativeName(sex1, relativeName1);

      if (canSet1) {
        console.log('11111111', this.relativeForm.value, this.message, relativeId);
        this.patientService.addRelatives(this.relativeForm.value, this.message, relativeId); // แอดด้านที่ 1
      }

    });
    callback();
  }
  addRelative2(relativeId: string) {
    this.patientService.detailPatient(this.message).subscribe(patient => {
      // this.conditionForm.value.fName = data[0].fName;
      // this.conditionForm.value.lName = data[0].lName;
      const sex2 = this.validationRelative(patient[0].minit);
      const relativeName2 = this.getRelativeName(this.relativeForm.value.relativeName, sex2);
      this.relativeForm2.value.relativeName = relativeName2;
      console.log(this.relativeForm2.value.relativeName);

      const canSet2 = this.checkRelativeName(sex2, relativeName2);

      if (canSet2) {
        console.log('22222', this.relativeForm2.value, relativeId, this.message);

        this.patientService.addRelatives(this.relativeForm2.value, relativeId, this.message); // แอดด้านที่ 1
      }
    });
  }
  checkRelativeName(sex: string, relativeName: string) {
    console.log(sex, relativeName);

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
    console.log(canSet);

    return canSet;
  }
  validationRelative(minit: string) {
    console.log(minit);
    if (minit === 'นาง' || minit === 'นางสาว' || minit === 'เด็กหญิง') {
      return 'female';
    } else if (minit === 'นาย' || minit === 'เด็กชาย') {
      return 'male';
    }
  }
  getRelativeName(relativeName: string, sex: string) {
    console.log(relativeName, sex);

    let newRelative;
    if (relativeName === 'พ่อ') {
      newRelative = 'ลูก';
    } else if (relativeName === 'แม่') {
      newRelative = 'ลูก';
    } else if (relativeName === 'สามี') {
      newRelative = 'ภรรยา';
    } else if (relativeName === 'ภรรยา') {
      newRelative = 'สามี';
    } else if (relativeName === 'ลูก' && sex === 'male') {
      newRelative = 'พ่อ';
    } else if (relativeName === 'ลูก' && sex === 'female') {
      newRelative = 'แม่';
    } else if (relativeName === 'พี่/น้อง') {
      newRelative = 'พี่/น้อง';
    } else if (relativeName === 'ปู่/ตา') {
      newRelative = 'หลาน';
    } else if (relativeName === 'ย่า/ยาย') {
      console.log(relativeName, 'relativeName');
      newRelative = 'หลาน';
    } else if (relativeName === 'หลาน' && sex === 'male') {
      newRelative = 'ปู่/ตา';
    } else if (relativeName === 'หลาน' && sex === 'female') {
      newRelative = 'ย่า/ยาย';
    }
    console.log(newRelative);

    return newRelative;
  }
  deleteRelative(id: string) {


    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการที่จะลบความสัมพันธ์ใช่หรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการลบ',
      cancelButtonText: 'ไม่ ต้องการลบ'
    }).then((result) => {
      if (result.value) {

        this.patientService.deleteRelative(this.message, id);
        this.patientService.deleteRelative(id, this.message);
        Swal('สำเร็จ!', 'ลบความสัมพันธ์เรียบร้อยแล้ว',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้ลบความสัมพันธ์ของคนไข้',
          'error'
        );
      }
    });


  }

}
