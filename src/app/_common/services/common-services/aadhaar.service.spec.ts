/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AadhaarService } from './aadhaar.service';

describe('Service: Aadhaar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AadhaarService]
    });
  });

  it('should ...', inject([AadhaarService], (service: AadhaarService) => {
    expect(service).toBeTruthy();
  }));
});
