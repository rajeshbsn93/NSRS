import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StakeholderDashboardComponent } from "./stakeholder-dashboard.component";

const routes:Routes = [
    {
        path:'', component:StakeholderDashboardComponent
    }
]
@NgModule({
   imports:[
    RouterModule.forChild(routes)
   ],
   exports:[
    RouterModule
   ]
})
export class StakeholderDashboardRoutingModule{}