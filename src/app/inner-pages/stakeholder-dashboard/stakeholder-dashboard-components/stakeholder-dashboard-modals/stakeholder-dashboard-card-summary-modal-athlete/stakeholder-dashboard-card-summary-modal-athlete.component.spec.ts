/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardCardSummaryModalAthleteComponent } from './stakeholder-dashboard-card-summary-modal-athlete.component';

describe('StakeholderDashboardCardSummaryModalAthleteComponent', () => {
  let component: StakeholderDashboardCardSummaryModalAthleteComponent;
  let fixture: ComponentFixture<StakeholderDashboardCardSummaryModalAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardCardSummaryModalAthleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardCardSummaryModalAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
