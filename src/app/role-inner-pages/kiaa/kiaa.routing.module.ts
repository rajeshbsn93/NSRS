import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiaaProposalComponent } from './kiaaProposal/kiaaProposal.component';

const routes: Routes = [
  {
    path: '',
    component: KiaaProposalComponent,
    children: [
      {
        path: '',
        redirectTo: 'kiaaProposals',
        pathMatch: 'full'
      },
      {
        path: 'kiaaProposals',
        component: KiaaProposalComponent
      },

    ]
  },
  // { path: 'monitoring', loadChildren: () => import("./kic-monitoring/kic-monitoring.module").then(m => m.KicMonitoringModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KIAARoutingModule { }
