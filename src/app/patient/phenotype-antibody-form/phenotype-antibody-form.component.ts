import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

import { AuthService } from '../../auth/shared/auth.service';

import { PatientService } from '../shared/patient.service';
import { FileUpload } from '../shared/file-upload';


// Gallery
// import { GalleryImage } from 'models/galleryImage.model';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-phenotype-antibody-form',
  templateUrl: './phenotype-antibody-form.component.html',
  styleUrls: ['./phenotype-antibody-form.component.css']
})
export class PhenotypeAntibodyFormComponent implements OnInit {

  conditionForm: FormGroup;

  selectedFiles: FileList;
  fileList: any;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };

  fileUploads: FirebaseListObservable<FileUpload[]>;
  temp: any;

  constructor(private patient: PatientService) { }

  ngOnInit() {
    this.buildForm();
    this.loadPhoto();
  }

  buildForm() {
    this.conditionForm = new FormGroup({
      AntiA: new FormControl(),
      AntiB: new FormControl(),
      AntiAB: new FormControl(),
      Acell: new FormControl(),
      Bcell: new FormControl(),
      Ocell: new FormControl(),
      groupAbo: new FormControl(),
      secretor: new FormControl(),
      nonSecretor: new FormControl(),
      nss: new FormControl(),
      TestAntiA: new FormControl(),
      TestAntiB: new FormControl(),
      TestAntiH: new FormControl(),
      groupSaliva: new FormControl(),
      checkBoxAdd: new FormControl()
    });
  }

  validationInput() {
    const valueGroupAbo = this.conditionForm.value.groupAbo;
    const valueGroupSaliva = this.conditionForm.value.groupSaliva;
    // let canCreate;

    // if (!this.groupType()) {
    //   this.setDatagroupAbo();
    //   canCreate = true;
    // } else if (valueGroupAbo === 'Group A with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.A') {
    //   this.conditionForm.value.result = 'para-Bombay A';
    //   canCreate = true;
    // } else if (valueGroupAbo === 'Group B with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.B') {
    //   this.conditionForm.value.result = 'para-Bombay B';
    //   canCreate = true;
    // } else if (valueGroupAbo === 'Group AB with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.AB') {
    //   this.conditionForm.value.result = 'para-Bombay AB';
    //   canCreate = true;
    // } else if (valueGroupAbo === 'Group O with unexpected alloantibody' && valueGroupSaliva === 'Secretor gr.O') {
    //   this.conditionForm.value.result = 'para-Bombay O';
    //   canCreate = true;
    // } else if (valueGroupAbo === 'Group O with unexpected alloantibody' && valueGroupSaliva === 'Non-Secretor') {
    //   this.conditionForm.value.result = 'O Bombay';
    //   canCreate = true;
    // } else {
    //   canCreate = false;
    // }
    // if (canCreate === true) {
    //   this.createCondition();

    // }


  }

  validationForm() {
    // let validationSuccess = true;
    // tslint:disable-next-line:max-line-length
    // if (!this.conditionForm.value.AntiA || !this.conditionForm.value.AntiB || !this.conditionForm.value.AntiAB || !this.conditionForm.value.Acell || !this.conditionForm.value.Bcell || !this.conditionForm.value.Ocell || !this.conditionForm.value.groupAbo) {
    //   // tslint:disable-next-line:max-line-length
    //   validationSuccess = false;
    //   // tslint:disable-next-line:max-line-length
    // } else if (!this.groupType()) { // Abo
    //   this.setDatagroupAbo();
    // } else if (this.groupType()) { // Abo and Saliva
    //   // tslint:disable-next-line:max-line-length
    //   if (!this.conditionForm.value.secretor || !this.conditionForm.value.nonSecretor || !this.conditionForm.value.nss || !this.conditionForm.value.TestAntiA || !this.conditionForm.value.TestAntiB || !this.conditionForm.value.TestAntiH || !this.conditionForm.value.groupSaliva) {
    //     validationSuccess = false;
    //   }
    // }
    // console.log(validationSuccess);
    // if (validationSuccess) {
    //   this.validationInput();
    // } else {
    //   console.log('input error form');
    // }



  }

  createCondition(): void { // Input data

    // this.decisiontreeService.createDecisionTree(this.conditionForm.value);

  }

  selectFile(event) {
    console.log('yeahhhhhh');

    const file = event.target.files.item(0);

    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
      console.log('selelelele');

      console.log(this.selectedFiles.item);

      this.fileList.push();
    } else {
      alert('invalid format!');
    }
  }

  upload() {


    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.patient.pushFileToStorage(this.currentFileUpload, this.progress);
  }

  loadPhoto() {
    // this.fileUploads = this.patient.getFileUploads({ limitToLast: 3 });
    this.temp = this.patient.getFileUploads({ limitToLast: 10 });
    console.log('showwww');
    console.log(this.temp);
    console.log('endshowwww');

  }


}
