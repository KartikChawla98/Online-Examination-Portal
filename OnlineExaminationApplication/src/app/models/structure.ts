import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Structure {
    constructor(
        public Id?: number,
        public Technology?: string,
        public Level?: number,
        public MaxMinutes?: number,
        public NumberOfQuestions?: number,
        public PassingScore?: number,
        public UpdateDate?: Date
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class StructureAdapter implements Adapter<Structure> {
    adapt(item: any): Structure{
        return new Structure(item.Id, item.Technology, item.Level, item.MaxMinutes, 
                            item.NumberOfQuestions, item.PassingScore, new Date(item.UpdateDate));
    }
}