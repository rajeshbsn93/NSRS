/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AcademySignupComponent } from './academy-signup.component';

describe('AcademySignupComponent', () => {
  let component: AcademySignupComponent;
  let fixture: ComponentFixture<AcademySignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademySignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademySignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
