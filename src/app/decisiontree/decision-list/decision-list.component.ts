import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { DecisiontreeService } from '../shared/decisiontree.service';
import { Observable } from 'rxjs/Observable';

import Swal from 'sweetalert2';

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
    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'ต้องการสร้างต้นไม้การตัดสินใจใหม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการสร้าง',
      cancelButtonText: 'ไม่ ต้องการสร้าง'
    }).then((result) => {
      if (result.value) {
        this.decisiontreeService.trainModel();

        Swal(
          'สร้างต้นไม้การตัดสินใจใหม่เรียบร้อยแล้ว!', '',
          'success'
        );
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้สร้างต้นไม้การตัดสินใจใหม่',
          'error'
        );
      }
    });
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
    console.log(abo + saliva);
    if (abo === 'null' && saliva === 'null') { /*first load*/
      this.isFound = false;
    } else {
      if (abo === 'all' && saliva === 'all') {
        queryCondition = this.decisiontreeService.queryAllCondition();
      } else if (abo === 'all' && saliva === 'null') {
        queryCondition = this.decisiontreeService.queryAllCondition();
      } else if (abo === 'null' && saliva === 'all') {
        queryCondition = this.decisiontreeService.queryAllCondition();
      } else if (abo === 'all' || abo === 'null') {
        queryCondition = this.decisiontreeService.querySalivaCondition(saliva);
      } else if (saliva === 'all' || saliva === 'null') {
        queryCondition = this.decisiontreeService.queryAboCondition(abo);
      } else {
        queryCondition = this.decisiontreeService.queryTwoCondition(abo); /* not finished*/
        // this.filterData(queryCondition, saliva);
      }
      if (queryCondition !== []) {
        this.loadData2(queryCondition, saliva);
      }



    }

  }
  // filterData(queryCondition, saliva) {
  //   queryCondition.subscribe(data => {
  //     this.rule = data;
  //     // console.log(this.rule);
  //     if (this.rule != null) {
  //       // filter
  //       for (let i = 0; i < this.rule.length; i++) {
  //         if (this.rule[i].groupSaliva !== saliva) {
  //           this.rule.splice(i, 1);
  //           i -= 1;
  //         }
  //       } // end filter
  //     }
  //   });
  //   this.loadData2();
  // }

  // loadData2() {

  //   this.rule.forEach(item => {
  //     for (const property in item) {
  //       // console.log(item[property])
  //       if (item[property] > 0) {
  //         item[property] = item[property] + '+';
  //       } else if (item[property] === '0') {
  //         item[property] = 'Neg';
  //       } else if (item[property] < 0) {
  //         item[property] = '-';
  //       }
  //     }
  //   });
  //   if (this.rule != null) {
  //     this.isFound = true;
  //   } else {
  //     this.isFound = false;
  //   }

  // }

  loadData2(queryCondition, saliva) {
    console.log('okko');

    queryCondition.subscribe(data => {
      this.rule = data;
      console.log(this.rule);

      // if (this.rule !== null && (saliva !== 'null' && saliva !== 'all') && this.rule !== [] && this.rule !== undefined) {
      if (this.rule !== null) {
        // console.log('not null 180');

        // filter
        if (saliva !== 'null' && saliva !== 'all') {
          for (let i = 0; i < this.rule.length; i++) {
            if (this.rule[i].groupSaliva !== saliva) {
              this.rule.splice(i, 1);
              i -= 1;
            }
          } // end filter
        }
        if (this.rule.length !== 0) {
          this.isFound = true;
        } else {
          this.isFound = false;
        }
        // console.log(this.rule.value);

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

      }
    });
  }

  // loadData2(queryCondition, saliva) {
  //       queryCondition.subscribe(data => {
  //         this.rule = data;
  //         // console.log(this.rule);
  //         if (this.rule != null) {
  //           // filter
  //           for (let i = 0; i < this.rule.length; i++) {
  //             if (this.rule[i].groupSaliva !== saliva) {
  //               this.rule.splice(i, 1);
  //               i -= 1;
  //             }
  //           } // end filter
  //           this.rule.forEach(item => {
  //             for (const property in item) {
  //               // console.log(item[property])
  //               if (item[property] > 0) {
  //                 item[property] = item[property] + '+';
  //               } else if (item[property] === '0') {
  //                 item[property] = 'Neg';
  //               } else if (item[property] < 0) {
  //                 item[property] = '-';
  //               }
  //             }
  //           });
  //           if (this.rule != null) {
  //             this.isFound = true;
  //           }
  //         } else {
  //           this.isFound = false;
  //         }
  //       });
  //     }
}
