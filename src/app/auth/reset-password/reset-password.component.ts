import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl(),
      newPassword: new FormControl(),
      rePassword: new FormControl()
    });
  }
  resetPassword() {

  }
}
