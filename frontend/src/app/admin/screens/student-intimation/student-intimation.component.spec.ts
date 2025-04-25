import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentIntimationComponent } from './student-intimation.component';

describe('StudentIntimationComponent', () => {
  let component: StudentIntimationComponent;
  let fixture: ComponentFixture<StudentIntimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentIntimationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentIntimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
