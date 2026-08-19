/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StakeholderDashboardService } from './stakeholder-dashboard.service';

describe('Service: StakeholderDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StakeholderDashboardService]
    });
  });

  it('should ...', inject([StakeholderDashboardService], (service: StakeholderDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
