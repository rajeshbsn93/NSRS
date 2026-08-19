/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketingAgencyListComponent } from './ticketing-agency-list.component';

describe('TicketingAgencyListComponent', () => {
  let component: TicketingAgencyListComponent;
  let fixture: ComponentFixture<TicketingAgencyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingAgencyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingAgencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
