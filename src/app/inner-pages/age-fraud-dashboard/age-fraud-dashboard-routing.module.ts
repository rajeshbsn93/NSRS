import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AgeFraudDashboardComponent } from "./age-fraud-dashboard.component";
import { ManageAthleteComponent } from "./manage-athlete/manage-athlete.component";
import { RoleGuard } from "src/app/_common/_helpers/role.guard";
const routes:Routes = [
    // {
    //     path:'', redirectTo:'dashboard', pathMatch:'full'
    // },
    {
        path:'dashboard', component:AgeFraudDashboardComponent
    },
    {
        path:'manage-athlete', canActivate:[RoleGuard], component:ManageAthleteComponent
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule]
})

export class AgeFraudDashboardRoutingModule{}