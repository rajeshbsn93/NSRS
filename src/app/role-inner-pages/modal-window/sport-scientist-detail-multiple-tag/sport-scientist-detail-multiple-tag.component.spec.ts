/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SportScientistDetailMultipleTagComponent } from './sport-scientist-detail-multiple-tag.component';

describe('SportScientistDetailMultipleTagComponent', () => {
  let component: SportScientistDetailMultipleTagComponent;
  let fixture: ComponentFixture<SportScientistDetailMultipleTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportScientistDetailMultipleTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportScientistDetailMultipleTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
