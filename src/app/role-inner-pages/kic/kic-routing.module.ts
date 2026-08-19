import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance/attendance.component';
import { ReportsComponent } from './reports/reports.component';
import { KicMonitoringComponent } from './kic-monitoring/kic-monitoring.component';
import { KicTableComponent } from './kic-components/kic-table/kic-table.component';
import { KicStateTableComponent } from './kic-components/kic-state-table/kic-state-table.component';
import { KicRcTableComponent } from './kic-components/kic-rc-table/kic-rc-table.component';
import { KicHoTableComponent } from './kic-components/kic-ho-table/kic-ho-table.component';
import { KicAcademyComponent } from './kic-components/kic-academy/kic-academy.component';
import { KicStakeholderComponent } from './kic-stakeholder/kic-stakeholder.component';
import { KicDashboardComponent } from './kic-dashboard/kic-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: KicStakeholderComponent,
    children: [

      {
        path: '',
        redirectTo: 'kic-academy',
        pathMatch: 'full'
      },
      {
        path: 'kic-academy',
        component: KicAcademyComponent
      },
    ]
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    children: [

      {
        path: '',
        redirectTo: 'kic-details',
        pathMatch: 'full'
      },
      {
        path: 'kic-details',
        component: KicTableComponent
      },
      {
        path: 'kic-details/:id',
        component: KicTableComponent
      },
      {
        path: 'kic-state-details',
        component: KicStateTableComponent
      },
      {
        path: 'kic-state-details/:id',
        component: KicStateTableComponent
      },
      {
        path: 'kic-rc-details',
        component: KicRcTableComponent
      },
      {
        path: 'kic-rc-details/:id',
        component: KicRcTableComponent
      },
      {
        path: 'kic-ho-details',
        component: KicHoTableComponent
      },
      {
        path: 'kic-ho-details/:id',
        component: KicHoTableComponent
      },
    ]
  },

  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'monitoring',
    component: KicMonitoringComponent
  },
  {
    path: 'kic-dashboard',
    component: KicDashboardComponent
  },
  // { path: 'monitoring', loadChildren: () => import("./kic-monitoring/kic-monitoring.module").then(m => m.KicMonitoringModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KicRoutingModule { }
