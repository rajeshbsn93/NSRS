/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CampAdminService } from './camp-admin.service';

describe('Service: Camp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampAdminService]
    });
  });

  it('should ...', inject([CampAdminService], (service: CampAdminService) => {
    expect(service).toBeTruthy();
  }));
});
