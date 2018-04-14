import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { PatientService } from '../shared/patient.service';
import { Observable } from 'rxjs/Observable';
import { SharingdataService } from '../shared/sharingdata.service';

@Component({
  selector: 'app-searchtest',
  templateUrl: './searchtest.component.html',
  styleUrls: ['./searchtest.component.css']
})
export class SearchtestComponent implements OnInit {

  conditionForm: FormGroup;

  isFound = false;

  patients: any;

  message: string;

  @Output() messageEvent = new EventEmitter<string>(); // use for sharing msg service

  constructor(private patientService: PatientService,
    private formBuilder: FormBuilder,
    private router: Router,
    private msg: SharingdataService
  ) { }

  ngOnInit() {
    this.buildForm();
    const isFound = false;
    // this.query();
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl()
    });
  }

  query() {
    console.log('queryyy');
    this.patientService.query().subscribe(data => {
      this.patients = data;
      if (data.length !== 0) { this.isFound = true; }
      console.log(this.patients);
    });


  }

  search() {
    if (this.conditionForm.value.id === '00000') {
      this.isFound = false;
    } else {
      this.query();
    }


  }
  viewDetail(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/test/detail']);

  }
  phenotype(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/test/phenotype']);
  }
  deletePatient(id: string) {
    console.log('delete' + id);

    //  ********************************************************************
  }

  newMessage() {
    this.msg.changeMessage(this.message);
  }


}
