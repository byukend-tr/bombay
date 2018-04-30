import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { DecisiontreeService } from '../../decisiontree/shared/decisiontree.service';
import { SharingdataService } from '../shared/sharingdata.service';
import { FileUpload } from '../shared/file-upload';

import { Router } from '@angular/router';

// Gallery
// import { GalleryImage } from 'models/galleryImage.model';
import { Observable } from 'rxjs/Observable';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-phenotype-abo-form',
  templateUrl: './phenotype-abo-form.component.html',
  styleUrls: ['./phenotype-abo-form.component.css']
})
export class PhenotypeAboFormComponent implements OnInit {

  conditionForm: FormGroup;
  resultForm: FormGroup;

  allfileList: Array<any> = [];
  selectedFiles: FileList;
  fileList: any;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };

  fileUploads: FirebaseListObservable<FileUpload[]>;
  temp: any;

  patients: any;
  message: string;

  testList: any;

  constructor(private patientService: PatientService,
    private decisionService: DecisiontreeService,
    private msg: SharingdataService,
    private router: Router) { }

  ngOnInit() {
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.loadData();
      this.buildForm();
      this.loadPhoto();
      this.conditionForm.value.dateTimeNow = this.getDateTime();

      console.log(this.conditionForm.value.dateTimeNow);
    });

  }
  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
    });
  }

  newMessage() {
    this.msg.changeMessage(this.message);
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      AntiA: new FormControl(),
      AntiB: new FormControl(),
      AntiAB: new FormControl(),
      Acell: new FormControl(),
      Bcell: new FormControl(),
      Ocell: new FormControl(),
      Note: new FormControl(),
      groupAbo: new FormControl(),
      dateTimeNow: new FormControl(),

      status: new FormControl(),

      TestAntiA: new FormControl(),
      TestAntiB: new FormControl(),
      TestAntiH: new FormControl(),
    });
    this.resultForm = new FormGroup({
      idAbo: new FormControl(),
      resultAbo: new FormControl()
    });
  }

  validationInput() {

    const keyTest = this.createTest();
    console.log(this.selectedFiles);
    // if (this.selectedFiles) {
    //   console.log('sele file');
    //   this.upload(keyTest);
    // }
    if (this.allfileList) {
      this.upload(keyTest);
    }

  }

  validationForm() {

    // tslint:disable-next-line:max-line-length
    if (this.conditionForm.value.AntiA && this.conditionForm.value.AntiB && this.conditionForm.value.AntiAB && this.conditionForm.value.Acell && this.conditionForm.value.Bcell && this.conditionForm.value.Ocell) {
      this.setValueInDecision();
      this.conditionForm.value.groupAbo = this.decisionService.analyzeAboTest(this.conditionForm.value);
      Swal({
        title: 'คุณแน่ใจใช่หรือไม่?',
        text: 'ต้องการเพิ่มการทดสอบ"การตรวจหมู่เลือดเอบีโอ" ของคนไข้ ' +
          this.patients[0].fName + ' ' +
          this.patients[0].lName + ' ใช่หรือไม่   ' + 'ผลการวิเคราะห์หมู่เลือด คือ ' + this.conditionForm.value.groupAbo,
        // ' ได้แก่ <br/>' +
        // '<span class="text">Anti-A: ' + this.conditionForm.value.AntiA + '+</span>' +
        // 'Anti-B: ' + this.conditionForm.value.AntiB + '+' + ' <br/>' +
        // 'Anti-AB: ' + this.conditionForm.value.AntiAB + '+' + ' <br/>' +
        // 'A Cell: ' + this.conditionForm.value.Acell + '+' + ' <br/>' +
        // 'B Cell: ' + this.conditionForm.value.Bcell + '+' + ' <br/>' +
        // 'O Cell: ' + this.conditionForm.value.Ocell + '+' + '<br/>' +
        // 'หมายเหตุ: ' + this.conditionForm.value.Note + '+' + ' <br/>',

        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่ ต้องการเพิ่ม',
        cancelButtonText: 'ไม่ ต้องการเพิ่ม'
      }).then((result) => {
        if (result.value) {

          // this.patientService.createPatient(this.conditionForm.value);

          this.validationInput();

          this.router.navigate(['/test/detail']);
          Swal(
            'สร้างการทดสอบเรียบร้อยแล้ว!',
            this.patients[0].fName + ' ' + this.patients[0].lName + ' เรียบร้อย',
            'success'
          );
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal(
            'ยกเลิก!',
            'ยังไม่ได้สร้างการทดสอบของ ' + this.patients[0].fName + ' ' + this.patients[0].lName,
            'error'
          );
        }
      });
    } else {
      Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
    }



  }
  getDateTime() {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    const date = today.toLocaleDateString();
    return date + ' ' + time;
  }
  setValueInDecision() {
    this.conditionForm.value.TestAntiA = '-1';
    this.conditionForm.value.TestAntiB = '-1';
    this.conditionForm.value.TestAntiH = '-1';
    this.conditionForm.value.status = 'ok';
  }
  createTest() { // Input data
    const id = this.patients[0].id;
    this.setValueInDecision();
    this.conditionForm.value.groupAbo = this.decisionService.analyzeAboTest(this.conditionForm.value);
    this.conditionForm.value.dateTimeNow = this.getDateTime();

    const newRef = this.patientService.createAboTest(this.conditionForm.value, id);

    this.resultForm.value.idAbo = newRef.key;
    this.resultForm.value.resultAbo = this.conditionForm.value.groupAbo;
    this.patientService.updateResult(this.resultForm.value, id, 'resultAbo');
    // tslint:disable-next-line:max-line-length
    if (this.conditionForm.value.groupAbo === 'Group A' || this.conditionForm.value.groupAbo === 'Group B' || this.conditionForm.value.groupAbo === 'Group AB' || this.conditionForm.value.groupAbo === 'Group O') {
      this.patientService.updateBloodResult(this.conditionForm.value.groupAbo, id);
      this.conditionForm.value.TestAntiA = '-2';
      this.conditionForm.value.TestAntiB = '-2';
      this.conditionForm.value.TestAntiH = '-2';
      this.patientService.updateAboTest(this.conditionForm.value, id, newRef.key);

    }
    return newRef.key;
  }

  selectFile(event) {
    const list = event.target.files;
    console.log('list' + list);

    for (let i = list.length - 1; i >= 0; i--) {
      // console.log(list[i]);
      if (this.allfileList.length === 0) {
        this.allfileList.push(list[i]);
      } else {
        let duplicate = false;
        for (let j = 0; j < this.allfileList.length; j++) {
          if (list[i].name === this.allfileList[j].name) {
            duplicate = true;
            break;
          }
        }
        if (!duplicate) {
          this.allfileList.push(list[i]);
        }
      }
    }
  }

  upload(key: string) {
    let i;
    for (i = 0; i < this.allfileList.length; i++) {
      const file = this.allfileList[i];
      this.currentFileUpload = new FileUpload(file);
      this.patientService.pushFileToStorage_abo(this.currentFileUpload, this.progress, this.patients[0].id, key, i);
    }
    this.allfileList = undefined;
  }

  loadPhoto() {
    this.temp = this.patientService.getFileUploads({ limitToLast: 10 });
  }

}
