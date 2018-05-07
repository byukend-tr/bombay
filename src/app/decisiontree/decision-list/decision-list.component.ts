import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { DecisiontreeService } from '../shared/decisiontree.service';
import { Observable } from 'rxjs/Observable';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-decision-list',
  templateUrl: './decision-list.component.html',
  styleUrls: ['./decision-list.component.css']
})
export class DecisionListComponent implements OnInit {
  rule: any;
  ruleList = Array<any>();
  conditionList: any = [];
  searchList: any = [];
  isFound = false;

  selectForm: FormGroup;
  searchConditionForm: FormGroup;

  a$: Subscription;
  b$: Subscription;
  c$: Subscription;

  constructor(private decisiontreeService: DecisiontreeService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    // this.loadData();

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
      text: 'ต้องการทำการเรียนรู้',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการเรียนรู้',
      cancelButtonText: 'ไม่ ต้องการเรียนรู้'
    }).then((result) => {
      if (result.value) {
        this.decisiontreeService.trainModel();

        Swal(
          'ทำการเรียนรู้เรียบร้อยแล้ว!', '',
          'success'
        );
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้ทำการเรียนรู้',
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
        if (item.status === 'addition') {
          all_or_one.push(item.key);
        }
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
    if (this.conditionList.length > 0) {
      const selectedAll = <HTMLInputElement[]><any>document.getElementsByName('selectAll');
      Swal({
        title: 'คุณแน่ใจใช่หรือไม่?',
        text: 'ต้องการลบข้อมูลการเรียนรู้ทั้งหมด ' + this.conditionList.length + ' ข้อมูล',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่ ต้องการลบ',
        cancelButtonText: 'ไม่ ต้องการลบ'
      }).then((result) => {
        if (result.value) {
          this.decisiontreeService.removeCondition(this.conditionList);

          Swal(
            'ทำการลบข้อมูลการเรียนรู้เรียบร้อยแล้ว!', '',
            'success'
          );
          selectedAll[0].checked = false;
          this.conditionList = [];
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal(
            'ยกเลิก!',
            'ยังไม่ได้ลบข้อมูลการเรียนรู้',
            'error'
          );
        }
      });
    } else if (this.conditionList.length === 0) {
      Swal(
        'ผิดพลาด!',
        'ลบข้อมูลไม่ได้ เนื่องจากไม่มีข้อมูลที่เลือก',
        'error'
      );
    }
  }
  checkCondition() {
    if (this.searchConditionForm.value.groupAbo) {
      this.searchList.push('abo');
    } if (this.searchConditionForm.value.groupSaliva) {
      this.searchList.push('saliva');
    }
    console.log(this.searchList);

    if (this.searchList.length === 0) {
      Swal('เกิดความผิดพลาด!', 'กรุณากรอกข้อมูลการค้นหา', 'error');
      this.searchList = [];
    } else {
      this.searchCondition();
    }
  }
  searchCondition() {
    console.log(this.searchList);
    if (this.searchList.length > 0) {       // first query
      console.log(this.searchList[0]);
      if (this.searchList[0] === 'abo') {
        if (this.searchConditionForm.value.groupAbo === 'all') {
          this.decisiontreeService.queryAllCondition().subscribe(data => {
            this.ruleList = data;
            this.displaySearch();

          });
        } else {
          this.decisiontreeService.queryAboCondition(this.searchConditionForm.value.groupAbo).subscribe(data => {
            this.ruleList = data;
            this.displaySearch();
          });
        }
      } else if (this.searchList[0] === 'saliva') {
        if (this.searchConditionForm.value.groupSaliva === 'all') {
          this.decisiontreeService.queryAllCondition().subscribe(data => {
            this.ruleList = data;
            this.displaySearch();
          });
        } else {
          this.decisiontreeService.querySalivaCondition(this.searchConditionForm.value.groupSaliva).subscribe(data => {
            this.ruleList = data;
            this.displaySearch();
          });
        }
      }
      this.searchList.splice(0, 1);
    }    // end first query

  }
  displaySearch() {
    if (this.searchList.length > 0 && this.ruleList.length > 0) {
      // if (this.searchCondition[0] === 'saliva') {
      console.log(this.searchConditionForm.value.groupSaliva);

      if (this.searchConditionForm.value.groupSaliva !== 'all') {
        this.filterSaliva();
      }
      this.showData();
      // }
    } else {
      this.showData();
    }
  }

  filterSaliva() {
    // filter
    console.log(this.searchConditionForm.value.groupSaliva);

    for (let i = 0; i < this.ruleList.length; i++) {
      if (this.ruleList[i].groupSaliva !== this.searchConditionForm.value.groupSaliva) {
        this.ruleList.splice(i, 1);
        i -= 1;
      }
    } // end filter
  }
  showData() {
    if (this.ruleList.length > 0) {
      console.log(this.ruleList.length);
      this.rule = this.ruleList;
      this.rule.forEach(item => {
        for (const property in item) {
          // console.log(item[property]);
          if (item[property] > 0) {
            item[property] = item[property] + '+';
          } else if (item[property] === '0') {
            item[property] = 'Neg';
          } else if (item[property] < 0) {
            item[property] = '-';
          }
        }
        this.isFound = true;
      });
    } else {
      this.isFound = false;
    }
    console.log(this.isFound);


    this.buildForm();
    this.searchList = [];
  }


  loadData2(queryCondition, saliva) {
    console.log('okko');

    queryCondition.subscribe(data => {
      this.rule = data;
      // console.log(this.rule);

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
