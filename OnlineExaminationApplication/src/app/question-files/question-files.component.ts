import { Component, OnInit } from '@angular/core';
import { ExaminationService } from '../services/examinationService';
import { File } from '../models/file';
import { FormGroup, FormControl } from '@angular/forms';

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
  constructor(private examService: ExaminationService) {
    this.selectFile = new File;
    this.fetchFiles();
  }
  submitFile(ctrl): void {
    if (ctrl.files.length > 0) {
      if (ctrl.files[0].type != "application/vnd.ms-excel" && ctrl.files[0].type != "text/plain"){
        this.errorAddFile = "File Type should be CSV!";
        console.log(ctrl.files[0].type);
      }
      else {
        const formData = new FormData();
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
    this.examService.deleteFile(this.selectFile).subscribe((data) => {
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

