import { Component, OnInit } from '@angular/core';

import { MutationDetectionService } from './../shared/mutation-detection.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-genotype-home',
  templateUrl: './genotype-home.component.html',
  styleUrls: ['./genotype-home.component.css']
})
export class GenotypeHomeComponent implements OnInit {
  edit: Array<any>;
  lcs: Array<any>;
  lcs_backtrack: Array<any>;
  histories = [
    'Latest', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  panelTime = new FormControl('Latest');
  patientID = '000000001';
  FUT1 = true;
  constructor(private mutation: MutationDetectionService) {
  }

  ngOnInit() {
    this.mutation.initService();
  }

}
