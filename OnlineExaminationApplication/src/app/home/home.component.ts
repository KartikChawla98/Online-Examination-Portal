import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayType: string = "User";
  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
  }
  ngDoCheck(): void {
    const tempType = this.cookieService.get('Type');
    if (tempType)
      this.displayType = tempType;
    else
      this.displayType = "User";
  }
}
