import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
    this.userForm = new FormGroup({
      emailSignup: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      fName: new FormControl('มะยม'),
      lName: new FormControl('มะนาว'),
      position: new FormControl(),
      hospital: new FormControl(),
      email: new FormControl('m@gmail.com'),
      privilege: new FormControl()

    });
  }
  validationForm() {
    this.signup();
  }
  signup(): void {
    this.auth.register(this.userForm.value);

  }
}
