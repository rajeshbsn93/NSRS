/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoachEditDetailsWeedoutComponent } from './coach-EditDetails-Weedout.component';

describe('CoachEditDetailsWeedoutComponent', () => {
  let component: CoachEditDetailsWeedoutComponent;
  let fixture: ComponentFixture<CoachEditDetailsWeedoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachEditDetailsWeedoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachEditDetailsWeedoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
