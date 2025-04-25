import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermendEditOrUpdateComponent } from './termend-edit-or-update.component';

describe('TermendEditOrUpdateComponent', () => {
  let component: TermendEditOrUpdateComponent;
  let fixture: ComponentFixture<TermendEditOrUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermendEditOrUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermendEditOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
