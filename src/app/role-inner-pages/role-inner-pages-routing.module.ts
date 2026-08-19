import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../_common/_helpers/role.guard';
import { RoleInnerPagesComponent } from './role-inner-pages.component';
import { OfficialDisciplineEducationGuard } from '../_common/_helpers/official-discipline-education.guard';
import { KisceModule } from './kisce/kisce.module';

const routes: Routes = [
  {
    path: '', component: RoleInnerPagesComponent,
    children: [
      { path: '', loadChildren: () => import('./academy-dashboard/academy-dashboard.module').then(m => m.AcademyDashboardModule) },
      { path: 'mapping-athlete-official', canActivate: [RoleGuard], loadChildren: () => import('./mappingAC/mappingAC.module').then(m => m.MappingACModule) },
      { path: 'athlete-detail', canActivate: [RoleGuard], loadComponent: () => import('./academy-dashboard/athlete-detail/athlete-detail.component').then(m => m.AthleteDetailComponent) },
      { path: 'coach-detail', canActivate: [RoleGuard], loadComponent: () => import('./academy-dashboard/coach-detail/coach-detail.component').then(c => c.CoachDetailComponent) },
      {
        path: 'sportscientist-detail',
        canActivate: [RoleGuard],
        loadComponent: () => import('./academy-dashboard/sport-scientist-detail/sport-scientist-detail.component').then(c => c.SportScientistDetailComponent)
      },
      {
        path: 'athlete-dashboard', canActivate: [RoleGuard],
        loadComponent: () => import('./athlete-dashboard/athlete-dashboard.component').then((mod) => mod.AthleteDashboardComponent)
      },
      {
        path: 'athlete-achievement', canActivate: [RoleGuard], 
        loadComponent: () => import('./athlete-dashboard/athlete-achievement/athlete-achievement.component').then((comp) => comp.AthleteAchievementComponent)
      },
      {
        path: 'athlete-profile', canActivate: [RoleGuard], 
        loadComponent: () => import('./athlete-dashboard/athlet-profile/athlete-profile.component').then((comp) => comp.AthleteProfileComponent)
      },
      {
        path: 'athlete-benefits', canActivate: [RoleGuard], 
        loadComponent: () => import('./athlete-dashboard/athlete-benefits/athlete-benefits.component').then((comp) => comp.AthleteBenefitsComponent)
      },
      {
        path: 'athlete-coach-information', canActivate: [RoleGuard], 
        loadComponent: () => import('./athlete-dashboard/athlete-coach-information/athlete-coach-information.component').then((comp) => comp.AthleteCoachInformationComponent)
      },
      {
        path: 'coach-dashboard', canActivate: [RoleGuard],
        loadComponent: () => import('./coach-dashboard/coach-dashboard.component').then((mod) => mod.CoachDashboardComponent)
      },
      {
        path: 'coach-profile', canActivate: [
          RoleGuard,
          OfficialDisciplineEducationGuard
        ],
        loadComponent: () => import('./coach-dashboard/coach-profile/coach-profile.component').then((mod) => mod.CoachProfileComponent)
      },
      // { 
      //   path: 'coach-details',
      //   loadComponent: () => import('./coach-dashboard/coach-details/coach-details.component').then((mod) => mod.CoachDetailsComponent)
      // },
      // { 
      //   path: 'coach-athletes',
      //   loadComponent: () => import('./coach-dashboard/coach-athletes/coach-athletes.component').then((mod) => mod.CoachAthletesComponent)
      // },
      {
        path: 'sport-scientist-dashboard', canActivate: [RoleGuard],
        loadComponent: () => import('./sports-scientist-dashboard/sports-scientist-dashboard.component').then((comp) => comp.SportsScientistDashboardComponent)
      },
      {
        path: 'sport-scientist-profile', canActivate: [
          RoleGuard,
          OfficialDisciplineEducationGuard
        ],
        loadComponent: () => import('./coach-dashboard/coach-profile/coach-profile.component').then((mod) => mod.CoachProfileComponent)
      },
      {
        path: 'athlete-sport-scientist', canActivate:[RoleGuard], loadComponent: () => import('./sports-scientist-dashboard/athlete-sport-scientist/athlete-sport-scientist.component').then((comp) => comp.AthleteSportScientistComponent)
      },
      {
        path: 'athlete-mapping-sport-scientist', canActivate:[RoleGuard], loadComponent: () => import('../role-inner-pages/sports-scientist-dashboard/athlete-mapping-sport-scientist/athlete-mapping-sport-scientist.component').then((comp) => comp.AthleteMappingSportScientistComponent)
      },
      {
        path: 'coaching-info', canActivate: [
          RoleGuard,
          OfficialDisciplineEducationGuard
        ],
        loadComponent: () => import('./coach-dashboard/coaching-info/coaching-info.component').then((comp) => comp.CoachingInfoComponent)
      },
      {
        path: 'official-support', canActivate: [
          RoleGuard,
          OfficialDisciplineEducationGuard
        ],
        loadComponent: () => import('./coach-dashboard/official-support/official-support.component').then((comp) => comp.OfficialSupportComponent)
      },
      {
        path: 'sport-scientist-info', canActivate: [
          RoleGuard,
          OfficialDisciplineEducationGuard
        ],
        loadComponent: () => import('./sports-scientist-dashboard/sport-scientist-info/sport-scientist-info.component').then((comp) => comp.SportScientistInfoComponent)
      },
      {
        path: 'sport-scientist-achievement', canActivate:[RoleGuard],
        loadComponent: () => import('./sports-scientist-dashboard/sports-scientist-achievement/sports-scientist-achievement.component').then((comp) => comp.SportsScientistAchievementComponent)
      },
      {
        path: 'coach-achievement', canActivate:[RoleGuard],
        loadComponent: () => import('./coach-dashboard/coach-achievement/coach-achievement.component').then((comp) => comp.CoachAchievementComponent)
      },
      { path: 'kic', loadChildren: () => import("./kic/kic.module").then(m => m.KicModule) },
      {path:'kisce', loadChildren:()=>import("./kisce/kisce.module").then(m=>m.KisceModule)},
      {
        path:'other-dashboard',
        canActivate:[
          RoleGuard
        ],
        loadChildren:() => import("./other-role/other-role.module").then((mod)=>mod.OtherRoleModule)
      },
      {path: 'kiaa', canActivate:[RoleGuard], loadChildren: () => import("./kiaa/kiaa.module").then(m => m.KIAAModule) },
      {
        path:'form5', canActivate:[RoleGuard], loadComponent: () => import("./athlete-dashboard/athlete-form-five-list/athlete-form-five-list.component").then((m)=>m.AthleteFormFiveListComponent)
      },
      {
        path:'nodal-officer', canActivate:[RoleGuard], loadChildren: ()=> import('./nodal-officer/nodal-officer.module').then(mod=>mod.NodalOfficerModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleInnerPagesRoutingModule { }
