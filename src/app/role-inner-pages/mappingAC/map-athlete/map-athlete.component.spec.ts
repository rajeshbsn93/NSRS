/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MapAthleteComponent } from './map-athlete.component';

describe('MapAthleteComponent', () => {
  let component: MapAthleteComponent;
  let fixture: ComponentFixture<MapAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAthleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
