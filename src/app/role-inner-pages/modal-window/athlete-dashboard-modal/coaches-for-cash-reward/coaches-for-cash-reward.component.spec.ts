/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoachesForCashRewardComponent } from './coaches-for-cash-reward.component';

describe('CoachesForCashRewardComponent', () => {
  let component: CoachesForCashRewardComponent;
  let fixture: ComponentFixture<CoachesForCashRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachesForCashRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachesForCashRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
