import { TestBed } from '@angular/core/testing';

import { KicAttendanceService } from './kic-attendance.service';

describe('KicAttendanceService', () => {
  let service: KicAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KicAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
