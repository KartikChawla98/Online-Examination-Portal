import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { QuestionFilesComponent } from './question-files/question-files.component';
import { TestStructuresComponent } from './test-structures/test-structures.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionFilesComponent,
    TestStructuresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
