import { Component, OnInit } from '@angular/core';

import { MutationDetectionService } from './../shared/mutation-detection.service'

@Component({
  selector: 'app-genotype-home',
  templateUrl: './genotype-home.component.html',
  styleUrls: ['./genotype-home.component.css']
})
export class GenotypeHomeComponent implements OnInit {

  constructor(private mutation: MutationDetectionService) { 
    this.display()
  }
  
  ngOnInit() {
  }
  display(){
    console.log('display OK')
    this.mutation.getValue()
  }

}
