/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoachAcademyComponent } from './coach-academy.component';

describe('CoachAcademyComponent', () => {
  let component: CoachAcademyComponent;
  let fixture: ComponentFixture<CoachAcademyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAcademyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
