import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { MatRadioModule } from '@angular/material/radio'
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { QuestionFilesComponent } from './question-files/question-files.component';
import { TestStructuresComponent } from './test-structures/test-structures.component';
import { LoginComponent } from './login/login.component';
import { TestsComponent } from './tests/tests.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionFilesComponent,
    TestStructuresComponent,
    LoginComponent,
    TestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
