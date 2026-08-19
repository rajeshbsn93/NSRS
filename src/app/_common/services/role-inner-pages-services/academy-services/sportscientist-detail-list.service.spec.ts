/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SportscientistDetailListService } from './sportscientist-detail-list.service';

describe('Service: SportscientistDetailList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SportscientistDetailListService]
    });
  });

  it('should ...', inject([SportscientistDetailListService], (service: SportscientistDetailListService) => {
    expect(service).toBeTruthy();
  }));
});
