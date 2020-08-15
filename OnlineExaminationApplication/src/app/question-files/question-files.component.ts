import { Component, OnInit } from '@angular/core';
import { ExaminationService } from '../services/examinationService';
import { File } from '../models/file';
import { FormGroup, FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-files',
  templateUrl: './question-files.component.html',
  styleUrls: ['./question-files.component.css']
})
export class QuestionFilesComponent implements OnInit {
  newFile: File;
  errorAddFile: string = null;
  selectFile: File;
  deletedFile: File;
  files: File[];
  myForm: FormGroup;
  constructor(private cookieService: CookieService, private examService: ExaminationService, private router: Router) {
    this.selectFile = new File;
    this.fetchFiles();
  }
  ngDoCheck(): void {
    if (this.cookieService.get('Type') != "Admin")
      this.router.navigate(['/home'])
  }
  submitFile(ctrl): void {
    if (ctrl.files.length > 0) {
      if (ctrl.files[0].type != "application/vnd.ms-excel" && ctrl.files[0].type != "text/plain") {
        this.errorAddFile = "File Type should be CSV!";
      }
      else {
        const formData = new FormData();
        formData.append('id', this.cookieService.get('Id'));
        formData.append('file', ctrl.files[0]);
        this.examService.addFile(formData).subscribe((data) => {
          this.newFile = data;
          this.fetchFiles();
        });
        this.errorAddFile = null;
      }
    }
    else {
      this.errorAddFile = "Add a File before submitting!";
    }
    this.newFile = null;
    this.selectFile = new File;
    this.deletedFile = null;
  }
  fetchFiles(): void {
    this.examService.getFiles().subscribe((data) => {
      if (data.length > 0)
        this.files = data;
      else
        this.files = null;
    })
  }
  removeFile(): void {
    this.examService.deleteFile(parseInt(this.cookieService.get('Id')), this.selectFile).subscribe((data) => {
      this.deletedFile = data;
      this.fetchFiles();
    });
    this.selectFile = new File;
  }
  setProperties(): void {
    this.errorAddFile = null;
    this.newFile = null;
    this.deletedFile = null;
  }
  ngOnInit(): void {
  }
}

