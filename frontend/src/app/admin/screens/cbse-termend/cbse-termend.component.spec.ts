import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbseTermendComponent } from './cbse-termend.component';

describe('CbseTermendComponent', () => {
  let component: CbseTermendComponent;
  let fixture: ComponentFixture<CbseTermendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbseTermendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CbseTermendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
