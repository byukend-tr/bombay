import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Home
import { HomeComponent } from './home/home.component';
// Auth
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/shared/auth.guard';
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

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

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
    path: 'searchblood',
    component: DetailHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SearchbloodComponent },
      { path: 'detail', component: DetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
