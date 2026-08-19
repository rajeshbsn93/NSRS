/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageAthleteService } from './manage-athlete.service';

describe('Service: ManageAthlete', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageAthleteService]
    });
  });

  it('should ...', inject([ManageAthleteService], (service: ManageAthleteService) => {
    expect(service).toBeTruthy();
  }));
});
