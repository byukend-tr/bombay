import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


import { SharingdataService } from '../shared/sharingdata.service';
import { PatientService } from '../shared/patient.service';
import { LoginComponent } from '../../auth/login/login.component';

import { Relatives } from '../shared/relatives';

@Component({
  selector: 'app-relatives-form',
  templateUrl: './relatives-form.component.html',
  styleUrls: ['./relatives-form.component.css']
})
export class RelativesFormComponent implements OnInit {

  patients: any;
  relatives: any;
  findRelatives: any;
  message: string;
  isFound = false;

  conditionForm: FormGroup;
  relativeForm: FormGroup;

  constructor(private patientService: PatientService,
    private msg: SharingdataService) { }

  ngOnInit() {
    this.buildForm();
    this.buildForm2();
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.loadData();
      this.loadRelative();
      // console.log('aaaa' + message);
    }
    );
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl(),
      fName: new FormControl(),
      lName: new FormControl()
    });

  }
  buildForm2() {
    // this.relativeForm = new FormGroup({
    //   patientId: new FormGroup({
    //     relativeId: new FormGroup({
    //       relativeName: new FormControl()
    //     })
    //   })

    // });
    this.relativeForm = new FormGroup({
      relativeName: new FormControl()
    });
  }

  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
    });
  }
  loadRelative() {

    this.patientService.relativesOfPatient(this.message).subscribe(data => {
      this.relatives = new Array<Relatives>();

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
  searchRelatives() {
    this.patientService.queryRelatives(this.conditionForm.value.fName).subscribe(data => {
      this.findRelatives = data;
      if (this.relatives != null) {
        this.isFound = true;
      } else {
        this.isFound = false;
      }
      console.log(this.isFound);
      // this.buildForm2();
    });
  }
  addRelatives(relativeId: string) {
    // this.relativeForm.value.patientId = this.message;
    // this.relativeForm.value.relativeId = relativeId;
    console.log(this.relativeForm.value.relativeId);
    this.patientService.addRelatives(this.relativeForm.value, this.message, relativeId);

  }
  deleteRelative(id: string) {
    this.patientService.deleteRelative(this.message, id);
  }

}
