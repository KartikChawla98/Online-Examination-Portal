import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Structure {
    constructor(
        public Id?: number,
        public Name?: string,
        public UploadDate?: Date
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class StructureAdapter implements Adapter<Structure> {
    adapt(item: any): Structure{
        return new Structure(item.Id, item.Name, new Date(item.UpdateDate));
    }
}