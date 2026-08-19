/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketingAgencyListConfirmBookingComponent } from './ticketing-agency-list-confirm-booking.component';

describe('TicketingAgencyListConfirmBookingComponent', () => {
  let component: TicketingAgencyListConfirmBookingComponent;
  let fixture: ComponentFixture<TicketingAgencyListConfirmBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingAgencyListConfirmBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingAgencyListConfirmBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
