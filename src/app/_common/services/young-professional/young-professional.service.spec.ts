import { TestBed } from '@angular/core/testing';

import { YoungProfessionalService } from './young-professional.service';

describe('YoungProfessionalService', () => {
  let service: YoungProfessionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoungProfessionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
