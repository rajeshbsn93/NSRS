import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SdoDashboardComponent } from "./sdo-dashboard/sdo-dashboard.component";
import { SdoComponent } from "./sdo.component";


const routes: Routes = [
    {
        path: '', component:SdoComponent
    },
    {
        path: 'sdo-dashboard', component: SdoDashboardComponent
    }
];
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SdoRoutingModule{}