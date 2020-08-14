import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStructuresComponent } from './test-structures.component';

describe('TestStructuresComponent', () => {
  let component: TestStructuresComponent;
  let fixture: ComponentFixture<TestStructuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestStructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
