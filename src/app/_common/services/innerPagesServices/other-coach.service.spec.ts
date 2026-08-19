/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OtherCoachService } from './other-coach.service';

describe('Service: OtherCoach', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OtherCoachService]
    });
  });

  it('should ...', inject([OtherCoachService], (service: OtherCoachService) => {
    expect(service).toBeTruthy();
  }));
});
