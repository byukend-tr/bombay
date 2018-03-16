import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { DecisiontreeService } from '../shared/decisiontree.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-decision-list',
  templateUrl: './decision-list.component.html',
  styleUrls: ['./decision-list.component.css']
})
export class DecisionListComponent implements OnInit {
  rule: any;
  conditionList: any = [];
  isFound = false;

  selectForm: FormGroup;
  searchConditionForm: FormGroup;

  constructor(private decisiontreeService: DecisiontreeService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.loadData();

  }

  buildForm() {
    this.selectForm = new FormGroup({
      checkAllSelect: new FormControl()
    });
    this.searchConditionForm = new FormGroup({
      groupAbo: new FormControl(),
      groupSaliva: new FormControl()
    });
  }

  trainNewModel(event) {
    this.decisiontreeService.trainModel();
  }
  // checkAll(ev) {
  //   const checkBox = document.getElementById('radio-state1');
  //   for (let i = 0; i < this.rule.length; i++) {
  //     if (ev.target.checked) {
  //       console.log('True');
  //       this.rule[i].selected = true;
  //     } else {
  //       console.log('False');
  //       this.rule[i].selected = false;
  //     }
  //   }
  // }

  // private loadData() {
  //   this.decisiontree.queryCondition('all', data => {
  //     this.rule = data;
  //     console.log(this.rule)
  //   });
  // }

  private loadData() {

    if (this.searchConditionForm.value.groupAbo === null && this.searchConditionForm.value.groupSaliva === null) { /*first load*/
      this.isFound = false;

    }
  }

  selectAll(e) {
    const checkbox = <HTMLInputElement[]><any>document.getElementsByName('checkbox');
    const all_or_one = [];
    if (e.target.checked === true) { // select all
      this.rule.forEach(item => { // push all item to new list
        all_or_one.push(item.key);
      });
      for (let i = 0; i < checkbox.length; i++) { // loop selected all item
        checkbox[i].checked = true;
      }
    } else { // select none
      for (let i = 0; i < checkbox.length; i++) { // loop deselected all item
        checkbox[i].checked = false;
      }
    }
    this.conditionList = all_or_one;
    // console.log(this.conditionList);
  }

  selectedUpdate(condition, e) {
    // console.log("checked: "+condition.key);
    const selectedAll = <HTMLInputElement[]><any>document.getElementsByName('selectAll');
    if (e.target.checked === false) {
      selectedAll[0].checked = false;
    }

    if (!this.conditionList.some(x => x === condition.key)) {
      this.conditionList.push(condition.key);
    } else {
      this.conditionList = this.conditionList.filter(item => item !== condition.key);
    }
    // console.log(this.conditionList);
  }
  removeCondition() {
    this.decisiontreeService.removeCondition(this.conditionList);
  }

  searchCondition() {
    let queryCondition;
    const abo = this.searchConditionForm.value.groupAbo;
    const saliva = this.searchConditionForm.value.groupSaliva;
    if (abo === null && saliva === null) { /*first load*/
      this.isFound = false;
    } else {
      if (abo === 'all' && saliva === 'all') {
        queryCondition = this.decisiontreeService.queryAllCondition();
      } else {
        queryCondition = this.decisiontreeService.queryAboCondition(abo); /* not finished*/
      }
      this.loadData2(queryCondition);
    }

  }
  loadData2(queryCondition) {
    queryCondition.subscribe(data => {
      this.rule = data;
      // console.log(this.rule);
      if (this.rule != null) {
        this.rule.forEach(item => {
          for (const property in item) {
            // console.log(item[property])
            if (item[property] > 0) {
              item[property] = item[property] + '+';
            } else if (item[property] === '0') {
              item[property] = 'Neg';
            } else if (item[property] < 0) {
              item[property] = '-';
            }
          }
        });
        this.isFound = true;
      } else {
        this.isFound = false;
      }
    });
  }
}
