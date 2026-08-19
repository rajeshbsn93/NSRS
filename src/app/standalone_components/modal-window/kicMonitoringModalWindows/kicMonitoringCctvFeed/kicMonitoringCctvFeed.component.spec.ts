/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KicMonitoringCctvFeedComponent } from './kicMonitoringCctvFeed.component';

describe('KicMonitoringCctvFeedComponent', () => {
  let component: KicMonitoringCctvFeedComponent;
  let fixture: ComponentFixture<KicMonitoringCctvFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KicMonitoringCctvFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KicMonitoringCctvFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
