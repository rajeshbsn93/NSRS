import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteComponent } from './athlete.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AthleteRouteModule } from './athlete.route.module';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { DisableIfRoleDirective } from 'src/app/standalone_components/directives/disable-if-role.directive';


@NgModule({
  imports: [
    CommonModule,
    AthleteRouteModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,  
    LoaderComponent ,
    DisableIfRoleDirective
  ],
  declarations: [
    AthleteComponent
  ],
  
})
export class AthleteModule { }
