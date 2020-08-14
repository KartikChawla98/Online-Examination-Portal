import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { File, FileAdapter } from '../models/file';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class ExaminationService {
    constructor(private http: HttpClient, private fileAdapter: FileAdapter) {
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
    public deleteFile(file: File) {
        return this.http.delete("http://localhost:55859/api/Files/" + file.Id).pipe(
                map((data) => this.fileAdapter.adapt(data))
        );
    }
}