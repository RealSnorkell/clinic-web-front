import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPostComponent } from './appointment-post.component';

describe('AppointmentPostComponent', () => {
  let component: AppointmentPostComponent;
  let fixture: ComponentFixture<AppointmentPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
