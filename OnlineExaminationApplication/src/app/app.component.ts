import { Component } from '@angular/core';
import { ExaminationService } from './services/examinationService';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OnlineExaminationApplication';

  displayType: string = "User";
  displayName: string = "Guest";
  constructor(private cookieService: CookieService, private examService: ExaminationService, private router: Router) {
  }
  logOut() {
    this.cookieService.delete('Type');
    this.cookieService.delete('Name');
    this.cookieService.delete('Email');
    this.cookieService.delete('Id');
    this.router.navigate(['/home']);
  }
  ngDoCheck() {
    const tempName = this.cookieService.get('Name');
    if (tempName)
      this.displayName = tempName;
    else
      this.displayName = "Guest";
    const tempType = this.cookieService.get('Type');
    if (tempType)
      this.displayType = tempType;
    else
      this.displayType = "User";
  }
}
