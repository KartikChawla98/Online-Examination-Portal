import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class File {
    constructor(
        public Id?: number,
        public Name?: string,
        public UploadDate?: Date
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class FileAdapter implements Adapter<File> {
    adapt(item: any): File{
        return new File(item.Id, item.Name, new Date(item.UpdateDate));
    }
}