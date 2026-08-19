/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddCoachesForCashRewardComponent } from './add-coaches-for-cash-reward.component';

describe('AddCoachesForCashRewardComponent', () => {
  let component: AddCoachesForCashRewardComponent;
  let fixture: ComponentFixture<AddCoachesForCashRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCoachesForCashRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCoachesForCashRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
