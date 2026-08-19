import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnerPagesComponent } from './inner-pages.component';
import { SharedModule } from '../_common/shared.module';
import { InnerPagesRouteModule } from './inner-pages-route.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { SdoDashboardComponent } from './sdo-dashboard/sdo-dashboard.component';
import {MatDialogModule} from '@angular/material/dialog'

import { SportsScientistComponent } from './sports-scientist/sports-scientist.component';
import { KIAAComponent } from './KIAA/KIAA.component';
import { OtherCoachComponent } from './otherCoach/otherCoach.component';
import { SportEventMasterComponent } from './Sport-EventMaster/Sport-EventMaster.component';
import { MaterialModule } from '../_common/material.module';
import { CoachJoiningReportComponent } from './coach-joining-report/coach-joining-report.component';
import { DisableIfRoleDirective } from '../standalone_components/directives/disable-if-role.directive';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InnerPagesRouteModule,
    HighchartsChartModule,
    MatDialogModule,
    MaterialModule,
    DisableIfRoleDirective

  ],
  declarations: [
    InnerPagesComponent,
    SdoDashboardComponent,
    SportsScientistComponent,
    KIAAComponent,
    OtherCoachComponent,
    SportEventMasterComponent,
    CoachJoiningReportComponent
  ],
  
})
export class InnerPagesModule { }
