import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicAddPcaAttendanceComponent } from './kic-add-pca-attendance.component';

describe('KicAddPcaAttendanceComponent', () => {
  let component: KicAddPcaAttendanceComponent;
  let fixture: ComponentFixture<KicAddPcaAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicAddPcaAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicAddPcaAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
