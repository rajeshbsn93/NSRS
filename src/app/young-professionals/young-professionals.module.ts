import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoungProfessionalsRoutingModule } from './young-professionals-routing.module';
import { YoungProfessionalsComponent } from './young-professionals.component';
import { YpDashboardComponent } from './yp-dashboard/yp-dashboard.component';
import { SharedModule } from '../_common/shared.module';
import { YpPendingComponent } from './yp-pending/yp-pending.component';
import { YpApprovedComponent } from './yp-approved/yp-approved.component';
import { YpRejectComponent } from './yp-reject/yp-reject.component';
import { YpViewDocumentComponent } from './yp-view-document/yp-view-document.component';
import { YpCommonPopupComponent } from './yp-common-popup/yp-common-popup.component';
import { MatSortModule } from '@angular/material/sort';
import { MaterialModule } from '../_common/material.module';
import { ProcessForm5Component } from './process-form5/process-form5.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';
import { HighchartsChartModule } from 'highcharts-angular';
import { LoaderComponent } from '../standalone_components/loader/loader.component';
import { DashboardBarCartComponent } from './dashboard-bar-cart/dashboard-bar-cart.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MenuListComponent } from '../standalone_components/Layout/menu-list/menu-list.component';
import { YpDashboardTabsComponent } from './yp-dashboard-tabs/yp-dashboard-tabs.component';


@NgModule({
  declarations: [
    YoungProfessionalsComponent,
    YpDashboardComponent,
    YpPendingComponent,
    YpApprovedComponent,
    YpRejectComponent,
    YpViewDocumentComponent,
    YpCommonPopupComponent,
    ProcessForm5Component,
    DashboardBarCartComponent,
    YpDashboardTabsComponent
  ],
  imports: [
    SharedModule,
    MatSortModule ,
    MaterialModule,
    MatDialogModule,
    YoungProfessionalsRoutingModule,
    MatBadgeModule,
    HighchartsChartModule,
    LoaderComponent,
    MatSidenavModule,
    MenuListComponent,
  ]
})
export class YoungProfessionalsModule { }
