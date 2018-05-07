import { Component, OnInit, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';

import { Router } from '@angular/router';
import { DecisiontreeService } from '../../decisiontree/shared/decisiontree.service';
import { SharingdataService } from '../shared/sharingdata.service';
import { FileUpload } from '../shared/file-upload';
// Gallery
// import { GalleryImage } from 'models/galleryImage.model';
import { Observable } from 'rxjs/Observable';
import Swal from 'sweetalert2';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-phenotype-saliva-form',
  templateUrl: './phenotype-saliva-form.component.html',
  styleUrls: ['./phenotype-saliva-form.component.css']
})
export class PhenotypeSalivaFormComponent implements OnInit {

  a$: Subscription;
  b$: Subscription;
  private _subscription: Subscription;

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
      // this.loadPhoto();
      this.conditionForm.value.dateTimeNow = this.getDateTime();
      console.log(this.conditionForm.value.dateTimeNow);

    });

  }
  loadData() {
    this.b$ = this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      this.setResultBlood();
      this.b$.unsubscribe();
    });
  }
  newMessage() {
    this.msg.changeMessage(this.message);
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      secretor: new FormControl(),
      nonSecretor: new FormControl(),
      nss: new FormControl(),
      TestAntiA: new FormControl(),
      TestAntiB: new FormControl(),
      TestAntiH: new FormControl(),
      groupSaliva: new FormControl(),
      Note: new FormControl(),
      dateTimeNow: new FormControl(),

      status: new FormControl(),

      AntiA: new FormControl(),
      AntiB: new FormControl(),
      AntiAB: new FormControl(),
      Acell: new FormControl(),
      Bcell: new FormControl(),
      Ocell: new FormControl(),
      groupAbo: new FormControl()
    });
    this.resultForm = new FormGroup({
      idSaliva: new FormControl(),
      resultSaliva: new FormControl()
    });
  }

  validationInput() {
    const keyTest = this.createTest();
    if (this.allfileList) {
      this.upload(keyTest);
    }
    this.setResultBlood();
  }
  setValue() {
    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'ต้องการเพิ่มการทดสอบ"การตรวจน้ำลาย" ของคนไข้ ' +
        this.patients[0].fName + ' ' +
        this.patients[0].lName + ' ใช่หรือไม่   ' + 'ผลการวิเคราะห์หมู่เลือด คือ ' + this.conditionForm.value.groupSaliva,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการเพิ่ม',
      cancelButtonText: 'ไม่ ต้องการเพิ่ม'

    }).then((result) => {
      if (result.value) {
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
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
  validationForm() {
    // tslint:disable-next-line:max-line-length
    if (this.conditionForm.value.secretor && this.conditionForm.value.nonSecretor && this.conditionForm.value.nss && this.conditionForm.value.TestAntiA && this.conditionForm.value.TestAntiB && this.conditionForm.value.TestAntiH) {


      console.log(this.conditionForm.value.groupSaliva);
      this._subscription = this.patientService.isFoundPatient(this.message).subscribe(data => {
        // const aboObj = data;
        const idAbo = data[0].resultAbo.idAbo;
        // console.log(idAbo);

        console.log(data[0].abo[idAbo]);

        this.conditionForm.value.AntiA = data[0].abo[idAbo].AntiA;
        this.conditionForm.value.AntiB = data[0].abo[idAbo].AntiB;
        this.conditionForm.value.AntiAB = data[0].abo[idAbo].AntiAB;
        this.conditionForm.value.Acell = data[0].abo[idAbo].Acell;
        this.conditionForm.value.Bcell = data[0].abo[idAbo].Bcell;
        this.conditionForm.value.Ocell = data[0].abo[idAbo].Ocell;
        this.conditionForm.value.groupAbo = data[0].abo[idAbo].groupAbo;
        // console.log(this.conditionForm.value.secretor);
        // console.log(this.conditionForm.value.nonSecretor);
        // console.log(this.conditionForm.value.nss);
        // console.log(this.conditionForm.value.TestAntiA);
        // console.log(this.conditionForm.value.TestAntiB);
        // console.log(this.conditionForm.value.TestAntiH);
        this.conditionForm.value.groupSaliva = this.decisionService.analyzeSalivaTest(this.conditionForm.value);
        this.setValue();
      });

    } else {
      Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
    }

  }
  setResultBlood() {
    const id = this.patients[0].id;
    console.log(id);

    const detail = this.patientService.detailPatient(id);
    console.log(detail);

  }
  getDateTime() {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    const date = today.toLocaleDateString();
    return date + ' ' + time;
  }

  createTest() { // Input data
    const id = this.patients[0].id;


    this.conditionForm.value.dateTimeNow = this.getDateTime();
    this.conditionForm.value.groupSaliva = this.decisionService.analyzeSalivaTest(this.conditionForm.value);

    // this.aboResult = this.patientService.detailTest(id, 'resultAbo');
    this.conditionForm.value.status = 'ok';
    const newRef = this.patientService.createSalivaTest(this.conditionForm.value, id);

    this.resultForm.value.idSaliva = newRef.key;
    this.resultForm.value.resultSaliva = this.conditionForm.value.groupSaliva;
    this.patientService.updateResult(this.resultForm.value, id, 'resultSaliva');


    // **************************************************************-*/---------------------
    let blood;
    // tslint:disable-next-line:max-line-length
    if (this.conditionForm.value.groupSaliva === 'Secretor gr.A' && this.conditionForm.value.groupAbo === 'Group A with unexpected alloantibody') {
      blood = 'A para-Bombay';
      // tslint:disable-next-line:max-line-length
    } else if (this.conditionForm.value.groupSaliva === 'Secretor gr.B' && this.conditionForm.value.groupAbo === 'Group B with unexpected alloantibody') {
      blood = 'B para-Bombay';
      // tslint:disable-next-line:max-line-length
    } else if (this.conditionForm.value.groupSaliva === 'Secretor gr.AB' && this.conditionForm.value.groupAbo === 'Group AB with unexpected alloantibody') {
      blood = 'AB para-Bombay';
      // tslint:disable-next-line:max-line-length
    } else if (this.conditionForm.value.groupSaliva === 'Secretor gr.O' && this.conditionForm.value.groupAbo === 'Group O with unexpected alloantibody') {
      blood = 'O para-Bombay';
    } else {
      blood = 'ผิดพลาด';
    }
    this.patientService.updateBloodResult(blood, id);
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
      this.patientService.pushFileToStorage_saliva(this.currentFileUpload, this.progress, this.patients[0].id, key, i);
    }
    this.allfileList = undefined;



  }

  loadPhoto() {
    this.temp = this.patientService.getFileUploads({ limitToLast: 10 });
  }


}
