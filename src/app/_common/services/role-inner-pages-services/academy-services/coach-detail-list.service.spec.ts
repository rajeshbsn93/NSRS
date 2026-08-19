/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoachDetailListService } from './coach-detail-list.service';

describe('Service: CoachDetailList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoachDetailListService]
    });
  });

  it('should ...', inject([CoachDetailListService], (service: CoachDetailListService) => {
    expect(service).toBeTruthy();
  }));
});
