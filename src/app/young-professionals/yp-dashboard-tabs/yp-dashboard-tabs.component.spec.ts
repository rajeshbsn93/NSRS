/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { YpDashboardTabsComponent } from './yp-dashboard-tabs.component';

describe('YpDashboardTabsComponent', () => {
  let component: YpDashboardTabsComponent;
  let fixture: ComponentFixture<YpDashboardTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YpDashboardTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YpDashboardTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
