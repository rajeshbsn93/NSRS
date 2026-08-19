/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonSharableService } from './commonSharable.service';

describe('Service: CommonSharable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonSharableService]
    });
  });

  it('should ...', inject([CommonSharableService], (service: CommonSharableService) => {
    expect(service).toBeTruthy();
  }));
});
