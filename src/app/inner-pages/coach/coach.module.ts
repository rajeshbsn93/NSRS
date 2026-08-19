import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/_common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoachRouteModule } from './coach.route.module';
import { CoachComponent } from './coach.component';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { DisableIfRoleDirective } from 'src/app/standalone_components/directives/disable-if-role.directive';


@NgModule({
  imports: [
    CommonModule,
    CoachRouteModule,
    MaterialModule,
    FormsModule,
    LoaderComponent,
    ReactiveFormsModule,    
    DisableIfRoleDirective
  ],
  declarations: [
    CoachComponent
  ],
  
})
export class CoachModule { }
