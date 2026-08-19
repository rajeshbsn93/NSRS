/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AthleteDetailMultipleTagComponent } from './athlete-detail-multiple-tag.component';

describe('AthleteDetailMultipleTagComponent', () => {
  let component: AthleteDetailMultipleTagComponent;
  let fixture: ComponentFixture<AthleteDetailMultipleTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteDetailMultipleTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDetailMultipleTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
