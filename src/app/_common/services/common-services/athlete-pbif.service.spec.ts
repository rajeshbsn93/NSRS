/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AthletePbifService } from './athlete-pbif.service';

describe('Service: AthletePbif', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AthletePbifService]
    });
  });

  it('should ...', inject([AthletePbifService], (service: AthletePbifService) => {
    expect(service).toBeTruthy();
  }));
});
