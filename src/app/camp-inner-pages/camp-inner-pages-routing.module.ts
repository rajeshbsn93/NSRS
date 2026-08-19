import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CampAdminPagesComponent } from "../camp-admin-pages/camp-admin-pages.component";
import { CampDashboardComponent } from "./cam-dashboard/cam-dashboard.component";
import { RoleGuard } from "../_common/_helpers/role.guard";


const routes:Routes = [
    {path:'', component:CampAdminPagesComponent,
    children:[
        {path:'',redirectTo:'camp-dashboard',pathMatch:'full'},
        {path:'camp-dashboard', canActivate:[RoleGuard], component:CampDashboardComponent},
        {path:'camp-athlete', canActivate:[RoleGuard], loadComponent:()=> import('./camp-athlete/camp-athlete.component').then((comp)=>comp.CampAthleteComponent)},
        {path:'camp-coach', canActivate:[RoleGuard], loadComponent: ()=> import('./camp-coach/camp-coach.component').then((comp)=>comp.CampCoachComponent)},
        {path:'camp-ss', canActivate:[RoleGuard], loadComponent: ()=> import('./camp-sport-scientist/camp-sport-scientist.component').then((comp)=>comp.CampSportScientistComponent)},
        {path:'camp-profile', canActivate:[RoleGuard], loadComponent: ()=> import('./camp-profile/camp-profile.component').then((comp)=>comp.CampProfileComponent)}
    ]
}
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class CampInnerPagesRoutingModule{}
