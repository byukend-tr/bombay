import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Home
import { HomeComponent } from './home/home.component';
// Auth
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/shared/auth.guard';
import { ProfileComponent } from './auth/profile/profile.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

// Auth Users
import { UserListComponent } from './auth/user-list/user-list.component';
import { UserFormComponent } from './auth/user-form/user-form.component';
import { UserHomeComponent } from './auth/user-home/user-home.component';
import { UserDetailComponent } from './auth/user-detail/user-detail.component';
// Decisiontree
import { DecisionFormComponent } from './decisiontree/decision-form/decision-form.component';
import { DecisionListComponent } from './decisiontree/decision-list/decision-list.component';
import { DecisionHomeComponent } from './decisiontree/decision-home/decision-home.component';
// Genotype
import { GenotypeHomeComponent } from './genediagnosis/genotype-home/genotype-home.component';
// Patient
import { SearchbloodComponent } from './patient/searchblood/searchblood.component';
import { DetailHomeComponent } from './patient/detail-home/detail-home.component';
import { DetailComponent } from './patient/detail/detail.component';
import { DetailListComponent } from './patient/detail-list/detail-list.component';
import { SearchtestComponent } from './patient/searchtest/searchtest.component';
import { CreatePatientComponent } from './patient/create-patient/create-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';

import { RelativesFormComponent } from './patient/relatives-form/relatives-form.component';

import { PhenotypeAboFormComponent } from './patient/phenotype-abo-form/phenotype-abo-form.component';



// Result
import { ResultListComponent } from './result/result-list/result-list.component';
import { Profile } from 'selenium-webdriver/firefox';

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  { path: 'resetpassword', component: ResetPasswordComponent },

  {
    path: 'patient',
    component: CreatePatientComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CreatePatientComponent },
      { path: 'create', component: CreatePatientComponent },
      { path: 'edit', component: EditPatientComponent }
    ]
  },

  {
    path: 'conditions',
    component: DecisionHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DecisionListComponent },
      { path: 'create', component: DecisionFormComponent }
    ]
  },

  {
    path: 'genotypes',
    component: GenotypeHomeComponent,
    canActivate: [AuthGuard],
    children: []
  },

  {
    path: 'test',
    component: DetailHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SearchtestComponent },
      { path: 'detail', component: DetailComponent },
      { path: 'create', component: CreatePatientComponent },
      { path: 'edit', component: EditPatientComponent },
      { path: 'relatives', component: RelativesFormComponent },
      { path: 'detaillist', component: DetailListComponent },
      { path: 'phenotypeabo', component: PhenotypeAboFormComponent}
    ]
  },

  {
    path: 'blood',
    component: DetailHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SearchbloodComponent },
      { path: 'detail', component: DetailComponent }
    ]
  },

  {
    path: 'users',
    component: UserHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UserListComponent },
      { path: 'create', component: UserFormComponent },
      { path: 'detail', component: UserDetailComponent }
    ]
  },

  {
    path: 'results',
    component: ResultListComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
