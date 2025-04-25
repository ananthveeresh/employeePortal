import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdExamAdditionalDetailsComponent } from './std-exam-additional-details.component';

describe('StdExamAdditionalDetailsComponent', () => {
  let component: StdExamAdditionalDetailsComponent;
  let fixture: ComponentFixture<StdExamAdditionalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StdExamAdditionalDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StdExamAdditionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
