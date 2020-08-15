import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ExaminationService } from '../services/examinationService';
import { FormGroup, FormControl } from '@angular/forms';
import { Structure } from '../models/structure';

@Component({
  selector: 'app-test-structures',
  templateUrl: './test-structures.component.html',
  styleUrls: ['./test-structures.component.css']
})
export class TestStructuresComponent implements OnInit {
  newStructure: Structure;
  errorAddStructure: string = null;
  selectStructure: Structure;
  deletedStructure: Structure;
  structures: Structure[];
  myForm: FormGroup;
  constructor(private cookieService: CookieService, private examService: ExaminationService, private router: Router) {
    this.selectStructure = new Structure;
    this.fetchStructures();
  }
  ngDoCheck(): void {
    if (this.cookieService.get('Type') != "Admin")
      this.router.navigate(['/home'])
  }
  submitStructure(ctrl): void {
    if (ctrl.structures.length > 0) {
      if (ctrl.structures[0].type != "application/vnd.ms-excel" && ctrl.structures[0].type != "text/plain") {
        this.errorAddStructure = "Structure Type should be CSV!";
      }
      else {
        const formData = new FormData();
        formData.append('id', this.cookieService.get('Id'));
        formData.append('structure', ctrl.structures[0]);
        this.examService.addStructure(formData).subscribe((data) => {
          this.newStructure = data;
          this.fetchStructures();
        });
        this.errorAddStructure = null;
      }
    }
    else {
      this.errorAddStructure = "Add a Structure before submitting!";
    }
    this.newStructure = null;
    this.selectStructure = new Structure;
    this.deletedStructure = null;
  }
  fetchStructures(): void {
    this.examService.getStructures().subscribe((data) => {
      if (data.length > 0)
        this.structures = data;
      else
        this.structures = null;
    })
  }
  removeStructure(): void {
    this.examService.deleteStructure(parseInt(this.cookieService.get('Id')), this.selectStructure).subscribe((data) => {
      this.deletedStructure = data;
      this.fetchStructures();
    });
    this.selectStructure = new Structure;
  }
  setProperties(): void {
    this.errorAddStructure = null;
    this.newStructure = null;
    this.deletedStructure = null;
  }
  ngOnInit(): void {
  }
}

