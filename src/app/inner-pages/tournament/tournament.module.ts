import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { MaterialModule } from "src/app/_common/material.module";
import { TournamentComponent } from "./tournament.component";
import { TournamentRouteModule } from "./tournament.route.module";

@NgModule({
  imports:[
    CommonModule,
    MaterialModule,
    TournamentRouteModule,
    ReactiveFormsModule,
    LoaderComponent,
    FormsModule
  ],
  declarations:[TournamentComponent],

})
export class TournamentModule{

}