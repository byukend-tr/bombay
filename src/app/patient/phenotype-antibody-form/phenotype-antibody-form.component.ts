import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { FileUpload } from '../shared/file-upload';
import { Router } from '@angular/router';
import { DecisiontreeService } from '../../decisiontree/shared/decisiontree.service';
import { SharingdataService } from '../shared/sharingdata.service';

// Gallery
// import { GalleryImage } from 'models/galleryImage.model';
import { Observable } from 'rxjs/Observable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-phenotype-antibody-form',
  templateUrl: './phenotype-antibody-form.component.html',
  styleUrls: ['./phenotype-antibody-form.component.css']
})
export class PhenotypeAntibodyFormComponent implements OnInit {

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
    }
    );

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
      rt1: new FormControl(),
      c1: new FormControl(),
      ahg1: new FormControl(),
      ccc1: new FormControl(),
      rt2: new FormControl(),
      c2: new FormControl(),
      ahg2: new FormControl(),
      ccc2: new FormControl(),
      antibody1: new FormControl(),
      antibody2: new FormControl(),
      Note: new FormControl(),
      dateTimeNow: new FormControl(),
      status: new FormControl()

    });
    this.resultForm = new FormGroup({
      idAntibody: new FormControl(),
      resultAntibody1: new FormControl(),
      resultAntibody2: new FormControl()
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
  foundAntibody() {
    let antibody1 = 'ไม่สามารถระบุชนิด alloantibody ได้';
    if (this.conditionForm.value.ccc1 === '0') {
      antibody1 = 'ทำการทดลองใหม่';
    } else if (this.conditionForm.value.rt1 === '0' && this.conditionForm.value.c1 === '0' || this.conditionForm.value.ahg1 === '0') {
      antibody1 = 'ไม่พบ alloantibody';
    } else {
      if (this.conditionForm.value.rt1 !== '0') {
        if (this.conditionForm.value.c1 !== '0') {
          if (this.conditionForm.value.ahg1 !== '0') {
            if (this.conditionForm.value.ccc1 === 'ND') {
              antibody1 = 'IgM, IgG';
            }
          } else {
            if (this.conditionForm.value.ccc1 !== '-1' && this.conditionForm.value.ccc1 !== '0') {  // +
              antibody1 = 'IgM';
            }
          }
        } else {
          if (this.conditionForm.value.ahg1 !== '0') {
            if (this.conditionForm.value.ccc1 === '-1') {
              antibody1 = 'IgM, IgG';
            }
          } else {
            antibody1 = 'IgM';
          }
        }
      }
    }


    let antibody2 = 'ไม่สามารถระบุชนิด alloantibody ได้';
    if (this.conditionForm.value.ccc2 === '0') {
      antibody2 = 'ทำการทดลองใหม่';
    } else if (this.conditionForm.value.rt2 === '0' && this.conditionForm.value.c2 === '0' || this.conditionForm.value.ahg2 === '0') {
      antibody2 = 'ไม่พบ alloantibody';
    } else {
      if (this.conditionForm.value.rt2 !== '0') {
        if (this.conditionForm.value.c2 !== '0') {
          if (this.conditionForm.value.ahg2 !== '0') {
            if (this.conditionForm.value.ccc2 === '-1') {
              antibody2 = 'IgM, IgG';
            }
          } else {
            if (this.conditionForm.value.ccc2 !== '-1' && this.conditionForm.value.ccc2 !== '0') {  // +
              antibody2 = 'IgM';
            }
          }
        } else {
          if (this.conditionForm.value.ahg2 !== '0') {
            if (this.conditionForm.value.ccc2 === '-1') {
              antibody2 = 'IgM, IgG';
            }
          } else {
            antibody2 = 'IgM';
          }
        }
      }
    }
    return antibody1 + ' || ' + antibody2;
  }
  validationForm() {
    // tslint:disable-next-line:max-line-length
    if (this.conditionForm.value.rt1 && this.conditionForm.value.c1 && this.conditionForm.value.ahg1 && this.conditionForm.value.ccc1) {
      if (this.conditionForm.value.rt2 && this.conditionForm.value.c2 && this.conditionForm.value.ahg2 && this.conditionForm.value.ccc2) {
        Swal({
          title: 'คุณแน่ใจใช่หรือไม่?',
          text: 'ต้องการเพิ่มการทดสอบ"การตรวจกรองแอนติบอดี" ของคนไข้ ' +
            this.patients[0].fName + ' ' +
            this.patients[0].lName + ' ใช่หรือไม่ ' + 'ซึ่งผลการทดสอบคือ ' + this.foundAntibody(),
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



      }

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
  createTest() { // Input data
    const id = this.patients[0].id;
    let antibody1 = 'ไม่สามารถระบุชนิด alloantibody ได้';
    if (this.conditionForm.value.ccc1 === '0') {
      antibody1 = 'ทำการทดลองใหม่';
    } else if (this.conditionForm.value.rt1 === '0' && this.conditionForm.value.c1 === '0' || this.conditionForm.value.ahg1 === '0') {
      antibody1 = 'ไม่พบ alloantibody';
    } else {
      if (this.conditionForm.value.rt1 !== '0') {
        if (this.conditionForm.value.c1 !== '0') {
          if (this.conditionForm.value.ahg1 !== '0') {
            if (this.conditionForm.value.ccc1 === 'ND') {
              antibody1 = 'IgM, TgG';
            }
          } else {
            if (this.conditionForm.value.ccc1 !== '-1' && this.conditionForm.value.ccc1 !== '0') {  // +
              antibody1 = 'IgM';
            }
          }
        } else {
          if (this.conditionForm.value.ahg1 !== '0') {
            if (this.conditionForm.value.ccc1 === '-1') {
              antibody1 = 'IgM, TgG';
            }
          } else {
            antibody1 = 'IgM';
          }
        }
      }
    }


    let antibody2 = 'ไม่สามารถระบุชนิด alloantibody ได้';
    if (this.conditionForm.value.ccc2 === '0') {
      antibody2 = 'ทำการทดลองใหม่';
    } else if (this.conditionForm.value.rt2 === '0' && this.conditionForm.value.c2 === '0' || this.conditionForm.value.ahg2 === '0') {
      antibody2 = 'ไม่พบ alloantibody';
    } else {
      if (this.conditionForm.value.rt2 !== '0') {
        if (this.conditionForm.value.c2 !== '0') {
          if (this.conditionForm.value.ahg2 !== '0') {
            if (this.conditionForm.value.ccc2 === '-1') {
              antibody2 = 'IgM, TgG';
            }
          } else {
            if (this.conditionForm.value.ccc2 !== '-1' && this.conditionForm.value.ccc2 !== '0') {  // +
              antibody2 = 'IgM';
            }
          }
        } else {
          if (this.conditionForm.value.ahg2 !== '0') {
            if (this.conditionForm.value.ccc2 === '-1') {
              antibody2 = 'IgM, TgG';
            }
          } else {
            antibody2 = 'IgM';
          }
        }
      }
    }
    // this.conditionForm.value.groupAbo = this.decisionService.analyzeAboTest(this.conditionForm.value);
    this.conditionForm.value.status = 'ok';
    this.conditionForm.value.dateTimeNow = this.getDateTime();
    this.conditionForm.value.antibody1 = antibody1 ;
    this.conditionForm.value.antibody2 = antibody2;
    const newRef = this.patientService.createAntibodyTest(this.conditionForm.value, id);

    this.resultForm.value.idAntibody = newRef.key;
    this.resultForm.value.resultAntibody1 = antibody1;
    this.resultForm.value.resultAntibody2 = antibody2;
    this.patientService.updateResult(this.resultForm.value, id, 'resultAntibody');

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
      this.patientService.pushFileToStorage_antibody(this.currentFileUpload, this.progress, this.patients[0].id, key, i);
    }
    this.allfileList = undefined;



  }

  loadPhoto() {
    this.temp = this.patientService.getFileUploads({ limitToLast: 10 });
  }

}
