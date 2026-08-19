/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketingAgencyListPendingBookingComponent } from './ticketing-agency-list-pending-booking.component';

describe('TicketingAgencyListPendingBookingComponent', () => {
  let component: TicketingAgencyListPendingBookingComponent;
  let fixture: ComponentFixture<TicketingAgencyListPendingBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingAgencyListPendingBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingAgencyListPendingBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
