import { Component, OnInit } from '@angular/core';
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

  form: FormGroup;

  constructor(private decisiontree: DecisiontreeService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadData();
  }

  trainNewModel(event) {
    this.decisiontree.trainModel();
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
    this.decisiontree.queryAllCondition().subscribe(data => {
      this.rule = data;
      console.log(this.rule);

      this.rule[0].AntiA = this.rule[0].AntiA + '+';
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
    });
  }

  checkAll() {
    if (this.conditionList.length === 0) {
      this.rule.forEach(item => {
        this.conditionList.push(item.key);
      });
    } else {
      this.conditionList = [];
    }
    console.log(this.conditionList);
  }

  checkIfAllSelected(condition) {
    // console.log("checked: "+condition.key);

    if (!this.conditionList.some(x => x === condition.key)) {
      this.conditionList.push(condition.key);
    } else {
      this.conditionList = this.conditionList.filter(item => item !== condition.key);
    }
    console.log(this.conditionList);
  }
}
