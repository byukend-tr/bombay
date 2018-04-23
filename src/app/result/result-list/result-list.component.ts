import { Component, OnInit } from '@angular/core';

import { AccordionModule } from 'primeng/accordion'; // accordion and accordion tab
// import {MenuItem} from 'primeng/api';                 //api
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit {

  data: any;

  constructor() {
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };
  }

  ngOnInit() {
    // angular.module('app', ['chart.js']).controller('PolarAreaCtrl', function ($scope) {
    //   $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'Tele Sales', 'Corporate Sales'];
    //   $scope.data = [300, 500, 100, 40, 120];
    // });

  }

}
