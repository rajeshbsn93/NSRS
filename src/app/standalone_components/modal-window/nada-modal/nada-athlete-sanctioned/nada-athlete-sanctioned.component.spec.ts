/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NadaAthleteSanctionedComponent } from './nada-athlete-sanctioned.component';

describe('NadaAthleteSanctionedComponent', () => {
  let component: NadaAthleteSanctionedComponent;
  let fixture: ComponentFixture<NadaAthleteSanctionedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NadaAthleteSanctionedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NadaAthleteSanctionedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
