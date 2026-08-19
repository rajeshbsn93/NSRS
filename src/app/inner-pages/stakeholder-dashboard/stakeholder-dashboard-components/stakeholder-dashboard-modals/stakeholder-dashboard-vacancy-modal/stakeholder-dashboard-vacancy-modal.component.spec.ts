/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardVacancyModalComponent } from './stakeholder-dashboard-vacancy-modal.component';

describe('StakeholderDashboardVacancyModalComponent', () => {
  let component: StakeholderDashboardVacancyModalComponent;
  let fixture: ComponentFixture<StakeholderDashboardVacancyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardVacancyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardVacancyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
