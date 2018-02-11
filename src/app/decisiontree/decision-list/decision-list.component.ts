import { Component, OnInit } from '@angular/core';
import { DecisiontreeService } from '../shared/decisiontree.service';

@Component({
  selector: 'app-decision-list',
  templateUrl: './decision-list.component.html',
  styleUrls: ['./decision-list.component.css']
})
export class DecisionListComponent implements OnInit {
  rule: any;

  constructor(private decisiontree: DecisiontreeService) {
    this.decisiontree.queryCondition('all', data => {
      this.rule = data;
    });
  }

  ngOnInit() {
  }
  trainNewModel(event) {
    console.log('click newmodeltrain');
    this.decisiontree.trainModel();
  }
}
