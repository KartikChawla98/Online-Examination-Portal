import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExaminationService } from '../services/examinationService';
import { sha512 } from 'js-sha512';
import { User } from '../models/user';
import { Accessor } from '../models/accessor';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  myForm: FormGroup;
  showError: string = null;
  currDate: Date = new Date();
  currYear: number = new Date().getFullYear();
  constructor(private router: Router, private examService: ExaminationService) { 
    this.currDate.setFullYear(new Date().getFullYear() - 18);
    this.myForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      repassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      dob: new FormControl(null, [Validators.required]),
      contact: new FormControl(null, [Validators.required, Validators.pattern("^[0-9+]*$"), Validators.minLength(7), Validators.maxLength(13)]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      qualification: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required, Validators.min(1950), Validators.max(this.currYear)]),
    })
  }
  get name() {
    return this.myForm.get("name");
  }
  get email() {
    return this.myForm.get("email");
  }
  get password() {
    return this.myForm.get("password");
  }
  get repassword() {
    return this.myForm.get("repassword");
  }
  get dob() {
    return this.myForm.get("dob");
  }
  get contact() {
    return this.myForm.get("contact");
  }
  get city() {
    return this.myForm.get("city");
  }
  get state() {
    return this.myForm.get("state");
  }
  get qualification() {
    return this.myForm.get("qualification");
  }
  get year() {
    return this.myForm.get("year");
  }
  tryRegister() {
    if(this.myForm.valid) {
      if (this.password.value != this.repassword.value)
      {
        this.showError = "Password and Confirm Password should match!";
        this.password.reset();
        this.repassword.reset();
      }
      else {
        const user = new User(undefined, this.name.value, this.email.value, 
          sha512(this.password.value), this.dob.value, this.contact.value, this.city.value, 
          this.state.value, this.qualification.value, this.year.value);
          this.examService.registerUser(user).subscribe(
            (data) => {
              const accessor = new Accessor("User", data, user.FullName, user.Email);
              this.examService.setAccessor(accessor);
              this.showError = null;
              this.router.navigate(["/home"]);
          },
          (error: Response) => {
            if (error.status == 409)
              this.showError = "Email has already been registered!";
              this.email.reset();
              this.password.reset();
              this.repassword.reset();
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
