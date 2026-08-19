import { NgModule } from '@angular/core';
import { NodalOfficerComponent } from './nodal-officer.component';
import { NodalOfficerRoutingModule } from './nodal-officer-routing.module';
import { ManageAthleteComponent } from './manage-athlete/manage-athlete.component';
import { CommonModule } from '@angular/common';
import { AthleteDashboardSidebarComponent } from '../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';
import { NodalOfficerProfileComponent } from './nodal-officer-profile/nodal-officer-profile.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { ManageAthletePendingComponent } from './manage-athlete-pending/manage-athlete-pending.component';
import { ManageAthleteVerifiedComponent } from './manage-athlete-verified/manage-athlete-verified.component';
import { ManageAthleteRejectComponent } from './manage-athlete-reject/manage-athlete-reject.component';
import { LoaderComponent } from "../../standalone_components/loader/loader.component";

@NgModule({
  imports: [
    CommonModule,
    AthleteDashboardSidebarComponent,
    NodalOfficerRoutingModule,
    MaterialModule,
    LoaderComponent
],
  declarations: [
    NodalOfficerComponent,
    ManageAthleteComponent,
    NodalOfficerProfileComponent,
    ManageAthletePendingComponent,
    ManageAthleteVerifiedComponent,
    ManageAthleteRejectComponent
  ],
})
export class NodalOfficerModule{ }
