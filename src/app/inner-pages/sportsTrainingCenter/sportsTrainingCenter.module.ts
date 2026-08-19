import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/_common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { SportsTrainingCenterComponent } from './sportsTrainingCenter.component';
import { SportsTrainingCenterRouteModule } from './sportsTrainingCenter.route.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    SportsTrainingCenterRouteModule,
    MaterialModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,  
    LoaderComponent 
  ],
  declarations: [
    SportsTrainingCenterComponent
  ],
  
})
export class SportsTrainingCenterModule { }
