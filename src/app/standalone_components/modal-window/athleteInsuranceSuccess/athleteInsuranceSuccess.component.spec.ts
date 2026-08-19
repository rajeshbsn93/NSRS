/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AthleteInsuranceSuccessComponent } from './athleteInsuranceSuccess.component';

describe('AthleteInsuranceSuccessComponent', () => {
  let component: AthleteInsuranceSuccessComponent;
  let fixture: ComponentFixture<AthleteInsuranceSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteInsuranceSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteInsuranceSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
