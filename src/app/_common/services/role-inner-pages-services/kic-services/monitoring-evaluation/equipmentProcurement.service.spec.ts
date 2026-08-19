/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EquipmentProcurementService } from './equipmentProcurement.service';

describe('Service: EquipmentProcurement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipmentProcurementService]
    });
  });

  it('should ...', inject([EquipmentProcurementService], (service: EquipmentProcurementService) => {
    expect(service).toBeTruthy();
  }));
});
