import { NgModule } from '@angular/core';
import { Routes , RouterModule } from '@angular/router';
import { RoleGuard } from '../_common/_helpers/role.guard';
import { InnerPagesComponent } from './inner-pages.component';
import { KIAAComponent } from './KIAA/KIAA.component';
import { OtherCoachComponent } from './otherCoach/otherCoach.component';
import { SdoDashboardComponent } from './sdo-dashboard/sdo-dashboard.component';
import { SportEventMasterComponent } from './Sport-EventMaster/Sport-EventMaster.component';
import { SportsScientistComponent } from './sports-scientist/sports-scientist.component';
import { CoachJoiningReportComponent } from './coach-joining-report/coach-joining-report.component';

const innerRoutes:Routes = [
  { path: '', component: InnerPagesComponent, children:[
    { path:"sdo-dashboard", canActivate: [RoleGuard], component: SdoDashboardComponent},
    { path:"athlete", canActivate: [RoleGuard], loadChildren: () => import("./athlete/athlete.module").then(event => event.AthleteModule) },
    { path:"sportstrainingcenter", canActivate: [RoleGuard], loadChildren : () => import("./sportsTrainingCenter/sportsTrainingCenter.module").then(event=>event.SportsTrainingCenterModule)},
      { path:"ops-report",canActivate: [RoleGuard], loadChildren : () => import("./ops-report/ops-report.module").then(event=>event.OpsReportModule)},
      { path:"coach", canActivate: [RoleGuard], loadChildren: () => import("./coach/coach.module").then(event=>event.CoachModule)},
    { path:"sportsscientist", canActivate: [RoleGuard], component:SportsScientistComponent},
    { path:"tournament", canActivate: [RoleGuard], loadChildren : () => import("./tournament/tournament.module").then(event=>event.TournamentModule)},
    { path:"kiaa", canActivate: [RoleGuard], component: KIAAComponent},
    { path:"otherCoach",canActivate: [RoleGuard], component: OtherCoachComponent},
    { path:"eventmaster", canActivate: [RoleGuard], component: SportEventMasterComponent},
    {
      path:'stakeholder-dashboard', canActivate: [RoleGuard], loadChildren: ()=> import('./stakeholder-dashboard/stakeholder-dashboard.module').then(m=>m.StakeholderDashboardModule)
    },
    {
      path:'coach-joining-report', canActivate: [RoleGuard], component:CoachJoiningReportComponent
    },
    {
      path:'', loadChildren: ()=> import('./age-fraud-dashboard/age-fraud-dashboard.module').then(m=>m.AgeFraudDashboardModule)
    },
    {
      path:'nada-athlete', canActivate: [RoleGuard], loadChildren: ()=> import('./nada-athlete/nada-athlete.module').then(mod=>mod.NadaAthleteModule)
    }
  ],
},

  
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(innerRoutes)
  ],
  exports:[ RouterModule ],
  providers: [],
})
export class InnerPagesRouteModule { }
