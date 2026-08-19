/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddInsuranceAthleteServiceService } from './addInsuranceAthleteService.service';

describe('Service: AddInsuranceAthleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddInsuranceAthleteServiceService]
    });
  });

  it('should ...', inject([AddInsuranceAthleteServiceService], (service: AddInsuranceAthleteServiceService) => {
    expect(service).toBeTruthy();
  }));
});
