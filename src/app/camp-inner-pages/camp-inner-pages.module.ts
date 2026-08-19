import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampInnerPagesComponent } from './camp-inner-pages.component';
import { SharedModule } from '../_common/shared.module';
import { RoleInnerPagesHeaderComponent } from '../role-inner-pages/layout/role-inner-pages-header/role-inner-pages-header.component';
import { CampInnerPagesRoutingModule } from './camp-inner-pages-routing.module';
import { RoleInnerPagesSidebarComponent } from '../role-inner-pages/layout/role-inner-pages-sidebar/role-inner-pages-sidebar.component';
import { CampDashboardComponent } from './cam-dashboard/cam-dashboard.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CampAthleteComponent } from './camp-athlete/camp-athlete.component';
import { CampProfileComponent } from './camp-profile/camp-profile.component';
@NgModule({
  declarations: [
    CampInnerPagesComponent,CampDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RoleInnerPagesHeaderComponent,
    RoleInnerPagesSidebarComponent,
    CampAthleteComponent,
    CarouselModule,
    CampProfileComponent,
    CampInnerPagesRoutingModule,
  ],  
})
export class CampInnerPagesModule { }
