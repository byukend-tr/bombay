import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

import 'firebase/storage';

import 'rxjs/add/operator/switchMap';

// Class Patient
import { Patient } from './patient';
// Class Relatives
import { Relatives } from './relatives';

import Swal from 'sweetalert2';

import { FileUpload } from './file-upload';
@Injectable()
export class PatientService {

  Swal = require('sweetalert2');
  itemsRef: AngularFireList<any>;
  swal: any;

  // private basePath = '/uploads';
  // fileUploads: Observable<FileUpload[]>;
  private basePath: String = '/patients';
  private uploadTask: firebase.storage.UploadTask;
  uploads: AngularFireList<any>;
  private testList;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore
  ) {

    this.itemsRef = db.list('decisions');

  }
  isFoundPatient(id: string) {
    return this.db.list('patients', ref => ref.orderByChild('id').equalTo(id)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  createPatient(patient: Patient, id: string) {

    const isFound = this.isFoundPatient(id);
    console.log('isFound' + isFound);

    if (isFound === null) {
      return false;
    } else {
      firebase.database().ref('patients' + '/' + id).set(patient);
      return true;
    }
  }
  createAboTest(patient: Patient, id: string) {
    return firebase.database().ref('patients/' + id + '/abo').push(patient);
  }
  createAntibodyTest(patient: Patient, id: string) {
    return firebase.database().ref('patients/' + id + '/antibody').push(patient);
  }
  createSalivaTest(patient: Patient, id: string) {
    return firebase.database().ref('patients/' + id + '/saliva').push(patient);
  }
  updateResult(result: Patient, id: string, resultName: string) {
    firebase.database().ref('patients/' + id + '/' + resultName).set(result);
  }
  query() {
    // console.log('22222');
    return this.db.list('/patients').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    // Swal('Good job!', 'You clicked the button!', 'success');
  }
  queryRelatives(value: string) {
    return this.db.list('/patients', ref => ref.orderByChild('fName').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
  antibody(value: string) { // O cells
    const lists = new Array<any>();
    // lists = this.detailTest(value, 'resultAbo');
    // console.log(this.lists);
    // return resultAbo;
  }
  detailPatient(value: string) {
    return this.db.list('/patients', ref => ref.orderByChild('id').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }
    );
  }
  eachPhoto(id: string, value: string, testName: string) {
    return this.db.list(`/patients/${id}/${testName}/${value}/photo`).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
  detailTest(id: string, testName: string) {
    return this.db.list(`/patients/${id}/${testName}`).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
  photo(id: string, testName: string, test: any, callback) {
    for (let i = 0; i < test.length; i++) {
      this.eachPhoto(id, test[i].key, testName).subscribe(data => {
        callback(data, i);
      });
    }
  }
  photoAntibody(id: string, abo: any, callback) {
    for (let i = 0; i < abo.length; i++) {
      this.eachPhoto(id, abo[i].key, 'antibody').subscribe(data => {
        callback(data, i);
      });
    }
  }
  photoSaliva(id: string, abo: any, callback) {
    for (let i = 0; i < abo.length; i++) {
      this.eachPhoto(id, abo[i].key, 'saliva').subscribe(data => {
        callback(data, i);
      });
    }
  }
  loaddetailPatient(relative: any, callback) {
    for (let i = 0; i < relative.length; i++) {
      // console.log(i + relative[i].key);
      this.detailPatient(relative[i].key).subscribe(data => {
        callback(data, i);
      });
    }
  }
  relativesOfPatient(value: string) {
    // return this.db.list(`/relatives/${value}`).snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // }

    // );

    return this.db.list(`/patients/${value}/relatives`).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }

    );
  }
  addRelatives(relative: Relatives, id: string, relativeId: string) {
    console.log(relative, id);


    firebase.database().ref('patients/' + id + '/relatives/' + relativeId).set(relative);
    // firebase.database().ref('relatives/').set(relative);
  }
  deleteRelative(idPatient: string, id: string) {
    // if (confirm('คุณต้องการลบ' + ' หรือไม่!')) {
    //   this.db.object('/decisions/id').remove().then(() => {
    //     this.db.object('patients' + '/' + idPatient + '/relatives/' + id).remove();
    //     alert('ลบ ' + 'เรียบร้อย!');
    //   });
    // }

    Swal({
      title: 'คุณแน่ใจใช่หรือไม่?',
      text: 'คุณต้องการที่จะลบความสัมพันธ์ใช่หรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ต้องการลบ',
      cancelButtonText: 'ไม่ ต้องการลบ'
    }).then((result) => {
      if (result.value) {
        this.db.object('/decisions/id').remove().then(() => {
          this.db.object('patients' + '/' + idPatient + '/relatives/' + id).remove();
          Swal('สำเร็จ!', 'ลบความสัมพันธ์เรียบร้อยแล้ว',
            'success'
          );
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'ยกเลิก!',
          'ยังไม่ได้ลบความสัมพันธ์ของคนไข้',
          'error'
        );
      }
    });

  }

  pushFileToStorage_abo(fileUpload: FileUpload, progress: { percentage: number }, id: string, key: string, i: number) {

    const storageRef = firebase.storage().ref();

    fileUpload.name = i + fileUpload.file.name;
    console.log(id, key);

    const uploadTask = storageRef.child(`${this.basePath}/${id}/abo/${key}/photo/${'1' + fileUpload.file.name}`).put(fileUpload.file);
    // const uploadTask = storageRef.child(`${this.basePath}/${'1' + fileUpload.file.name}`).put(fileUpload.file);


    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = '1' + fileUpload.file.name;
        this.saveFileData_abo(fileUpload, id, key);
        console.log(fileUpload.name);
      }
    );
  }
  pushFileToStorage_antibody(fileUpload: FileUpload, progress: { percentage: number }, id: string, key: string, i: number) {

    const storageRef = firebase.storage().ref();

    fileUpload.name = i + fileUpload.file.name;

    const uploadTask = storageRef.child(`${this.basePath}/${id}/antibody/${key}/photo/${'1' + fileUpload.file.name}`).put(fileUpload.file);


    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = '1' + fileUpload.file.name;
        this.saveFileData_antibody(fileUpload, id, key);
        console.log(fileUpload.name);
      }
    );
  }
  pushFileToStorage_saliva(fileUpload: FileUpload, progress: { percentage: number }, id: string, key: string, i: number) {

    const storageRef = firebase.storage().ref();

    fileUpload.name = i + fileUpload.file.name;
    console.log(id, key);

    const uploadTask = storageRef.child(`${this.basePath}/${id}/saliva/${key}/photo/${'1' + fileUpload.file.name}`).put(fileUpload.file);
    // const uploadTask = storageRef.child(`${this.basePath}/${'1' + fileUpload.file.name}`).put(fileUpload.file);


    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = '1' + fileUpload.file.name;
        this.saveFileData_antibody(fileUpload, id, key);
        console.log(fileUpload.name);
      }
    );
  }
  private saveFileData_abo(fileUpload: FileUpload, id: string, key: string) {
    // this.db.list(`${this.basePath}/`).push(fileUpload);
    this.db.list(`${this.basePath}/${id}/abo/${key}/photo`).push(fileUpload);
  }
  private saveFileData_antibody(fileUpload: FileUpload, id: string, key: string) {
    // this.db.list(`${this.basePath}/`).push(fileUpload);
    this.db.list(`${this.basePath}/${id}/antibody/${key}/photo`).push(fileUpload);
  }
  private saveFileData_saliva(fileUpload: FileUpload, id: string, key: string) {
    // this.db.list(`${this.basePath}/`).push(fileUpload);
    this.db.list(`${this.basePath}/${id}/saliva/${key}/photo`).push(fileUpload);
  }


  getFileUploads(numberItems) {
    console.log(this.basePath);

    console.log(this.db.list(`${this.basePath}/`));

    return this.db.list(`${this.basePath}/`);

    // return this.db.list(`${this.basePath}/`, ref => ref.orderByValue());
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileDatabase(fileUpload.$key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }
  // getImages(): Observable<GalleryImage[]> {
  //   return this.db.list('uploads');
  // }
  getImage(key: string) {
    return firebase.database().ref('upload/' + key).once('value')
      .then((snap) => snap.val());
  }

}
