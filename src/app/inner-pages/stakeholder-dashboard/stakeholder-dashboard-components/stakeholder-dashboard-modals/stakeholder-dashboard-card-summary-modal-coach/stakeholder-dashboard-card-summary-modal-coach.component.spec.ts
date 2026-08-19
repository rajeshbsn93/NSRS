/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardCardSummaryModalCoachComponent } from './stakeholder-dashboard-card-summary-modal-coach.component';

describe('StakeholderDashboardCardSummaryModalCoachComponent', () => {
  let component: StakeholderDashboardCardSummaryModalCoachComponent;
  let fixture: ComponentFixture<StakeholderDashboardCardSummaryModalCoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardCardSummaryModalCoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardCardSummaryModalCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
