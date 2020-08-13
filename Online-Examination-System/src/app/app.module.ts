import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterComponent } from './register/register.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CandidateReportComponent } from './candidate-report/candidate-report.component';
import { ExamWindowComponent } from './exam-window/exam-window.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { NewExamComponent } from './new-exam/new-exam.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterComponent,
    AboutUsComponent,
    CandidateReportComponent,
    ExamWindowComponent,
    ForgotPasswordComponent,
    InstructionsComponent,
    NewExamComponent,
    ResetPasswordComponent,
    UserLoginComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
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
      {path: '*' ,  component : HomePageComponent},

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
