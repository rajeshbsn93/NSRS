/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardRcModalSportScientistComponent } from './stakeholder-dashboard-rc-modal-sport-scientist.component';

describe('StakeholderDashboardRcModalSportScientistComponent', () => {
  let component: StakeholderDashboardRcModalSportScientistComponent;
  let fixture: ComponentFixture<StakeholderDashboardRcModalSportScientistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardRcModalSportScientistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardRcModalSportScientistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
