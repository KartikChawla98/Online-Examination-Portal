import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";

export class Question {
    constructor(
        public QuestionString?: string,
        public Option1?: string,
        public Option2?: string,
        public Option3?: string,
        public Option4?: string,
        public CorrectOption?: number
    ) {}
}
export class TestQuestion {
    constructor(
        public Id?: number,
        public TestId?: number,
        public UserAnswer?: number,
        public Question?: Question
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class TestQuestionAdapter implements Adapter<TestQuestion> {
    adapt(item: any): TestQuestion {
        return new TestQuestion(item.Id, item.TestId, item.UserAnswer, item.Question);
    }
}
