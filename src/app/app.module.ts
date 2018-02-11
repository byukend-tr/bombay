import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './../environments/firebase.config';

import { AppRoutingModule } from './app-routing.module';

import { NavbarComponent } from './header/navbar/navbar.component';
// auth
import { AuthService } from './auth/shared/auth.service';
import { AuthGuard } from './auth/shared/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component'

import { HomeComponent } from './home/home.component';
// Decisiontree
import { SearchbloodComponent } from './patient/searchblood/searchblood.component';
import { DecisionFormComponent } from './decisiontree/decision-form/decision-form.component';
import { DecisionListComponent } from './decisiontree/decision-list/decision-list.component';
import { DecisionHomeComponent } from './decisiontree/decision-home/decision-home.component';
import { DecisiontreeService } from './decisiontree/shared/decisiontree.service';
// Genotype
import { GenotypeHomeComponent } from './genediagnosis/genotype-home/genotype-home.component';
import { MutationDetectionService } from './genediagnosis/shared/mutation-detection.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    SearchbloodComponent,
    DecisionFormComponent,
    DecisionListComponent,
    DecisionHomeComponent,
    GenotypeHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // firebase
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    AngularFireDatabase,
    DecisiontreeService,
    MutationDetectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
