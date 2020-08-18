import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  TestId: string = null;
  selectStructure: Structure;
  structures: Structure[];
  testQuestions: TestQuestion[];
  showingInstructions: boolean = false;
  showingStart: boolean = false;
  showError: string = null;
  currentQuestion: number = null;
  currentAnswers: number[];
  timeLeft: number;
  interval;
  timeout;
  constructor(private cookieService: CookieService, private examService: ExaminationService, private router: Router) { 
    this.selectStructure = new Structure;
    if (this.cookieService.get('Test'))
      this.startTest();
  }
  ngDoCheck(): void {
    if (this.cookieService.get('Type') != "User")
      this.router.navigate(['/login'], { queryParams: { type: 'User' }});
    if (this.cookieService.get('Test') != this.TestId) {
      this.TestId = this.cookieService.get('Test');
      if (this.TestId == '')
        this.fetchStructures();
    }
  }
  fetchStructures(): void {
    this.examService.getTestOptions(parseInt(this.cookieService.get('Id'))).subscribe((data) => {
      if (data.length > 0)
        this.structures = data;
      else {
        this.structures = null;
        this.showError = "No possible test options left!"
      }
      this.selectStructure = new Structure;
      this.currentQuestion = null;
      this.currentAnswers = null;
      this.testQuestions = null;
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
    this.structures = null;
    if (this.cookieService.get('Test')) {
      this.examService.resumeTest(parseInt(this.cookieService.get('Test'))).subscribe((data) => {
        console.log('HI');
        this.testQuestions = data;
        this.currentQuestion = 0;
        this.timeLeft = new Date(this.cookieService.get('Time')).getTime() - new Date().getTime();
        this.currentAnswers = new Array(this.testQuestions.length);
        for (let index = 0; index < this.currentAnswers.length; index++) {
          this.currentAnswers[index] = this.testQuestions[index].UserAnswer;
        }
      });
    }
    else if (this.showInstructions) {
      this.showingInstructions = false;
      this.showingStart = false;
      this.examService.addTest(parseInt(this.cookieService.get('Id')), this.selectStructure).subscribe((data) => {
        if (data.length != 0)  {
          this.testQuestions = data;
          this.currentQuestion = 0;
          this.timeLeft = this.selectStructure.MaxMinutes * 60 * 1000;
          this.currentAnswers = new Array(this.testQuestions.length);
          this.cookieService.set('Test', this.testQuestions[0].TestId.toString());
          this.TestId = this.cookieService.get('Test');
          const endDate = new Date();
          endDate.setMinutes(endDate.getMinutes() + this.selectStructure.MaxMinutes);
          this.cookieService.set('Time', endDate.toString());
          this.examService.setTestTimeOut(this.selectStructure.MaxMinutes);
        }
        else {
          this.showError = "No questions found - ask Admin to add questions first!";
        }
      });
    }
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.timeLeft -= 1000;
    }, 1000);
    
  }
  changeUserAnswer(event: MatRadioChange, index: number): void {
    this.examService.saveUserAnswer(this.testQuestions[index].Id, parseInt(event.value)).subscribe((data) => {});
    this.currentAnswers[index] = parseInt(event.value);
  }
  changeCounter(change: number): void {
    if ((this.currentQuestion + change >= 0) && (this.currentQuestion + change < this.currentAnswers.length))
      this.currentQuestion += change;
  }
  finishTest(): void {
    this.examService.endTest(parseInt(this.cookieService.get('Test'))).subscribe((data) => {});
  }
  ngOnInit(): void {
  }

}
