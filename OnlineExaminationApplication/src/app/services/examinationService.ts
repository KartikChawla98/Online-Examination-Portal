import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';
import { Accessor, AccessorAdapter } from '../models/accessor';
import { File, FileAdapter } from '../models/file';
import { Structure, StructureAdapter } from '../models/structure';
import { TestQuestion, TestQuestionAdapter } from '../models/testquestion';

@Injectable({
    providedIn: 'root',
})
export class ExaminationService {

    //currAccessor: Accessor;
    constructor(
        private http: HttpClient, 
        private fileAdapter: FileAdapter, 
        private structureAdapter: StructureAdapter,
        private testQuestionAdapter: TestQuestionAdapter,
        private accessorAdapter: AccessorAdapter, 
        private cookieService: CookieService
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
    public validateLogin(accessor: Accessor) {
        return this.http.post("http://localhost:55859/api/Login", accessor).pipe(
                map((data) => this.accessorAdapter.adapt(data))
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
    public saveUserAnswer(testQuestionId: number, userAnswer: number) {
        return this.http.put("http://localhost:55859/api/Tests?TestQuestionId=" + testQuestionId, userAnswer).pipe(
            map((data) => data)
        );
    }
    public endTest(testId: number) {
        return this.http.delete("http://localhost:55859/api/Tests?TestId=" + testId).pipe(
            map((data) => data)
        );
    }
}