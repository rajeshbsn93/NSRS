/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AcademySharableService } from './academySharable.service';

describe('Service: AcademySharable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcademySharableService]
    });
  });

  it('should ...', inject([AcademySharableService], (service: AcademySharableService) => {
    expect(service).toBeTruthy();
  }));
});
