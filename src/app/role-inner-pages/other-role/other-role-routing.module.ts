import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OtherRoleDashboardComponent } from "./other-role-dashboard/other-role-dashboard.component";
import { OtherRoleProfileComponent } from "./other-role-profile/other-role-profile.component";

const routes:Routes = [
    {
        path: '', 
        component:OtherRoleDashboardComponent
    },
    {
        path: 'other-profile',
        component:OtherRoleProfileComponent
    }
];
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class OtherRoleRoutingModule{}