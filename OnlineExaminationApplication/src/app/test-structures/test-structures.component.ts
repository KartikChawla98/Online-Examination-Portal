import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ExaminationService } from '../services/examinationService';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Structure } from '../models/structure';

@Component({
  selector: 'app-test-structures',
  templateUrl: './test-structures.component.html',
  styleUrls: ['./test-structures.component.css']
})
export class TestStructuresComponent implements OnInit {
  newStructure: Structure;
  showError: string = null;
  selectStructure: Structure;
  updatedStructure: Structure;
  deletedStructure: Structure;
  structures: Structure[];
  myAddForm: FormGroup;
  myUpdateForm: FormGroup;
  constructor(private cookieService: CookieService, private examService: ExaminationService, private router: Router) {
    this.selectStructure = new Structure;
    this.fetchStructures();
    this.myAddForm = new FormGroup({
      atechnology: new FormControl(null, Validators.required),
      alevel: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(3)]),
      aminutes: new FormControl(null, [Validators.required, Validators.min(1)]),
      aquestions: new FormControl(null, [Validators.required, Validators.min(1)]),
      ascore: new FormControl(null, [Validators.required, Validators.min(1)]),
    });
    this.myUpdateForm = new FormGroup({
      uminutes: new FormControl(null, [Validators.required, Validators.min(1)]),
      uquestions: new FormControl(null, [Validators.required, Validators.min(1)]),
      uscore: new FormControl(null, [Validators.required, Validators.min(1)]),
    });
  }
  ngDoCheck(): void {
    if (this.cookieService.get('Type') != "Admin")
      this.router.navigate(['/login'], { queryParams: { type: 'Admin' }});
  }
  get atechnology() {
    return this.myAddForm.get('atechnology');
  }
  get alevel() {
    return this.myAddForm.get('alevel');
  }
  get aminutes() {
    return this.myAddForm.get('aminutes');
  }
  get aquestions() {
    return this.myAddForm.get('aquestions');
  }
  get ascore() {
    return this.myAddForm.get('ascore');
  }
  get uminutes() {
    return this.myUpdateForm.get('uminutes');
  }
  get uquestions() {
    return this.myUpdateForm.get('uquestions');
  }
  get uscore() {
    return this.myUpdateForm.get('uscore');
  }
  fetchStructures(): void {
    this.examService.getStructures().subscribe((data) => {
      if (data.length > 0)
        this.structures = data;
      else
        this.structures = null;
    })
  }
  submitStructure(): void {
    if (this.myAddForm.valid) {
      const testStructure = new Structure(undefined, this.atechnology.value, this.alevel.value, this.aminutes.value, this.aquestions.value, this.ascore.value);
      this.examService.addStructure(parseInt(this.cookieService.get('Id')), testStructure).subscribe((data) => {
        if (data.Id != 0)  {
          this.newStructure = data;
          this.fetchStructures();
          this.showError = null;
        }
        else {
          this.showError = "Structure with same Technology and Level already exists!"
          this.atechnology.reset();
          this.alevel.reset();
          this.newStructure = null;
        }
      });
    }
    this.selectStructure = new Structure;
    this.updatedStructure = null;
    this.deletedStructure = null;
  }
  editStructure(): void {
    if (this.myUpdateForm.valid) {
      this.selectStructure.MaxMinutes = this.uminutes.value;
      this.selectStructure.NumberOfQuestions = this.uquestions.value;
      this.selectStructure.PassingScore = this.uscore.value;
      this.examService.updateStructure(parseInt(this.cookieService.get('Id')), this.selectStructure).subscribe((data) => {
        this.updatedStructure = data;
        this.fetchStructures();
      });
    }
    this.selectStructure = new Structure;
  }
  removeStructure(): void {
    this.examService.deleteStructure(parseInt(this.cookieService.get('Id')), this.selectStructure).subscribe((data) => {
      this.deletedStructure = data;
      this.fetchStructures();
    });
    this.selectStructure = new Structure;
  }
  setProperties(): void {
    this.newStructure = null;
    this.updatedStructure = null;
    this.deletedStructure = null;
    this.showError = null;
    this.clearUpdateDetails();
  }
  clearAddDetails(): void {
    this.myAddForm.reset();
  }
  clearUpdateDetails(): void {
    this.myUpdateForm.patchValue({
      uminutes: this.selectStructure.MaxMinutes,
      uquestions: this.selectStructure.NumberOfQuestions,
      uscore: this.selectStructure.PassingScore
    });
  }
  ngOnInit(): void {
  }
}

