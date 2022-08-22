import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HighchartsChartModule } from "highcharts-angular";
import { CarouselModule } from "ngx-owl-carousel-o";
import { SdoRoutingModule } from "./sdo-routing.module";
import { SdoComponent } from "./sdo.component";
import { SdoDashboardComponent } from './sdo-dashboard/sdo-dashboard.component';


@NgModule({
    declarations: [
        SdoComponent,
        SdoDashboardComponent
    ],
    imports: [
        CommonModule,
        SdoRoutingModule,
        CarouselModule,
        HighchartsChartModule
    ]
})

export class SdoModule{}