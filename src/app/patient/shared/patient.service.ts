import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

import 'rxjs/add/operator/switchMap';

// Class Patient
import { Patient } from './patient';
// Class Relatives
import { Relatives } from './relatives';

import Swal from 'sweetalert2';

@Injectable()
export class PatientService {

  Swal = require('sweetalert2');
  itemsRef: AngularFireList<any>;
  swal: any;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore
  ) {

    this.itemsRef = db.list('decisions');

  }


  createPatient(patient: Patient): void {

    firebase.database().ref('/patients').push(patient);


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

  detailPatient(value: string) {
    return this.db.list('/patients', ref => ref.orderByChild('id').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }

    );
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
    // return this.db.list('/relatives').snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // }

    // );
    return this.db.list(`/relatives/${value}`).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }

    );
  }
  addRelatives(relative: Relatives, id: string, relativeId: string) {
    // console.log(relative, id);


    firebase.database().ref('relatives/' + id + '/' + relativeId).set(relative);
    // firebase.database().ref('relatives/').set(relative);
  }
  deleteRelative(idPatient: string, id: string) {
    if (confirm('คุณต้องการลบ' + ' หรือไม่!')) {
      this.db.object('/decisions/id').remove().then(() => {
        this.db.object('/relatives' + '/' + idPatient + '/' + id).remove();
        alert('ลบ ' + 'เรียบร้อย!');
      });
    }

  }
}
