import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";
import { Structure } from './structure';
import { TestQuestion, Question, TestQuestionAdapter } from './testquestion';
import { User } from './user';

export class Report {
    constructor(
        public Id?: number,
        public StartTime?: Date,
        public EndTime?: Date,
        public Score?: number,
        public Result?: string,
        public Structure?: Structure,
        public User?: User,
        public TestQuestions?: TestQuestion[]
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class ReportAdapter implements Adapter<Report> {
    adapt(item: any): Report {
        return new Report(item.Id, new Date(item.StartTime), new Date(item.EndTime), item.Score!=null ? item.Score: 0, item.Result==true ? "Pass": "Fail", item.TestStructure, item.User, item.TestQuestions)
    }
}
