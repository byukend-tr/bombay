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

  constructor(private patientService: PatientService,
    private msg: SharingdataService,
    private router: Router) { }

  ngOnInit() {

    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.loadData();
      this.loadRelative();
    }
    );
  }


  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
    });
  }
  loadRelative() {
    this.relatives = new Array<Relatives>();
    this.patientService.relativesOfPatient(this.message).subscribe(data => {
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
  editRelatives(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/test/relatives']);

  }
  viewDetail(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/test/detail']);

  }

  newMessage() {
    this.msg.changeMessage(this.message);
  }
}
