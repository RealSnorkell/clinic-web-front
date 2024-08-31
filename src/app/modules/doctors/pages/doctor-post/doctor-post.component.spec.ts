import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorPostComponent } from './doctor-post.component';

describe('DoctorPostComponent', () => {
  let component: DoctorPostComponent;
  let fixture: ComponentFixture<DoctorPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorPostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
