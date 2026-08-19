import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { LoginComponent } from "./login.component";
import { LoginRouteModule } from "./login.route";

@NgModule({
  imports:[
    LoginRouteModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderComponent,
    MatDialogModule
  ],
  declarations:[LoginComponent]

})
export class LoginModule {}