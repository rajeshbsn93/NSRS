import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpsReportComponent } from './ops-report.component';

const OpsReportRoutes:Routes = [
  { path: '' , component: OpsReportComponent},
]

@NgModule({
  imports: [RouterModule.forChild(OpsReportRoutes)],
  exports: [RouterModule]
})
export class OpsReportRoutingModule { }
