import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdinfoComponent } from './stdinfo.component';

describe('StdinfoComponent', () => {
  let component: StdinfoComponent;
  let fixture: ComponentFixture<StdinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StdinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StdinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
