/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardRcModalAthleteComponent } from './stakeholder-dashboard-rc-modal-athlete.component';

describe('StakeholderDashboardRcModalAthleteComponent', () => {
  let component: StakeholderDashboardRcModalAthleteComponent;
  let fixture: ComponentFixture<StakeholderDashboardRcModalAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardRcModalAthleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardRcModalAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
