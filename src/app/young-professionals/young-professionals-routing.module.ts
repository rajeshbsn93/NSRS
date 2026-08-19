import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YoungProfessionalsComponent } from './young-professionals.component';
import { YpDashboardComponent } from './yp-dashboard/yp-dashboard.component';
import { YpPendingComponent } from './yp-pending/yp-pending.component';
import { YpApprovedComponent } from './yp-approved/yp-approved.component';
import { YpRejectComponent } from './yp-reject/yp-reject.component';
import { ProcessForm5Component } from './process-form5/process-form5.component';
import { RoleGuard } from '../_common/_helpers/role.guard';
import { YpViewDocumentComponent } from './yp-view-document/yp-view-document.component';

const routes:Routes = [
  {
      path:'', component:YoungProfessionalsComponent,
      children:[
          {
              path:'', redirectTo:'yp-dashboard',pathMatch:'full'
          },
          {
              path:'yp-dashboard',  canActivate:[RoleGuard],  component:YpDashboardComponent,
          }
          // {
          //   path:'yp/approved/:competitionName/:type', component:YpApprovedComponent,
          // },
          // {
          //  path:'yp/pending/:competitionName/:type', component:YpPendingComponent,
          // },
          // {
          //   path:'yp/reject/:competitionName/:type', component:YpRejectComponent,
          // }
          // ,
          //  {
          //  path:'yp/pending/:competitionName/:type', component:YpPendingComponent,
          // }
          ,
          {
            path:'yp/form5/:type', component:YpPendingComponent,
           },
          // {
          //   path:'yp/form5/:competitionName/:type', component:YpPendingComponent,
          //  },
          {
              path:'yp/proccess-form5', component:ProcessForm5Component,
          },
          { 
            path: 'yp/proccess-form5/:form5Id/:playerDetailID', component: ProcessForm5Component 
          },
          { 
            // path: 'yp/form5/approved/:form5Id/:playerDetailID', component: ProcessForm5Component 
            path: 'yp/form5/approve/:form5Id/:playerDetailID', component: ProcessForm5Component 
          },
          { 
            path: 'yp/form5/reject/:form5Id/:playerDetailID', component: ProcessForm5Component 
          },
          {
            path:'yp/view-document/:form5Id', component:YpViewDocumentComponent,
           }
      ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YoungProfessionalsRoutingModule { }
