/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AadhaarVerifyDialogComponent } from './aadhaar-verify-dialog.component';

describe('AadhaarVerifyDialogComponent', () => {
  let component: AadhaarVerifyDialogComponent;
  let fixture: ComponentFixture<AadhaarVerifyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AadhaarVerifyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AadhaarVerifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
