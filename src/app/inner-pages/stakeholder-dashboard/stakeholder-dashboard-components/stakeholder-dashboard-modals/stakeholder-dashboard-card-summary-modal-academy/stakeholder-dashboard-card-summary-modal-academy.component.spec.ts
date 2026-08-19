/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardCardSummaryModalAcademyComponent } from './stakeholder-dashboard-card-summary-modal-academy.component';

describe('StakeholderDashboardCardSummaryModalAcademyComponent', () => {
  let component: StakeholderDashboardCardSummaryModalAcademyComponent;
  let fixture: ComponentFixture<StakeholderDashboardCardSummaryModalAcademyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardCardSummaryModalAcademyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardCardSummaryModalAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
