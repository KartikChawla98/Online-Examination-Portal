import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Accessor {
    constructor(
        public Type?: string,
        public Id?: number,
        public Name?: string,
        public Email?: string,
        public Password?: string
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class AccessorAdapter implements Adapter<Accessor> {
    adapt(item: any): Accessor{
        return new Accessor(item.Type, item.Id, item.Name, item.Email);
    }
}