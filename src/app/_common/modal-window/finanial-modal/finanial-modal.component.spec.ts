/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinanialModalComponent } from './finanial-modal.component';

describe('FinanialModalComponent', () => {
  let component: FinanialModalComponent;
  let fixture: ComponentFixture<FinanialModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanialModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
