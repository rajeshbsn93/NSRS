/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KiaaProposalComponent } from './kiaaProposal.component';

describe('KiaaProposalComponent', () => {
  let component: KiaaProposalComponent;
  let fixture: ComponentFixture<KiaaProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KiaaProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KiaaProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
