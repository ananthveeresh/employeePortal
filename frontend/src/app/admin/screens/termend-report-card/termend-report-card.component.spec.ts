import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermendReportCardComponent } from './termend-report-card.component';

describe('TermendReportCardComponent', () => {
  let component: TermendReportCardComponent;
  let fixture: ComponentFixture<TermendReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermendReportCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermendReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
