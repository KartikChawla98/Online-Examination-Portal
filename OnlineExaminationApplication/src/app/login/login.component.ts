import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExaminationService } from '../services/examinationService';
import { Accessor } from '../models/accessor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginType: string = "User";
  myForm: FormGroup;
  showError: string = null;
  constructor(private route: ActivatedRoute, private router: Router, private examService: ExaminationService) {
    this.route.queryParams.subscribe((params) => {
      if (params['type'])
        this.loginType = params['type'];
    });
    this.myForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    })
  }
  get email() {
    return this.myForm.get("email");
  }
  get password() {
    return this.myForm.get("password");
  }
  tryLogin() {
    if(this.myForm.valid) {
      const tempAccessor = new Accessor;
      tempAccessor.Type = this.loginType;
      tempAccessor.Email = this.myForm.get('email').value;
      tempAccessor.Password = this.myForm.get('password').value;
      this.examService.validateLogin(tempAccessor).subscribe((data) => {
        if (data.Id != 0) {
          this.examService.setAccessor(data);
          this.showError = null;
          this.router.navigate(["/home"]);
        }
        else if (data.Email != null) {
          this.showError = "Incorrect Password";
          this.password.reset();
        }
        else {
          this.showError = "Invalid Username";
          this.myForm.reset();
        }
      });
    }
  }
  clearDetails () {
    this.myForm.reset();
  }
  ngOnInit(): void {
  }

}
