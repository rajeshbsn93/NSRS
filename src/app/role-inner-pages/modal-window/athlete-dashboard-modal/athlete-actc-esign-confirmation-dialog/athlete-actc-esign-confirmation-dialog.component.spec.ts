/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AthleteActcEsignConfirmationDialogComponent } from './athlete-actc-esign-confirmation-dialog.component';

describe('AthleteActcEsignConfirmationDialogComponent', () => {
  let component: AthleteActcEsignConfirmationDialogComponent;
  let fixture: ComponentFixture<AthleteActcEsignConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteActcEsignConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteActcEsignConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
