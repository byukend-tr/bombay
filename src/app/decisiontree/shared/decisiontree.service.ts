import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';

import { Decisiontree } from './decisiontree';

@Injectable()
export class DecisiontreeService {
  authState: any = null

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore) {
    // this.userRef = this.db.object('decision');
    // console.log(this.userRef)
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      console.log(this.authState)
    });

    // this.queryCondition('all')
  }

  createDecisionTree(decisiontree: Decisiontree){
    firebase.database().ref('/decisions').push( decisiontree)
    this.router.navigate(['/conditions'])
  }

}
