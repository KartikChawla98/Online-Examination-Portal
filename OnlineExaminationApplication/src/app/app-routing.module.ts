import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { QuestionFilesComponent } from './question-files/question-files.component';
import { TestStructuresComponent } from './test-structures/test-structures.component';
import { TestsComponent } from './tests/tests.component';
import { ReportsComponent } from './reports/reports.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reset', component: ResetPasswordComponent},
  {path: 'files', component: QuestionFilesComponent},
  {path: 'structures', component: TestStructuresComponent},
  {path: 'tests', component: TestsComponent},
  {path: 'reports', component: ReportsComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**',   redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
