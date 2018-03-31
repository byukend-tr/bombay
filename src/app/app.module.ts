import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './../environments/firebase.config';

import { AppRoutingModule } from './app-routing.module';
// Header
import { NavbarComponent } from './header/navbar/navbar.component';
// Auth
import { AuthService } from './auth/shared/auth.service';
import { AuthGuard } from './auth/shared/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

// Auth Users
import { UserListComponent } from './auth/user-list/user-list.component';
import { UserFormComponent } from './auth/user-form/user-form.component';
import { UserHomeComponent } from './auth/user-home/user-home.component';
import { UserDetailComponent } from './auth/user-detail/user-detail.component';
// Home
import { HomeComponent } from './home/home.component';
// Decisiontree
import { DecisionFormComponent } from './decisiontree/decision-form/decision-form.component';
import { DecisionListComponent } from './decisiontree/decision-list/decision-list.component';
import { DecisionHomeComponent } from './decisiontree/decision-home/decision-home.component';
import { DecisiontreeService } from './decisiontree/shared/decisiontree.service';
// Genotype
import { GenotypeHomeComponent } from './genediagnosis/genotype-home/genotype-home.component';
import { MutationDetectionService } from './genediagnosis/shared/mutation-detection.service';
// Patient
import { SearchbloodComponent } from './patient/searchblood/searchblood.component';
import { DetailHomeComponent } from './patient/detail-home/detail-home.component';
import { DetailComponent } from './patient/detail/detail.component';
import { DetailListComponent } from './patient/detail-list/detail-list.component';
import { SearchtestComponent } from './patient/searchtest/searchtest.component';
import { CreatePatientComponent } from './patient/create-patient/create-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';

import { RelativesFormComponent } from './patient/relatives-form/relatives-form.component';

// Result
import { ResultListComponent } from './result/result-list/result-list.component';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PatientService } from './patient/shared/patient.service';
import { SharingdataService } from './patient/shared/sharingdata.service';






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
    GenotypeHomeComponent,
    DetailComponent,
    DetailHomeComponent,
    UserListComponent,
    UserFormComponent,
    UserHomeComponent,
    ResultListComponent,
    SearchtestComponent,
    UserDetailComponent,
    ResetPasswordComponent,
    ProfileComponent,
    CreatePatientComponent,
    EditPatientComponent,
    RelativesFormComponent,
    DetailListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,

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
    MutationDetectionService,
    PatientService,
    SharingdataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
