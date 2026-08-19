import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KisceStakeholderComponent } from './kisce-stakeholder/kisce-stakeholder.component';
import { KiscePropsalsComponent } from './kisce-propsals/kisce-propsals.component';
import { KisceMonitoringComponent } from './kisce-monitoring/kisce-monitoring.component';
import { KisceTableComponent } from './kisce-components/kisce-table/kisce-table.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { KisceStateTableComponent } from './kisce-components/kisce-state-table/kisce-state-table.component';
import { KisceRcTableComponent } from './kisce-components/kisce-rc-table/kisce-rc-table.component';
import { KisceHoTableComponent } from './kisce-components/kisce-ho-table/kisce-ho-table.component';

const routes: Routes = [
  {
    path: '',
    component: KisceStakeholderComponent,
    children: [

      {
        path: '',
        redirectTo: 'kic-academy',
        pathMatch: 'full'
      },

    ]

  },

  {
    path: 'proposal',
    component: KiscePropsalsComponent
  },

  {
    path: 'monitoring',
    component: KisceMonitoringComponent
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    children: [

      {
        path: '',
        redirectTo: 'kisce-details',
        pathMatch: 'full'
      },
      {
        path: 'kisce-details',
        component: KisceTableComponent
      },
      {
        path: 'kisce-details/:id',
        component: KisceTableComponent
      },
      {
        path: 'kisce-state-details',
        component: KisceStateTableComponent
      },
      {
        path: 'kisce-state-details/:id',
        component: KisceStateTableComponent
      },
      {
        path: 'kisce-rc-details',
        component: KisceRcTableComponent
      },
      {
        path: 'kisce-rc-details/:id',
        component: KisceRcTableComponent
      },
      {
        path: 'kisce-ho-details',
        component: KisceHoTableComponent
      },
      {
        path: 'kisce-ho-details/:id',
        component: KisceHoTableComponent
      },
    ]
  }





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KisceRoutingModule {


}
