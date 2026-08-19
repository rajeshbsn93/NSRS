import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademyDashboardRoutingModule } from './academy-dashboard.routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AcademyDashboardComponent } from './academy-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    AcademyDashboardRoutingModule,
    HighchartsChartModule,
    CarouselModule,
    LoaderComponent
  ],
  declarations: [AcademyDashboardComponent]
})

export class AcademyDashboardModule { }
