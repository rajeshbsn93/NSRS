/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoleTransferService } from './role-transfer.service';

describe('Service: RoleTransfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleTransferService]
    });
  });

  it('should ...', inject([RoleTransferService], (service: RoleTransferService) => {
    expect(service).toBeTruthy();
  }));
});
