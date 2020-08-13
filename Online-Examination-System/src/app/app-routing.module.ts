import { ReportComponent } from './report/report.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewExamComponent } from './new-exam/new-exam.component';
import { ExamWindowComponent } from './exam-window/exam-window.component';
import { CandidateReportComponent } from './candidate-report/candidate-report.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { RegisterComponent } from './register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {path: 'home-page' ,  component : HomePageComponent},
      {path: 'register' ,  component : RegisterComponent},
      {path: 'instructions' ,  component : InstructionsComponent},
      {path: 'forgot-password' ,  component : ForgotPasswordComponent},
      {path: 'user-login' ,  component : UserLoginComponent},
      {path: 'reset-password' ,  component : ResetPasswordComponent},
      {path: 'new-exam' ,  component : NewExamComponent},
      {path: 'exam-window' ,  component : ExamWindowComponent},
      {path: 'candidate-report' ,  component : CandidateReportComponent},
      {path: 'about-us' ,  component : AboutUsComponent},
      {path: 'report' ,  component : ReportComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
