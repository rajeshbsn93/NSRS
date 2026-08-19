import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketingAgencyComponent } from './ticketing-agency.component';
import { SharedModule } from '../_common/shared.module';
import { TicketingAgencyRoutingModule } from './ticketing-agency-routing.module';
import { TicketingAgencyDashboardComponent } from './ticketing-agency-dashboard/ticketing-agency-dashboard.component';
import { TicketingAgencyListComponent } from './ticketing-agency-list/ticketing-agency-list.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MaterialModule } from '../_common/material.module';
import { TicketingAgencyListPendingBookingComponent } from './ticketing-agency-list-pending-booking/ticketing-agency-list-pending-booking.component';
import { TicketingAgencyListConfirmBookingComponent } from './ticketing-agency-list-confirm-booking/ticketing-agency-list-confirm-booking.component';
import { LoaderComponent } from '../standalone_components/loader/loader.component';

@NgModule({
  declarations: [
    TicketingAgencyComponent,
    TicketingAgencyDashboardComponent,
    TicketingAgencyListComponent,
    TicketingAgencyListPendingBookingComponent,
    TicketingAgencyListConfirmBookingComponent
  ],
  imports: [
    SharedModule,
    TicketingAgencyRoutingModule,
    MatTabsModule,
    MaterialModule,
    LoaderComponent
  ],
})
export class TicketingAgencyModule { }
