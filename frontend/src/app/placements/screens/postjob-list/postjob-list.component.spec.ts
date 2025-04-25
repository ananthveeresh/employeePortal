import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostjobListComponent } from './postjob-list.component';

describe('PostjobListComponent', () => {
  let component: PostjobListComponent;
  let fixture: ComponentFixture<PostjobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostjobListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostjobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
