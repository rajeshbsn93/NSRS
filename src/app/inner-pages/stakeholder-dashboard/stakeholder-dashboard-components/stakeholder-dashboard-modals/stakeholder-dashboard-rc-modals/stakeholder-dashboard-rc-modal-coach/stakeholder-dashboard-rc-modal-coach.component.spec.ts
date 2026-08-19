/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardRcModalCoachComponent } from './stakeholder-dashboard-rc-modal-coach.component';

describe('StakeholderDashboardRcModalCoachComponent', () => {
  let component: StakeholderDashboardRcModalCoachComponent;
  let fixture: ComponentFixture<StakeholderDashboardRcModalCoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardRcModalCoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardRcModalCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
