/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoachJoiningReportComponent } from './coach-joining-report.component';

describe('CoachJoiningReportComponent', () => {
  let component: CoachJoiningReportComponent;
  let fixture: ComponentFixture<CoachJoiningReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachJoiningReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachJoiningReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
