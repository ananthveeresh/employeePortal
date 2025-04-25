import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryFormEntryComponent } from './enquiry-form-entry.component';

describe('EnquiryFormEntryComponent', () => {
  let component: EnquiryFormEntryComponent;
  let fixture: ComponentFixture<EnquiryFormEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnquiryFormEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryFormEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
