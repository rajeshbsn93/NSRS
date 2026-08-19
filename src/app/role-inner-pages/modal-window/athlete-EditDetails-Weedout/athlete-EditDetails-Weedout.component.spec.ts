/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AthleteEditDetailsWeedoutComponent } from './athlete-EditDetails-Weedout.component';

describe('AthleteEditDetailsWeedoutComponent', () => {
  let component: AthleteEditDetailsWeedoutComponent;
  let fixture: ComponentFixture<AthleteEditDetailsWeedoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteEditDetailsWeedoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteEditDetailsWeedoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
