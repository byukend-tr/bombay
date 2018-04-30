import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { PatientService } from '../shared/patient.service';
import { SharingdataService } from '../shared/sharingdata.service';
import { Relatives } from '../shared/relatives';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  patients: any;
  relatives: Array<Relatives>;
  message: string;
  currentURL = '';
  test: string;
  public age: any;

  a$: Subscription;

  constructor(private patientService: PatientService,
    private msg: SharingdataService,
    private router: Router) { }

  ngOnInit() {
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.goToRoot(this.message);
      this.loadData();
      this.loadRelative();
      this.currentURL = this.getPath();
    }
    );
  }
  goToRoot(message: string) {
    if (message === 'default message') {
      if (this.getPath() === '/test/detail') {
        this.router.navigate(['/test']);
      } else if (this.getPath() === '/blood/detail') {
        this.router.navigate(['/blood']);
      }
    }
  }
  getPath() {
    return this.router.url;
  }
  loadData() {
    this.a$ = this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      // console.log(this.patients);

      this.setAge(this.patients[0].birthDay);
      this.a$.unsubscribe();
    });
  }
  phenotype(id: string, test: string) {
    this.message = id;
    this.test = test;
    this.newMessage();
    this.router.navigate(['/test/phenotype']);
  }
  loadRelative() {
    this.relatives = new Array<Relatives>();
    this.patientService.relativesOfPatient(this.message).subscribe(data => {
      this.patientService.loaddetailPatient(data, (cb, i) => {
        // console.log('dddddddddd', cb);
        this.relatives.push({
          patientId: cb[0].id,
          fName: cb[0].fName,
          lName: cb[0].lName,
          relativeId: data[i].key,
          relativeName: data[i].relativeName,
          group: cb[0].result.result
        });


      });
    });
    // console.log(this.relatives);
  }
  editRelatives(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/test/relatives']);

  }
  viewDetail(id: string) {
    this.message = id;
    this.newMessage();
    if (this.getPath() === '/test/detail') {
      this.router.navigate(['/test/detail']);
    } else if (this.getPath() === '/blood/detail') {
      this.router.navigate(['/blood/detail']);
    }


  }

  newMessage() {
    this.msg.changeMessage(this.message);
    this.msg.testName(this.test);
  }
  setAge(birthDay: Date) {
    console.log(birthDay);

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth();
    const dd = new Date().getDate();
    let birthday;
    // console.log(typeof(birthday));

    // if (e === null) {
    birthday = this.patients[0].birthDay.split('-');
    // } else {
    // birthday = e.target.value.split('-');
    // }

    // const yearBirth = new Date(birthday[0]).getFullYear();
    // const monthBirth = new Date(birthday[1]).getMonth();
    // const dayBirth = new Date(birthday[2]).getDate();
    const yearBirth = birthday[0];
    const monthBirth = birthday[1];
    const dayBirth = birthday[2];
    this.age = yy - yearBirth;
    // console.log(this.age);
    // console.log(yy, yearBirth);
    // console.log(mm, monthBirth);
    // console.log(dd, dayBirth);

    if (mm < monthBirth) {
      this.age -= 1;
    } else if (mm === monthBirth) {
      if (dd < dayBirth) {
        this.age -= 1;
      }
    }

    // this.conditionForm.value.age = this.age;
  }
}
