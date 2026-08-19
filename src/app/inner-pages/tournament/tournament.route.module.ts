import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TournamentComponent } from "./tournament.component";

const tournamentRoutes:Routes=[
  {path:'',component: TournamentComponent}
]

@NgModule({
  declarations:[],
  imports:[
    RouterModule.forChild(tournamentRoutes)
  ],
  exports:[ RouterModule ],
  providers:[]
})

export class TournamentRouteModule {

}