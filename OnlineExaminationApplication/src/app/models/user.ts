export class User {
    constructor(
        public Id?: number,
        public FullName?: string,
        public Email?: string,
        public Password?: string,
        public DOB?: Date,
        public Contact?: string,
        public City?: string,
        public State?: string,
        public HighestQualification?: string,
        public CompletionYear?: number
    ) {}
}