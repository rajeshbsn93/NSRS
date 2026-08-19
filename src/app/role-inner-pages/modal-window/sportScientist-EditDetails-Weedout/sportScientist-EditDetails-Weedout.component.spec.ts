/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SportScientistEditDetailsWeedoutComponent } from './sportScientist-EditDetails-Weedout.component';

describe('SportScientistEditDetailsWeedoutComponent', () => {
  let component: SportScientistEditDetailsWeedoutComponent;
  let fixture: ComponentFixture<SportScientistEditDetailsWeedoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportScientistEditDetailsWeedoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportScientistEditDetailsWeedoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
