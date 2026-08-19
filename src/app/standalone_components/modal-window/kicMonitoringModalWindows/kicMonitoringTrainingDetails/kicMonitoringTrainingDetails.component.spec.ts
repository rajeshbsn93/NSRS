/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KicMonitoringTrainingDetailsComponent } from './kicMonitoringTrainingDetails.component';

describe('KicMonitoringTrainingDetailsComponent', () => {
  let component: KicMonitoringTrainingDetailsComponent;
  let fixture: ComponentFixture<KicMonitoringTrainingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KicMonitoringTrainingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KicMonitoringTrainingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
