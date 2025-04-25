import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExammarksPosttoAnalysisComponent } from './exammarks-postto-analysis.component';

describe('ExammarksPosttoAnalysisComponent', () => {
  let component: ExammarksPosttoAnalysisComponent;
  let fixture: ComponentFixture<ExammarksPosttoAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExammarksPosttoAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExammarksPosttoAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
