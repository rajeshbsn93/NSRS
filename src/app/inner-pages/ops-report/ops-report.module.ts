import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpsReportRoutingModule } from './ops-report-routing.module';
import { OpsReportComponent } from './ops-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MatSelectSearchModule } from 'mat-select-search';
import { OpsAthleteCssComponent } from './ops-athlete-css/ops-athlete-css.component';
import { OpsCoachCssComponent } from './ops-coach-css/ops-coach-css.component';
import { OpsFilterComponent } from './ops-filter/ops-filter.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    OpsReportComponent,
    OpsAthleteCssComponent,
    OpsCoachCssComponent,
    OpsFilterComponent,
  ],
  imports: [
    CommonModule,
    OpsReportRoutingModule,
    MaterialModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,  
    LoaderComponent ,
    MatSelectSearchModule  ,
    MatTableModule ,
    MatPaginatorModule 
  ]
})
export class OpsReportModule { }
