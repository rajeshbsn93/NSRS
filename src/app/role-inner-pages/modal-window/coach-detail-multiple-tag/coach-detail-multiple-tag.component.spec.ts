/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoachDetailMultipleTagComponent } from './coach-detail-multiple-tag.component';

describe('CoachDetailMultipleTagComponent', () => {
  let component: CoachDetailMultipleTagComponent;
  let fixture: ComponentFixture<CoachDetailMultipleTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachDetailMultipleTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachDetailMultipleTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
