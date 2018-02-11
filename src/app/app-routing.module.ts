import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// home
import { HomeComponent } from './home/home.component';
import { SearchbloodComponent } from './patient/searchblood/searchblood.component';
// Auth
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
//Decision
import { DecisionFormComponent } from './decisiontree/decision-form/decision-form.component';
import { DecisionListComponent } from './decisiontree/decision-list/decision-list.component';
import { DecisionHomeComponent } from './decisiontree/decision-home/decision-home.component';
import { AuthGuard } from './auth/shared/auth.guard';
// Genotype
import { GenotypeHomeComponent } from './genediagnosis/genotype-home/genotype-home.component';


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



  { path: 'searchblood', component: DecisionListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }