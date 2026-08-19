/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AthleteDetailListService } from './athlete-detail-list.service';

describe('Service: AthleteDetailList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AthleteDetailListService]
    });
  });

  it('should ...', inject([AthleteDetailListService], (service: AthleteDetailListService) => {
    expect(service).toBeTruthy();
  }));
});
