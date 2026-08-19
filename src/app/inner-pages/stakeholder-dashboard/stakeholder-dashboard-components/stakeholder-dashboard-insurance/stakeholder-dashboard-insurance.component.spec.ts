/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardInsuranceComponent } from './stakeholder-dashboard-insurance.component';

describe('StakeholderDashboardInsuranceComponent', () => {
  let component: StakeholderDashboardInsuranceComponent;
  let fixture: ComponentFixture<StakeholderDashboardInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
