import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from "../../auth/shared/auth.service";
import { DecisiontreeService } from "../shared/decisiontree.service";
import { Decisiontree } from "./../shared/decisiontree";


@Component({
  selector: 'app-decision-form',
  templateUrl: './decision-form.component.html',
  styleUrls: ['./decision-form.component.css']
})
export class DecisionFormComponent implements OnInit {

  addCondition: boolean = false
  conditionForm: FormGroup

  constructor(private auth: AuthService, private decisiontreeService: DecisiontreeService) {
    auth.getNotCurrentLoggedIn();
    
  }

  ngOnInit() {
    this.buildForm()

  }
  ngAfterContentInit() {

  }
  ngAfterViewInit() {

  }
  selectDefaultCondition(this) {
    // console.log("n")
    // var a = document.getElementById("Anti-A5")
    console.log(this)

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
    let checkBox = document.getElementById('saliva')
    if (!this.addCondition && checkBox.style.display == 'none') { // this.addCondition = true
      checkBox.style.display = 'block'
    } else {
      checkBox.style.display = 'none'
    }
  }
  createCondition(): void {//รับข้อมูล
    // console.log('Ocell'+this.userForm.value.Ocell)
    // console.log(this.userForm.value.group)

    this.decisiontreeService.createDecisionTree(this.conditionForm.value)
  }
}
