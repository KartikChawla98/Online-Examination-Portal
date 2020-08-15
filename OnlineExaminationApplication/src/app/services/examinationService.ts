import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { File, FileAdapter } from '../models/file';
import { Accessor, AccessorAdapter } from '../models/accessor';
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class ExaminationService {

    constructor(private http: HttpClient, private fileAdapter: FileAdapter, 
        private accessorAdapter: AccessorAdapter, private cookieService: CookieService) {
    }
    public GetAccessor(): void {
        //return this.currAccessor.Id;
    }
    public setAccessor(accessor: Accessor): void {
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
}