import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharingdataService {
  private messageSource = new BehaviorSubject<string>('default message');
  private testNameMsg = new BehaviorSubject<string>('default message');

  currentMessage = this.messageSource.asObservable();
  test = this.testNameMsg.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  testName(message: string) {
    this.testNameMsg.next(message);
  }

}
