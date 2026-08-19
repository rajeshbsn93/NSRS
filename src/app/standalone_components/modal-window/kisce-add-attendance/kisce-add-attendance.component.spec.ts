import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceAddAttendanceComponent } from './kisce-add-attendance.component';

describe('KisceAddAttendanceComponent', () => {
  let component: KisceAddAttendanceComponent;
  let fixture: ComponentFixture<KisceAddAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceAddAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceAddAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
