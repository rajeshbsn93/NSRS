import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { OtherRoleRoutingModule } from "./other-role-routing.module";
import { OtherRoleDashboardComponent } from "./other-role-dashboard/other-role-dashboard.component";
import { AthleteDashboardSidebarComponent } from "../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component";
import { OtherRoleProfileComponent } from "./other-role-profile/other-role-profile.component";

@NgModule({
    declarations:[
        OtherRoleDashboardComponent,
        OtherRoleProfileComponent
    ],
    imports:[
        CommonModule,
        OtherRoleRoutingModule,
        AthleteDashboardSidebarComponent
    ]
})
export class OtherRoleModule{}