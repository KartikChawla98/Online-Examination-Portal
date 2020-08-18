import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Report } from '../models/report';
import { ExaminationService } from '../services/examinationService';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  reports: Report[];
  uniqueTechnologies: string[];
  uniqueLevels: number[];
  uniqueCities: string[];
  uniqueStates: string[];
  filteredReports: Report[];
  selectedReport: Report;
  filterTechnology: string = null;
  filterLevel: number = null;
  filterCity: string = null;
  filterState: string = null;
  filterResult: string = null;
  showError: string = null;
  showDetails: boolean = false;
  constructor(private router: Router, private cookieService: CookieService, private examService: ExaminationService) {
    this.selectedReport = new Report;
    this.uniqueTechnologies = [];
    this.uniqueLevels = [];
    this.uniqueCities = [];
    this.uniqueStates = [];
    this.filteredReports = [];
    this.fetchReports();
  }
  ngDoCheck(): void {
    if (!this.cookieService.get('Type'))
      this.router.navigate(['/login'], { queryParams: { type: 'User' }});
  }
  fetchReports() {
    this.examService.getReports().subscribe((data) => {
      if (data.length > 0) {
        this.reports = data;
        this.filteredReports = data;
      }
      else {
        this.reports = null;
        this.filteredReports = null;
        this.showError = "No reports found!"
      }
      if (this.reports)
      {
        this.reports.forEach(element => {
          if (this.uniqueTechnologies.indexOf(element.Structure.Technology) == -1)
            this.uniqueTechnologies.push(element.Structure.Technology);
          if (this.uniqueLevels.indexOf(element.Structure.Level) == -1)
            this.uniqueLevels.push(element.Structure.Level);
          if (this.uniqueCities.indexOf(element.User.City) == -1)
            this.uniqueCities.push(element.User.City);
          if (this.uniqueStates.indexOf(element.User.State) == -1)
            this.uniqueStates.push(element.User.State);
        });
      }
      this.selectedReport = new Report;
    })
  }
  applyFilters() {
    this.filteredReports = [];
    this.reports.forEach(element => {
      if (
        (this.filterTechnology == null || element.Structure.Technology == this.filterTechnology)
        &&
        (this.filterLevel == null || element.Structure.Level == this.filterLevel)
        &&
        (this.filterCity == null || element.User.City == this.filterCity)
        &&
        (this.filterState == null || element.User.State == this.filterState)
        &&
        (this.filterResult == null || element.Result == this.filterResult)
        )
        this.filteredReports.push(element);
    })
  }
  clearFilters() {
    this.filterTechnology = null;
    this.filterLevel = null;
    this.filterCity = null;
    this.filterState = null;
    this.filterResult = null;
    this.filteredReports = this.reports;
  }
  ngOnInit(): void {
  }
}
