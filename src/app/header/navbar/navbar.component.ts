import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  profile: any = {};
  test: any;
  userInfomation: any;
  name: string;
  privileage: string;
  constructor(private router: Router, public auth: AuthService) {
    this.auth.getCurrentLoggedInOnInit(data => {
      this.profile = data;
      this.getPersonalnformation(this.profile);
    });
  }

  ngOnInit() {
  }
  getPersonalnformation(email: any) {
    this.auth.getUserProfile(email.email).subscribe(data => {
      this.name = 'สวัสดี ' + data[0].fName + ' ' + data[0].lName + ' (' + data[0].privilege + ')';
      this.privileage = data[0].privilege;
    });

  }
}
