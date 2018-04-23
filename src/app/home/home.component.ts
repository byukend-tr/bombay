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
    this.addressThailandHandler();

  }
  public addressThailandHandler(): void {
    // โหมดปกติ
    $.Thailand({
      $district: $('#district'), // input ของตำบล
      $amphoe: $('#amphoe'), // input ของอำเภอ
      $province: $('#province'), // input ของจังหวัด
      $zipcode: $('#zipcode'), // input ของรหัสไปรษณีย์
    });


    // โหมดค้นหา
    $.Thailand({
      $search: $('#search'), // input ของช่องค้นหา
      onDataFill: function (data) { // callback เมื่อเกิดการ auto complete ขึ้น
        // console.log(data);
        this.address = data;
        console.log(this.address);
      }
    });

  }
}
