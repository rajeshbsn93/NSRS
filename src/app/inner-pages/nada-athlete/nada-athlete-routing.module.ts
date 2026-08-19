import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NadaAthleteComponent } from "./nada-athlete.component";

const routes:Routes = [
    {
        path:'', component:NadaAthleteComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NadaAthleteRoutingModule{}