import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { HighchartsChartModule } from 'highcharts-angular';

import { AdminUserRoutingModule } from './adminUser-routing.module';
import { AdminUserComponent } from './adminUser.component';
//import { SdoComponent } from './sdo/sdo.component';

@NgModule({
  declarations: [
    AdminUserComponent,
    //SdoComponent
  ],
  imports: [
    CommonModule,
    AdminUserRoutingModule,
    CarouselModule,
    HighchartsChartModule
  ]
})
export class AdminUserModule { }
