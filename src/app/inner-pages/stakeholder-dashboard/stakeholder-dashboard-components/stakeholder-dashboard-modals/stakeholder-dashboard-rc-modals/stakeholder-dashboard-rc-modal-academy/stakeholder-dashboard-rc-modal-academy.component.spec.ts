/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StakeholderDashboardRcModalAcademyComponent } from './stakeholder-dashboard-rc-modal-academy.component';

describe('StakeholderDashboardRcModalAcademyComponent', () => {
  let component: StakeholderDashboardRcModalAcademyComponent;
  let fixture: ComponentFixture<StakeholderDashboardRcModalAcademyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardRcModalAcademyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardRcModalAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
