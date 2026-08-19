/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardOverviewCommonModalsComponent } from './stakeholder-dashboard-overview-common-modals.component';

describe('StakeholderDashboardOverviewCommonModalsComponent', () => {
  let component: StakeholderDashboardOverviewCommonModalsComponent;
  let fixture: ComponentFixture<StakeholderDashboardOverviewCommonModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardOverviewCommonModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardOverviewCommonModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
