import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExaminationService } from '../services/examinationService';
import { Accessor } from '../models/accessor';
import { sha512 } from 'js-sha512';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showingResetInstructions: boolean = false;
  loginType: string = "User";
  myForm: FormGroup;
  showError: string = null;
  myResetForm: FormGroup;
  showResetError: string = null;
  constructor(private cookieService: CookieService, private route: ActivatedRoute, private router: Router, private examService: ExaminationService) {
    this.route.queryParams.subscribe((params) => {
      if (params['type'])
        this.loginType = params['type'];
    });
    this.myForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    })
    this.myResetForm = new FormGroup({
      resetmail: new FormControl(null, [Validators.required])
    })
  }
  get email() {
    return this.myForm.get("email");
  }
  get password() {
    return this.myForm.get("password");
  }
  get resetmail() {
    return this.myResetForm.get("resetmail");
  }
  tryLogin() {
    if(this.myForm.valid) {
      const tempAccessor = new Accessor;
      tempAccessor.Type = this.loginType;
      tempAccessor.Email = this.myForm.get('email').value;
      tempAccessor.Password = sha512(this.myForm.get('password').value);
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
  showResetInstructions() {
    this.showError = null;
    this.showingResetInstructions = true;
  }
  trySendMail() {
    if(this.myResetForm.valid) {
      this.examService.sendResetMail(this.resetmail.value).subscribe(
        (data) => {
          this.cookieService.set('Identifier', data);
          this.cookieService.set('ResetEmail', this.resetmail.value);
          this.showResetError = "Sent Reset Password Mail!";
        },
        (error: Response) => {
          if (error.status == 404)
          {
            this.showResetError = "No User exists with given registered Email!";
            this.myResetForm.reset();
          }
        }
      );
    }
  }
  goBack() {
    this.showResetError = null;
    this.showingResetInstructions = false;
  }
  ngOnInit(): void {
  }

}
