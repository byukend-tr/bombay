import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { PatientService } from '../shared/patient.service';
import { SharingdataService } from '../shared/sharingdata.service';

import { Patient } from '../shared/patient';
import { FileUpload } from '../shared/file-upload';

import Swal from 'sweetalert2';

import { AuthService } from '../../auth/shared/auth.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent implements OnInit {

  resultAboForm: FormGroup;
  resultSalivaForm: FormGroup;


  patients: any;
  message: string;

  aboLists: Array<any>;
  aboLists_photo: any;

  antibodyLists: Array<any>;
  antibodyLists_photo: any;
  hasAntibody = true;

  salivaLists: Array<any>;
  salivaLists_photo: any;
  hasSaliva = true;

  privileage: string;
  profile: any = {};

  statusForm: FormGroup;


  a$: Subscription;

  constructor(private patientService: PatientService,
    private msg: SharingdataService,
    private router: Router,
    public auth: AuthService) {
    this.auth.getCurrentLoggedInOnInit(data => {
      this.profile = data;
      this.getPersonalnformation(this.profile);
    });
  }
  buildForm() {

    this.statusForm = new FormGroup({
      status: new FormControl()
    });
    this.resultAboForm = new FormGroup({
      idAbo: new FormControl(),
      resultAbo: new FormControl()
    });
    this.resultSalivaForm = new FormGroup({
      idSaliva: new FormControl(),
      resultSaliva: new FormControl()
    });
  }

  ngOnInit() {
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.buildForm();
      this.goToRoot(this.message);
      this.loadData();
      this.loadAbo();
      this.loadAntibody();
      this.loadSaliva();
    }
    );
  }
  getPersonalnformation(email: any) {
    this.auth.getUserProfile(email.email).subscribe(data => {
      this.privileage = data[0].privilege;
    });

  }
  goToRoot(message: string) {
    if (message === 'default message') {
      if (this.getPath() === '/test/detaillist') {
        this.router.navigate(['/test']);
      }
    }
  }
  getPath() {
    return this.router.url;
  }
  showData(Lists: any) {
    Lists.forEach(item => {
      for (const property in item) {
        if (item[property] > 0) {
          item[property] = item[property] + '+';
        } else if (item[property] === '0') {
          item[property] = 'Neg';
        } else if (item[property] < 0) {
          item[property] = '-';
        }
      }
    });
    // console.log('dataaa', Lists);
  }
  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      // console.log(this.patients);
    });
  }
  loadAbo() {
    this.a$ = this.patientService.detailTest(this.message, 'abo').subscribe(data => {

      this.aboLists = data;
      this.aboLists_photo = new Array<Patient>();

      this.patientService.photo(this.message, 'abo', data, (cb, i) => {
        this.aboLists_photo.push(cb);
      });
      this.showData(this.aboLists);
      this.a$.unsubscribe();
    });
  }
  loadAntibody() {
    this.patientService.detailTest(this.message, 'antibody').subscribe(data => {
      this.antibodyLists = data;
      this.antibodyLists_photo = new Array<Patient>();

      this.patientService.photo(this.message, 'antibody', data, (cb, i) => {
        this.antibodyLists_photo.push(cb);
      });
      if (data.length === 0) {
        this.hasAntibody = false;
      }
      this.showData(this.antibodyLists);
    });
  }
  loadSaliva() {
    this.patientService.detailTest(this.message, 'saliva').subscribe(data => {

      this.salivaLists = data;
      this.salivaLists_photo = new Array<Patient>();

      this.patientService.photo(this.message, 'saliva', data, (cb, i) => {
        this.salivaLists_photo.push(cb);
      });
      if (data.length === 0) {
        this.hasSaliva = false;
      }
      this.showData(this.salivaLists);
    });
  }
  deleteAbo(id: string) {
    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการลบการทดสอบนี้ใช่หรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการลบ',
      cancelButtonText: 'ไม่ ต้องการลบ'
    }).then((result) => {
      if (result.value) {
        console.log('deleteAbo' + id);
        this.statusForm.value.status = 'delete';
        this.patientService.deleteAboTest(this.statusForm.value, this.message, id);

        // const idAbo = this.patientService.searchResult('resultAbo', this.message);
        // if (idAbo[0].idAbo === id) {
        //   // update result of abo
        //   const abo = this.patientService.detailTest(this.message, 'abo');
        //   this.resultAboForm.value.idAbo = abo[length - 1].key;
        //   this.resultAboForm.value.resultAbo = abo[length - 1].groupAbo;
        //   this.patientService.updateResult(this.resultAboForm.value, this.message, 'resultAbo');
        //   // update result of saliva
        //   const idSaliva = this.patientService.searchResult('resultSaliva', this.message);
        //   this.resultSalivaForm.value.idSaliva = idSaliva[0].key;
        //   this.resultSalivaForm.value.resultSaliva = idSaliva[0].groupSaliva;
        //   this.patientService.updateResult(this.resultSalivaForm.value, this.message, 'resultSaliva');
        // // update result
        // }
        Swal(
          'ลบการทดสอบเรียบร้อย!',
          '',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้ลบการทดสอบ',
          'error'
        );
      }
    });
  }
  deleteSaliva(id: string) {
    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการลบการทดสอบนี้ใช่หรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการลบ',
      cancelButtonText: 'ไม่ ต้องการลบ'
    }).then((result) => {
      if (result.value) {
        this.statusForm.value.status = 'delete';
        this.patientService.deleteSalivaTest(this.statusForm.value, this.message, id);
        Swal(
          'ลบการทดสอบเรียบร้อย!',
          '',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้ลบการทดสอบ',
          'error'
        );
      }
    });
  }
  deleteAntibody(id: string) {

    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการลบการทดสอบนี้ใช่หรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการลบ',
      cancelButtonText: 'ไม่ ต้องการลบ'
    }).then((result) => {
      if (result.value) {
        this.statusForm.value.status = 'delete';
        this.patientService.deleteAntibodyTest(this.statusForm.value, this.message, id);
        Swal(
          'ลบการทดสอบเรียบร้อย!',
          '',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้ลบการทดสอบ',
          'error'
        );
      }
    });
  }
}
