import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ExaminationService } from '../services/examinationService';
import { Structure } from '../models/structure';
import { TestQuestion } from '../models/testquestion';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  selectStructure: Structure;
  structures: Structure[];
  testQuestions: TestQuestion[];
  showingInstructions: boolean = false;
  showingStart: boolean = false;
  showError: string = null;
  currentQuestion: number = null;
  currentAnswers: number[];
  constructor(private cookieService: CookieService, private examService: ExaminationService, private router: Router) { 
    this.selectStructure = new Structure;
    this.fetchStructures();
  }
  ngDoCheck(): void {
    if (this.cookieService.get('Type') != "User")
      this.router.navigate(['/login'], { queryParams: { type: 'User' }});
  }
  fetchStructures(): void {
    this.examService.getTestOptions(parseInt(this.cookieService.get('Id'))).subscribe((data) => {
      if (data.length > 0)
        this.structures = data;
      else
        this.structures = null;
    })
  }
  showInstructions(): void {
    this.structures = null;
    this.showingInstructions = true;
  }
  goBack(): void {
    this.fetchStructures();
    this.selectStructure = new Structure;
    this.showingInstructions = false;
    this.showingStart = false;
  }
  startTest(): void {
    this.showingInstructions = false;
    this.showingStart = false;
    this.examService.addTest(parseInt(this.cookieService.get('Id')), this.selectStructure).subscribe((data) => {
        if (data.length != 0)  {
          this.testQuestions = data;
          this.currentQuestion = 0;
          this.currentAnswers = new Array(this.testQuestions.length);
        }
        else {
          this.showError = "No questions found - ask Admin to add questions first!";
        }
    });
    setTimeout(() => {
      this.finishTest();
    }, this.selectStructure.MaxMinutes*60*1000);
  }
  changeUserAnswer(event: MatRadioChange, index: number): void {
    this.examService.saveUserAnswer(this.testQuestions[index].Id, parseInt(event.value)).subscribe((data) => {});
    this.currentAnswers[index] = event.value;
  }
  changeCounter(change: number): void {
    if ((this.currentQuestion + change >= 0) && (this.currentQuestion + change < this.selectStructure.NumberOfQuestions))
      this.currentQuestion += change;
  }
  finishTest(): void {
    this.examService.endTest(this.testQuestions[0].TestId).subscribe((data) => {
      this.fetchStructures();
    });
    this.selectStructure = new Structure;
    this.currentQuestion = null;
    this.currentAnswers = null;
    this.testQuestions = null;
  }
  ngOnInit(): void {
  }

}
