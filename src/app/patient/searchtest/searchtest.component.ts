import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { PatientService } from '../shared/patient.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-searchtest',
  templateUrl: './searchtest.component.html',
  styleUrls: ['./searchtest.component.css']
})
export class SearchtestComponent implements OnInit {

  conditionForm: FormGroup;


  rule: any;

  constructor(private patientService: PatientService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    const isFound = true;
    this.query();
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl()
    });
  }

  query() {
    console.log('queryyy');

    // this.patientService.query('all', data => {
    //   this.rule = data;
    // });
    // this.patientService.query.subscribe(data => {
    //   this.rule = data;
    // }
  }

  search() {
    console.log('search');
    console.log(this.conditionForm.value.id);
    if (this.conditionForm.value.id === '00000') {

    } else {
      this.query();
    }

  }


}
