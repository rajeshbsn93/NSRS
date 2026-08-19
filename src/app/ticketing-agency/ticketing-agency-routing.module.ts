import { RouterModule, Routes } from "@angular/router";
import { TicketingAgencyComponent } from "./ticketing-agency.component";
import { NgModule } from "@angular/core";
import { TicketingAgencyDashboardComponent } from "./ticketing-agency-dashboard/ticketing-agency-dashboard.component";
import { TicketingAgencyListComponent } from "./ticketing-agency-list/ticketing-agency-list.component";
import { RoleGuard } from "../_common/_helpers/role.guard";


const routes:Routes = [
    {
        path:'', component:TicketingAgencyComponent,
        children:[
            {
                path:'', redirectTo:'ticketing-agency-dashboard',pathMatch:'full'
            },
            {
                path:'ticketing-agency-dashboard', canActivate:[RoleGuard], component:TicketingAgencyDashboardComponent,
            },
            {
                path:'ticketing-agency', component:TicketingAgencyListComponent
            },
        ]
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule]
})

export class TicketingAgencyRoutingModule{}