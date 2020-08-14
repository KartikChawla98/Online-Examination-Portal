import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFilesComponent } from './question-files.component';

describe('QuestionFilesComponent', () => {
  let component: QuestionFilesComponent;
  let fixture: ComponentFixture<QuestionFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
