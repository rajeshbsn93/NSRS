import { RouterModule, Routes } from "@angular/router";
import { NodalOfficerComponent } from "./nodal-officer.component";
import { NodalOfficerDashboardComponent } from "./nodal-officer-dashboard/nodal-officer-dashboard.component";
import { NgModule } from "@angular/core";
import { ManageAthleteComponent } from "./manage-athlete/manage-athlete.component";
import { NodalOfficerProfileComponent } from "./nodal-officer-profile/nodal-officer-profile.component";


const routes:Routes = [
    {
        path:'', component:NodalOfficerComponent,
        children:[
           {
            path:'', redirectTo:'nodal-officer-dashboard', pathMatch:'full'
           },
           {
            path:'nodal-officer-dashboard', component:NodalOfficerDashboardComponent
           },
           {
            path:'manage-athlete', component:ManageAthleteComponent
           },
           {
            path:'profile', component:NodalOfficerProfileComponent
           }
        ]
    }
]
@NgModule({
    declarations:[],
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]
})

export class NodalOfficerRoutingModule{}