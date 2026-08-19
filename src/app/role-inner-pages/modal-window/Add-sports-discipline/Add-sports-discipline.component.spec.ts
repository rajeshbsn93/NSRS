/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddSportsDisciplineComponent } from './Add-sports-discipline.component';

describe('AddSportsDisciplineComponent', () => {
  let component: AddSportsDisciplineComponent;
  let fixture: ComponentFixture<AddSportsDisciplineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSportsDisciplineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSportsDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
