import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

import 'rxjs/add/operator/switchMap';

import { Location } from './location';

@Injectable()
export class HomeService {

  constructor(private db: AngularFireDatabase) { }
  createLocation(location: Location, locationCode: string) {
    // console.log('cretaaaa');
    firebase.database().ref('locations/' + locationCode).set(location);
  }
  province() {
    // return this.db.list('locations', ref => ref.orderByChild('id').equalTo(id)).snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // });
  }
  district(value: string) {
    // console.log(value);

    return this.db.list('/locations', ref => ref.orderByChild('province').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
  subDistrict(value: string) {
    console.log(value);

    return this.db.list('/locations', ref => ref.orderByChild('district').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
}
