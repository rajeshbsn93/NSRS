/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EoiProposalComponent } from './eoiProposal.component';

describe('EoiProposalComponent', () => {
  let component: EoiProposalComponent;
  let fixture: ComponentFixture<EoiProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EoiProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoiProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
