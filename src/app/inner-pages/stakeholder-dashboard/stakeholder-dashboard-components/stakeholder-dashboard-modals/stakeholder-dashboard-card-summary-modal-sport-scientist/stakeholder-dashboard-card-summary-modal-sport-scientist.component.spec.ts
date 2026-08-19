/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardCardSummaryModalSportScientistComponent } from './stakeholder-dashboard-card-summary-modal-sport-scientist.component';

describe('StakeholderDashboardCardSummaryModalSportScientistComponent', () => {
  let component: StakeholderDashboardCardSummaryModalSportScientistComponent;
  let fixture: ComponentFixture<StakeholderDashboardCardSummaryModalSportScientistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardCardSummaryModalSportScientistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardCardSummaryModalSportScientistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
