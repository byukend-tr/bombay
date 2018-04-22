import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

declare var $: any; // define type of $ for use jquery
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  address: { district: string, amphoe: string, province: string, zipcode: number };


  constructor() { }

  // การใช้ปลั๊กอิน jquery ต้องเอาไว้ใน ngOnInit หรือ ngAfterInit
  ngOnInit() {
    // โหมดปกติ
    $.Thailand({
      $district: $('#district'), // input ของตำบล
      $amphoe: $('#amphoe'), // input ของอำเภอ
      $province: $('#province'), // input ของจังหวัด
      $zipcode: $('#zipcode') // input ของรหัสไปรษณีย์
    });

  }

}
