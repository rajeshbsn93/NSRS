import { RouterModule, Routes } from "@angular/router";
import { CampAdminPagesComponent } from "./camp-admin-pages.component";
import { NgModule } from "@angular/core";
import { CampAdminDashboardComponent } from "./camp-admin-dashboard/camp-admin-dashboard.component";
import { RoleGuard } from "../_common/_helpers/role.guard";


const routes:Routes = [
    {
        path:'',component:CampAdminPagesComponent,
        children:[
            {path:'',redirectTo:'camp-admin-dashboard', pathMatch:'full'},
            {path:'camp-admin-dashboard', canActivate:[RoleGuard], component:CampAdminDashboardComponent},
            {path:'camp', canActivate:[RoleGuard], loadComponent : ()=> import("./camp/camp.component").then((comp)=>comp.CampComponent)}
        ]
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule]
})

export class CampAdminPagesRoutingModule {}