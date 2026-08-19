/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddInsuranceAthleteComponent } from './addInsuranceAthlete.component';

describe('AddInsuranceAthleteComponent', () => {
  let component: AddInsuranceAthleteComponent;
  let fixture: ComponentFixture<AddInsuranceAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsuranceAthleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsuranceAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
