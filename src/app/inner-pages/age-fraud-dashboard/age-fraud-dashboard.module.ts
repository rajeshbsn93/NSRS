import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgeFraudDashboardComponent } from './age-fraud-dashboard.component';
import { AgeFraudDashboardRoutingModule } from './age-fraud-dashboard-routing.module';
import { ManageAthleteComponent } from './manage-athlete/manage-athlete.component';
import { ManageAthletePendingComponent } from './manage-athlete-pending/manage-athlete-pending.component';
import { ManageAthleteVerifiedComponent } from './manage-athlete-verified/manage-athlete-verified.component';
import { ManageAthleteRejectComponent } from './manage-athlete-reject/manage-athlete-reject.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LoaderComponent,
    AgeFraudDashboardRoutingModule
  ],
  declarations: [
    AgeFraudDashboardComponent,
    ManageAthleteComponent,
    ManageAthletePendingComponent,
    ManageAthleteVerifiedComponent,
    ManageAthleteRejectComponent,

  ]
})
export class AgeFraudDashboardModule { }
