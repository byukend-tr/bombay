import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PatientService } from '../shared/patient.service';
import { SharingdataService } from '../shared/sharingdata.service';

@Component({
  selector: 'app-phenotype-home',
  templateUrl: './phenotype-home.component.html',
  styleUrls: ['./phenotype-home.component.css']
})
export class PhenotypeHomeComponent implements OnInit {

  patients: any;
  message: string;
  test: string;

  constructor(private patientService: PatientService,
    private msg: SharingdataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.msg.test.subscribe(test => {
        this.loadData();
        this.test = test;
        console.log(this.test);

      });
    }
    );
  }
  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      console.log(this.patients);

    });
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
