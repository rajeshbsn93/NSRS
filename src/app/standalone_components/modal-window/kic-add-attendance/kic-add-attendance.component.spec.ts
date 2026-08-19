import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicAddAttendanceComponent } from './kic-add-attendance.component';

describe('KicAddAttendanceComponent', () => {
  let component: KicAddAttendanceComponent;
  let fixture: ComponentFixture<KicAddAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KicAddAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicAddAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
