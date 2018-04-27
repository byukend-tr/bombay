import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

import 'rxjs/add/operator/switchMap';
// Class decisiontree

import { Decisiontree } from './decisiontree';
import { LOADIPHLPAPI } from 'dns';
import { log } from 'util';



@Injectable()
export class DecisiontreeService {
  authState: any = null;
  training_data: Array<any> = [];
  test_data: Array<any> = [];
  class_name: any;
  features: any;
  DecisionTree = require('decision-tree');
  userRef: AngularFireObject<any>;
  conditionList: any;

  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      console.log(this.authState);
    });

    // this.itemsRef = db.list('decisions');

    // this.items = this.itemsRef.snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // });
    // console.log(this.items);
    // this.trainModel();
  }

  createDecisionTree(decisiontree: Decisiontree) {
    firebase.database().ref('/decisions').push(decisiontree);
    this.router.navigate(['/conditions']);

  }

  testData_Abo(test: Decisiontree) {
    this.class_name = 'result';
    this.features = ['AntiA', 'AntiB', 'AntiAB', 'ACell', 'BCell', 'OCell', 'TestAntiA', 'TestAntiB', 'TestAntiH'];
    const dt = new this.DecisionTree(this.training_data, this.class_name, this.features);

    console.log(test);

    const predicted_class = dt.predict({
      AntiA: test.AntiA,
      AntiB: test.AntiB,
      AntiAB: test.AntiAB,
      ACell: test.ACell,
      BCell: test.Bcell,
      OCell: test.OCell,
      TestAntiA: test.testAntiA,
      TestAntiB: test.testAntiB,
      TestAntiH: test.testAntiH
    });

    // var predicted_class = dt.predict({
    //   color: "blue",
    //   shape: "hexagon"
    // });
    // var accuracy = dt.evaluate(this.test_data);
    // const treeModel = dt.toJSON();

    return predicted_class;
  }
  testData_Saliva(test: Decisiontree) {
    this.class_name = 'result';
    this.features = ['AntiA', 'AntiB', 'AntiAB', 'ACell', 'BCell', 'OCell', 'TestAntiA', 'TestAntiB', 'TestAntiH'];
    const dt = new this.DecisionTree(this.training_data, this.class_name, this.features);

    const predicted_class = dt.predict({
      TestAntiA: test.testAntiA,
      TestAntiB: test.testAntiB,
      TestAntiH: test.testAntiH
    });
    return predicted_class;
  }
  analyzeAboTest(test: Decisiontree) {
    return this.testData_Abo(test);
  }
  analyzeSalivaTest(test: Decisiontree) {
    return this.testData_Saliva(test);
  }
  crossValidation(data: any, number_test: number, start: number) {
    this.test_data = [];
    this.training_data = [];
    let i = 0;
    console.log(start, number_test);
    console.log(data);

    data.forEach(item => {
      // for (const i in item) {
      // console.log(item);

      if (i < number_test && i >= start) {
        // console.log('test');
        this.test_data.push(item);

      } else {
        // console.log('tran');
        this.training_data.push(item);

      }
      i++;
      // }
    });
    // console.log(this.training_data);
    // console.log(this.test_data);

    this.class_name = 'result';
    this.features = ['AntiA', 'AntiB', 'AntiAB', 'ACell', 'BCell', 'OCell', 'TestAntiA', 'TestAntiB', 'TestAntiH'];
    const dt = new this.DecisionTree(this.training_data, this.class_name, this.features);
    const predicted_class = dt.predict(this.test_data);

    let accuracy = 0;
    this.test_data.forEach(element => {
      console.log(element);
      const isCorrect = dt.evaluate(element);
      console.log('isCorrect', isCorrect);

      accuracy += isCorrect;
    });
    console.log('each', accuracy);

    return accuracy;
  }
  trainModel() {
    console.log('decisionokok');
    // const k = 3;
    this.db.list('/decisions').valueChanges().subscribe(data => {
      this.training_data = data;
      // const number_data = data.length;
      // const number_test = Math.floor(number_data / k);
      // const number_training = number_data - number_test;
      // console.log(number_data);
      // console.log(number_test);
      // console.log(number_training);


      // let accuracy = 0;
      // for (let num = 0; num < k; num++) {
      // accuracy += this.crossValidation(data, (num * number_test) + number_test, num * number_test);
      // this.crossValidation(data, (num * number_test) + number_test, num * number_test);
      // }
      // console.log(accuracy);
      // }
      // const i = 0;
      // const j = 0;
      // accuracy = this.crossValidation(data, number_test, 0);
      // accuracy += this.crossValidation(data, number_test, 0);
      // for (let i = 0; i < number_data; i++) {
      //   if (i < number_training) {
      //     this.training_data[i] = data[i];
      //   } else {
      //     this.test_data[i] = data[i];
      //   }
      // }
      // this.training_data = data;
      // this.testData('1', '2', '3', '4', '0', '0');
      // console.log(this.training_data);

      // console.log(predicted_class);
      // console.log(dt);



      // console.log('Accuracy = ' + accuracy);
      this.class_name = 'result';
      this.features = ['AntiA', 'AntiB', 'AntiAB', 'ACell', 'BCell', 'OCell', 'TestAntiA', 'TestAntiB', 'TestAntiH'];
      const dt = new this.DecisionTree(this.training_data, this.class_name, this.features);
      const predicted_class = dt.predict(this.test_data);
      // console.log(predicted_class);

    });
  }

  private addCondition(decisiontree: Decisiontree): void {
    console.log(firebase.database());
    firebase.database().ref('/decision').push(decisiontree);
  }

  createCondition(decisiontree: Decisiontree) {
    this.addCondition(decisiontree);
    this.router.navigate(['/conditions']);
  }

  queryAllCondition() { // first edit callback 8/2/18
    // return this.db.list('/decisions').valueChanges().subscribe(data => {
    //   callback(data);
    // });
    console.log('allllll');

    return this.db.list('/decisions').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }
    );

  }
  // queryAboCondition(value): Observable<any[]> {
  //   console.log('querySomeCondition');
  //   console.log(value);

  //   // tslint:disable-next-line:max-line-length
  //   return this.db.list('/decisions', ref => ref.orderByChild('groupAbo').equalTo(value)).snapshotChanges().map(changes => {
  //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  //   }

  //   );

  // }
  queryTwoCondition(value): Observable<any[]> { // first edit callback 8/2/18
    // return this.db.list('/decisions').valueChanges().subscribe(data => {
    //   callback(data);
    // });
    console.log('querySomeCondition');
    console.log(value);

    // tslint:disable-next-line:max-line-length
    return this.db.list('/decisions', ref => ref.orderByChild('groupAbo').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => {
        const id = c.payload.key;
        const data = c.payload.val();
        return { key: id, ...data };
      });
    }
    );

  }
  queryAboCondition(value) {
    return this.db.list('/decisions', ref => ref.orderByChild('groupAbo').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }

    );

  }
  querySalivaCondition(value) {
    return this.db.list('/decisions', ref => ref.orderByChild('groupSaliva').equalTo(value)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }

    );

  }
  queryDynamicCondition(abo, saliva): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    return this.db.list('/decisions', ref => ref.orderByChild('groupAbo').orderByChild('groubSaliva').equalTo(abo)).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }

    );

  }



  // test
  // getAllData(): Observable<Decisiontree[]> {
  //   return this.db.list('/decisions').valueChanges().subscribe(data => {

  //   })


  removeCondition(idList: any) {
    for (const id of idList) {
      // this.itemsRef.remove(id);
      // this.db.object('/decisions' + id).remove();
      this.db.object('/decisions/id').remove().then(() => {
        this.db.object('decisions' + '/' + id).remove();
      });
    }
  }
}
