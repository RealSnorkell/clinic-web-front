import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPostComponent } from './patient-post.component';

describe('PatientPostComponent', () => {
  let component: PatientPostComponent;
  let fixture: ComponentFixture<PatientPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
