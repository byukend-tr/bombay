import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PatientService } from '../shared/patient.service';
import { SharingdataService } from '../shared/sharingdata.service';

import { Patient } from '../shared/patient';
import { FileUpload } from '../shared/file-upload';


@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent implements OnInit {

  patients: any;
  message: string;

  aboLists: Array<any>;
  aboLists_photo: any;

  antibodyLists: Array<any>;
  antibodyLists_photo: any;

  salivaLists: Array<any>;
  salivaLists_photo: any;


  constructor(private patientService: PatientService,
    private msg: SharingdataService,
    private router: Router) { }

  ngOnInit() {
    this.msg.currentMessage.subscribe(message => {
      this.message = message;
      this.goToRoot(this.message);
      this.loadData();
      this.loadAbo();
      this.loadAntibody();
      this.loadSaliva();
    }
    );
  }
  goToRoot(message: string) {
    if (message === 'default message') {
      if (this.getPath() === '/test/detaillist') {
        this.router.navigate(['/test']);
      }
    }
  }
  getPath() {
    return this.router.url;
  }
  showData(Lists: any) {
    Lists.forEach(item => {
      for (const property in item) {
        if (item[property] > 0) {
          item[property] = item[property] + '+';
        } else if (item[property] === '0') {
          item[property] = 'Neg';
        } else if (item[property] < 0) {
          item[property] = '-';
        }
      }
    });
    console.log('dataaa', Lists);
  }
  loadData() {
    this.patientService.detailPatient(this.message).subscribe(data => {
      this.patients = data;
      // console.log(this.patients);
    });
  }
  loadAbo() {
    this.patientService.detailTest(this.message, 'abo').subscribe(data => {

      this.aboLists = data;
      this.aboLists_photo = new Array<Patient>();

      this.patientService.photo(this.message, 'abo', data, (cb, i) => {
        this.aboLists_photo.push(cb);
      });
      this.showData(this.aboLists);
    });
  }
  loadAntibody() {
    this.patientService.detailTest(this.message, 'antibody').subscribe(data => {
      this.antibodyLists = data;
      this.antibodyLists_photo = new Array<Patient>();

      this.patientService.photo(this.message, 'antibody', data, (cb, i) => {
        this.antibodyLists_photo.push(cb);
      });
      this.showData(this.antibodyLists);
    });
  }
  loadSaliva() {
    this.patientService.detailTest(this.message, 'saliva').subscribe(data => {

      this.salivaLists = data;
      this.salivaLists_photo = new Array<Patient>();

      this.patientService.photo(this.message, 'saliva', data, (cb, i) => {
        this.salivaLists_photo.push(cb);
      });
      this.showData(this.salivaLists);
    });
  }
}
