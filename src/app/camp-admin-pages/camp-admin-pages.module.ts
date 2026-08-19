import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampAdminPagesComponent } from './camp-admin-pages.component';
import { SharedModule } from '../_common/shared.module';
import { CampAdminPagesRoutingModule } from './camp-admin-pages-routing.module';
import { CampAdminDashboardComponent } from './camp-admin-dashboard/camp-admin-dashboard.component';
import { CampComponent } from './camp/camp.component';

@NgModule({
  declarations: [CampAdminPagesComponent, CampAdminDashboardComponent],
  imports: [
    SharedModule,CampAdminPagesRoutingModule,CampComponent
  ],
})
export class CampAdminPagesModule { }
