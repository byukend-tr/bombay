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

  selectedFiles: FileList;
  fileList: any;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };

  fileUploads: FirebaseListObservable<FileUpload[]>;
  temp: any;

  patients: any;
  message: string;

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
    }
    );

  }
  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      console.log(this.patients);

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
      groupAbo: new FormControl
      // secretor: new FormControl(),
      // nonSecretor: new FormControl(),
      // nss: new FormControl(),
      // TestAntiA: new FormControl(),
      // TestAntiB: new FormControl(),
      // TestAntiH: new FormControl(),
      // groupSaliva: new FormControl(),
      // checkBoxAdd: new FormControl()
    });
  }

  validationInput() {
    if (this.selectedFiles) {
      this.upload();
    }
    this.createTest();
  }

  validationForm() {

    // tslint:disable-next-line:max-line-length
    if (this.conditionForm.value.AntiA && this.conditionForm.value.AntiB && this.conditionForm.value.AntiAB && this.conditionForm.value.Acell && this.conditionForm.value.Bcell && this.conditionForm.value.Ocell) {

      Swal({
        title: 'คุณแน่ใจใช่หรือไม่?',
        text: 'ต้องการเพิ่มการทดสอบ"การตรวจหมู่เลือดเอบีโอ" ของคนไข้ ' +
          this.patients[0].fName + ' ' +
          this.patients[0].lName + ' ใช่หรือไม่',
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

  createTest(): void { // Input data
    // this.decisiontreeService.createDecisionTree(this.conditionForm.value);
    console.log(this.patients);
    const id = this.patients[0].id;

    this.conditionForm.value.groupAbo = this.decisionService.analyzeAboTest(this.conditionForm.value);
    // this.decisionService.analyzeAboTest(this.conditionForm.value);
    this.patientService.createAboTest(this.conditionForm.value, id);
  }

  selectFile(event) {
    const file = event.target.files.item(0);

    console.log(file) คิดแปบ
    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
      console.log(this.selectedFiles.item);

      this.fileList.push();
    } else {
      alert('invalid format!');
    }
  }

  upload() {


    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.patientService.pushFileToStorage(this.currentFileUpload, this.progress);
  }

  loadPhoto() {
    // this.fileUploads = this.patient.getFileUploads({ limitToLast: 3 });
    this.temp = this.patientService.getFileUploads({ limitToLast: 10 });
  }

}
