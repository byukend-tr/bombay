import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { PatientService } from '../shared/patient.service';
import { SharingdataService } from '../shared/sharingdata.service';
import { Relatives } from '../shared/relatives';

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
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
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
}
