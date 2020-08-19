import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';
import { Accessor, AccessorAdapter } from '../models/accessor';
import { File, FileAdapter } from '../models/file';
import { Structure, StructureAdapter } from '../models/structure';
import { TestQuestion, TestQuestionAdapter } from '../models/testquestion';
import { Report, ReportAdapter } from '../models/report'
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class ExaminationService {

    //currAccessor: Accessor;
    testTimer;
    constructor(
        private http: HttpClient, 
        private fileAdapter: FileAdapter, 
        private structureAdapter: StructureAdapter,
        private testQuestionAdapter: TestQuestionAdapter,
        private reportAdapter: ReportAdapter,
        private accessorAdapter: AccessorAdapter, 
        private cookieService: CookieService,
        private router: Router
        ) {
            //this.currAccessor = new Accessor;
    }
    // public GetAccessor(): Accessor {
    //     return this.currAccessor;
    // }
    public setAccessor(accessor: Accessor): void {
        //this.currAccessor = accessor;
        this.cookieService.set('Type', accessor.Type);
        this.cookieService.set('Name', accessor.Name);
        this.cookieService.set('Email', accessor.Email);
        this.cookieService.set('Id', accessor.Id.toString());
    }
    public registerUser(user: User) {
        return this.http.post("http://localhost:55859/api/Login?Register=" + true, user).pipe(
                map((data) => parseInt(data.toString()))
        );
    }
    public validateLogin(accessor: Accessor) {
        return this.http.post("http://localhost:55859/api/Login", accessor).pipe(
                map((data) => this.accessorAdapter.adapt(data))
        );
    }
    public sendResetMail(email: string) {
        return this.http.get("http://localhost:55859/api/Login?Email=" + email).pipe(
            map((data) => data.toString())
        );
    }
    public changePassword(password: string) {
        return this.http.put("http://localhost:55859/api/Login?Email=" + this.cookieService.get('ResetEmail'), '"' + password + '"', { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).pipe(
            map((data) => data)
        );
    }
    public getFiles(): Observable<File[]> {
        return this.http.get("http://localhost:55859/api/Files").pipe(
                map((data: any[]) => data.map((item) => this.fileAdapter.adapt(item)))
        );
    }
    public addFile(formData: FormData) {
        return this.http.post("http://localhost:55859/api/Files", formData).pipe(
                map((data) => this.fileAdapter.adapt(data))
        );
    }
    public deleteFile(adminId: number, file: File) {
        return this.http.delete("http://localhost:55859/api/Files?AdminId=" + adminId + "&FileId=" + file.Id).pipe(
                map((data) => this.fileAdapter.adapt(data))
        );
    }
    public getStructures(): Observable<Structure[]> {
        return this.http.get("http://localhost:55859/api/TestStructures").pipe(
                map((data: any[]) => data.map((item) => this.structureAdapter.adapt(item)))
        );
    }
    public addStructure(adminId: number, structure: Structure) {
        return this.http.post("http://localhost:55859/api/TestStructures?AdminId=" + adminId, structure).pipe(
                map((data) => this.structureAdapter.adapt(data))
        );
    }
    public updateStructure(adminId: number, structure: Structure) {
        return this.http.put("http://localhost:55859/api/TestStructures?AdminId=" + adminId, structure).pipe(
                map((data) => this.structureAdapter.adapt(data))
        );
    }
    public deleteStructure(adminId: number, structure: Structure) {
        return this.http.delete("http://localhost:55859/api/TestStructures?AdminId=" + adminId + "&TestStructureId=" + structure.Id).pipe(
                map((data) => this.structureAdapter.adapt(data))
        );
    }
    public getTestOptions(userId: number): Observable<Structure[]> {
        return this.http.get("http://localhost:55859/api/TestStructures?UserId=" + userId).pipe(
                map((data: any[]) => data.map((item) => this.structureAdapter.adapt(item)))
        );
    }
    public addTest(userId: number, structure: Structure): Observable<TestQuestion[]> {
        return this.http.get("http://localhost:55859/api/Tests?UserId=" + userId + "&TestStructureId=" + structure.Id).pipe(
                map((data: any[]) => data.map((item) => this.testQuestionAdapter.adapt(item)))
        );
    }
    public setTestTimeOut(minutes: number) {
        clearTimeout(this.testTimer);
        this.testTimer = setTimeout(() => {
            this.endTest(parseInt(this.cookieService.get('Test'))).subscribe((data) => {});
          }, minutes*60*1000);
    }
    public saveUserAnswer(testQuestionId: number, userAnswer: number) {
        return this.http.put("http://localhost:55859/api/Tests?TestQuestionId=" + testQuestionId, userAnswer).pipe(
            map((data) => data)
        );
    }
    public resumeTest(testId: number): Observable<TestQuestion[]> {
        return this.http.get("http://localhost:55859/api/Tests/" + testId).pipe(
                map((data: any[]) => data.map((item) => this.testQuestionAdapter.adapt(item)))
        );
    }
    public endTest(testId: number) {
        clearTimeout(this.testTimer);
        this.cookieService.delete('Test');
        this.cookieService.delete('Time');
        this.router.navigate(['/tests']);
        return this.http.delete("http://localhost:55859/api/Tests?TestId=" + testId).pipe(
            map((data) => data, this.cookieService.set('TestReport', testId.toString()))
        );
    }
    public getAfterTestReport(testId: number) {
        this.cookieService.delete('TestReport');
        return this.http.get("http://localhost:55859/api/Reports?TestId=" + testId).pipe(
            map((data) => this.reportAdapter.adapt(data))
        );
    }
    public getReports(): Observable<Report[]> {
        if (this.cookieService.get('Type') == 'User') {
            return this.http.get("http://localhost:55859/api/Reports?UserId=" + parseInt(this.cookieService.get('Id'))).pipe(
                map((data: any[]) => data.map((item) => this.reportAdapter.adapt(item)))
            );
        }
        else if (this.cookieService.get('Type') == 'Admin') {
            return this.http.get("http://localhost:55859/api/Reports").pipe(
                map((data: any[]) => data.map((item) => this.reportAdapter.adapt(item)))
            );
        }
    }
}