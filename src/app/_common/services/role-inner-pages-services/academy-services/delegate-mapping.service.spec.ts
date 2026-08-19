/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { DelegateMappingService } from './delegate-mapping.service';

describe('Service: DelegateMapping', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DelegateMappingService]
    });
  });

  it('should ...', inject([DelegateMappingService], (service: DelegateMappingService) => {
    expect(service).toBeTruthy();
  }));
});
