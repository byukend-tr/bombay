import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';

import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  profile: any = {}
  test: any

  constructor(private router: Router, public auth: AuthService) {
      auth.getCurrentLoggedInOnInit(auth => {
        this.profile = auth
    });
  }

  ngOnInit() {
  }

}
