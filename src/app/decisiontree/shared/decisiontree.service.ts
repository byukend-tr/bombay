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
  authState: any = null;
  training_data: any;
  class_name: any;
  features: any;
  DecisionTree = require('decision-tree');
  // authState: any = null;
  userRef: AngularFireObject<any>;
  conditionList: any;


  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore) {
    // this.userRef = this.db.object('decision');
    // console.log(this.userRef)
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      console.log(this.authState);
    });

    // this.queryCondition('all')
  }

  createDecisionTree(decisiontree: Decisiontree) {
    firebase.database().ref('/decisions').push(decisiontree);
    this.router.navigate(['/conditions']);
  }

  testData(data1: string, data2: string, data3: string, data4: string, data5: string, data6: string) {
    // testData(data1: string, data2: string) {

    this.class_name = 'result';
    this.features = ['AntiA', 'AntiB', 'AntiAB', 'Acell', 'Bcell', 'Ocell'];
    const dt = new this.DecisionTree(this.training_data, this.class_name, this.features);
    // console.log(dt)
    const predicted_class = dt.predict({
      AntiA: data1,
      AntiB: data2,
      AntiAB: data3,
      Acell: data4,
      Bcell: data5,
      Ocell: data6
    });
    // var predicted_class = dt.predict({
    //   color: "blue",
    //   shape: "hexagon"
    // });
    // var accuracy = dt.evaluate(this.test_data);
    const treeModel = dt.toJSON();
    console.log(predicted_class);


    // this.class_name = "liked"
    // this.features = ["color", "shape"]
    // console.log("testData" + this.class_name)
    // var dt = new this.DecisionTree(this.training_data, this.class_name, this.features);
    // var predicted_class = dt.predict({
    //   color: "blue",
    //   shape: "hexagon"
    // });
    // var treeModel = dt.toJSON();
    // console.log(predicted_class)
  }

  trainModel() {
    console.log('decisionokok');
    this.db.list('/decisions').valueChanges().subscribe(data => {
      this.training_data = data;
      this.testData('1', '2', '3', '4', '0', '0');


    });
  }

  private addCondition(AntiA: string, AntiB: string, AntiAB: string, Acell: string, Bcell: string, Ocell: string, result: string): void {
    console.log(firebase.database());
    firebase.database().ref('/decision').push({ AntiA, AntiB, AntiAB, Acell, Bcell, Ocell, result });
  }

  createCondition(AntiA: string, AntiB: string, AntiAB: string, Acell: string, Bcell: string, Ocell: string, result: string) {
    this.addCondition(AntiA, AntiB, AntiAB, Acell, Bcell, Ocell, result);
    this.router.navigate(['/conditions']);
  }
  queryAllCondition(callback: (data) => void) { // first edit callback 8/2/18
    return this.db.list('/decisions').valueChanges().subscribe(data => {
      callback(data);
    });
  }
  queryCondition(condition, callback) {
    // this.conditionList = db.list('/decision').valueChanges();
    if (condition === 'all') {
      this.queryAllCondition(callback);
      // var ref = firebase.database().ref();

      // ref.on("decision", function (snapshot) {
      //   console.log(snapshot.val());
      // }, function (error) {
      //   console.log("Error: " + error.code);
      // });

    }
  }
}
