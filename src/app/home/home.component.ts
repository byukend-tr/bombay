import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


import { HomeService } from './shared/home.service';

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
declare var $: any; // define type of $ for use jquery



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  address: { district: string, amphoe: string, province: string, zipcode: number };

  locationImport: string[];
  location$: Subscription;

  locationForm: FormGroup;

  constructor(private homeService: HomeService,
    private httpService: HttpClient) { }

  // การใช้ปลั๊กอิน jquery ต้องเอาไว้ใน ngOnInit หรือ ngAfterInit
  ngOnInit() {
    // this.addressThailandHandler();
    this.buildForm();
  }
  buildForm() {
    this.locationForm = new FormGroup({
      // locationCode: new FormControl(),
      province: new FormControl(),
      subDistrict: new FormControl(),
      district: new FormControl(),
      zipcode: new FormControl(),
      note: new FormControl(),
    });
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
  importJson(event) {


    this.location$ = this.httpService.get('./../assets/location.json').subscribe(
      data => {
        this.locationImport = data as string[];	 // FILL THE ARRAY WITH DATA.
        // console.log(this.trainingImport);
        this.setJsonToFirebase(this.locationImport);
        this.location$.unsubscribe();
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }
  setJsonToFirebase(data: Array<any>) {

    for (let i = 0; i < data.length; i++) {

      // this.locationForm.value.locationCode = data[i].locationCode;
      const locationCode = data[i].LocationCode;
      this.locationForm.value.province = data[i].province;
      this.locationForm.value.subDistrict = data[i].subDistrict;
      this.locationForm.value.district = data[i].district;
      this.locationForm.value.zipcode = data[i].zipcode;
      this.locationForm.value.note = data[i].note;
      // console.log(data[i]);

      this.homeService.createLocation(this.locationForm.value, locationCode);
    }
  }
  // selectDistrict() {
  //   console.log('ddddd');

  // }
}
