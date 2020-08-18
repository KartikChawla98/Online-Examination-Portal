import { Component, OnInit } from '@angular/core';
import { ExaminationService } from '../services/examinationService';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { sha512 } from 'js-sha512';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  myForm: FormGroup;
  showError: string = null;
  changedPassword: boolean = false;
  constructor(private cookieService: CookieService, private examService: ExaminationService, private route: ActivatedRoute, private router: Router) { 
      this.route.queryParams.subscribe((params) => {
        if (parseInt(params['Identifier']) != parseInt(this.cookieService.get('Identifier')))
          this.router.navigate(['/home']);
      });
      this.myForm = new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
        repassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
      })
      console.log(sha512('12345678'));
  }
  get password() {
    return this.myForm.get("password");
  }
  get repassword() {
    return this.myForm.get("repassword");
  }
  tryChange() {
    if(this.myForm.valid) {
      if (this.password.value != this.repassword.value)
      {
        this.showError = "Password and Confirm Password should match!";
        this.myForm.reset();
      }
      else {
          this.examService.changePassword(sha512(this.password.value)).subscribe(
            (response) => {
              this.changedPassword = true;
              this.myForm.disable();
              this.showError = "Password Changed";
              this.cookieService.delete('Identifier');
              this.cookieService.delete('ResetEmail');
          },
          (error: Response) => {
            if (error.status == 415)
              this.showError = "Server Error: Try again";
              this.myForm.reset();
          })
      }
    }
  }
  clearDetails () {
    this.myForm.reset();
  }
  ngOnInit(): void {
  }

}
