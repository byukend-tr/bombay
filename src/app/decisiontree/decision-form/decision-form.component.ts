import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../auth/shared/auth.service';
import { DecisiontreeService } from '../shared/decisiontree.service';
import { Decisiontree } from './../shared/decisiontree';


@Component({
  selector: 'app-decision-form',
  templateUrl: './decision-form.component.html',
  styleUrls: ['./decision-form.component.css']
})
export class DecisionFormComponent implements OnInit {

  addCondition = false;
  conditionForm: FormGroup;

  constructor(private auth: AuthService, private decisiontreeService: DecisiontreeService) {
    auth.getNotCurrentLoggedIn();
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      AntiA: new FormControl(),
      AntiB: new FormControl(),
      AntiAB: new FormControl(),
      Acell: new FormControl(),
      Bcell: new FormControl(),
      Ocell: new FormControl(),
      group: new FormControl(),
    });
  }

  checkboxChange() {
    const checkBox = document.getElementById('saliva');
    // tslint:disable-next-line:triple-equals
    if (!this.addCondition && checkBox.style.display == 'none') { // this.addCondition = true
      checkBox.style.display = 'block';
    } else {
      checkBox.style.display = 'none';
    }
  }

  createCondition(): void { // รับข้อมูล
    this.decisiontreeService.createDecisionTree(this.conditionForm.value);
  }
}
