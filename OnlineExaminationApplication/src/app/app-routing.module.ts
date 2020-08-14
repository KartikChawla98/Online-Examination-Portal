import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionFilesComponent } from './question-files/question-files.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'files', component: QuestionFilesComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
