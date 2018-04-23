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
  isFind = Array<any>();
  patients: any;

  message: string;

  test: string;

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
      id: new FormControl('', [
        Validators.pattern('^(?=.*[0–9])(?=.*[a-zA-Z])([a-zA-Z0–9]+)$'),
        Validators.minLength(1),
        Validators.maxLength(13)
      ]),
      fName: new FormControl(),
      lName: new FormControl(),
    });
  }

  query() {
    // console.log('queryyy');
    this.patientService.query().subscribe(data => {
      this.patients = data;
      if (data.length !== 0) { this.isFound = true; }
    });


  }

  search() {
    if (this.conditionForm.value.id) {
      // console.log('idididi');
      this.patientService.detailPatient(this.conditionForm.value.id).subscribe(data => {
        this.showPatient(data);
      });
    } else if (this.conditionForm.value.fName) {
      this.patientService.namePatient(this.conditionForm.value.fName, 'fName').subscribe(data => {
        this.showPatient(data);
      });
    } else if (this.conditionForm.value.lName) {
      this.patientService.namePatient(this.conditionForm.value.lName, 'lName').subscribe(data => {
        this.showPatient(data);
      });
    } else {
      this.query();
      // this.showAntibody();
    }


  }
  showPatient(data: Array<any>) {
    this.isFind = data;
    // console.log(this.isFind);
    if (this.isFind.length === 0) {
      this.isFound = false;
      // console.log(this.isFound);

    } else {
      this.patients = data;
      this.isFound = true;
      // console.log(this.isFound);
    }
  }
  viewDetail(id: string) {
    this.message = id;
    this.newMessage();
    this.router.navigate(['/test/detail']);

  }
  phenotype(id: string, test: string) {
    this.message = id;
    this.test = test;
    this.newMessage();
    this.router.navigate(['/test/phenotype']);
  }
  deletePatient(id: string) {
    // console.log('delete' + id);

    //  ********************************************************************
  }
  createPatient() {
    this.message = this.conditionForm.value.id;
    this.newMessage();
  }
  newMessage() {
    this.msg.changeMessage(this.message);
    this.msg.testName(this.test);
  }
  showAntibody() {
    this.message = '1509954621331';
    this.patientService.antibody(this.message);

    // if (data.length !== 0) { this.isFound = true; }

  }

}
