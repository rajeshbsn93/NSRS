/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardInsuranceDisciplineModalComponent } from './stakeholder-dashboard-insurance-discipline-modal.component';

describe('StakeholderDashboardInsuranceDisciplineModalComponent', () => {
  let component: StakeholderDashboardInsuranceDisciplineModalComponent;
  let fixture: ComponentFixture<StakeholderDashboardInsuranceDisciplineModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardInsuranceDisciplineModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardInsuranceDisciplineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
