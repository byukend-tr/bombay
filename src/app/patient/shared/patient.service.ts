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
@Injectable()
export class PatientService {

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore) {

  }


  createPatient(patient: Patient): void {
    console.log(firebase.database());
    firebase.database().ref('/patients').push(patient);
    this.router.navigate(['/test/detail']);

  }

  query() {
    return this.db.list('/patients').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }

    );


  }
}
