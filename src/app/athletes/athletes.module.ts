import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AthletesRoutingModule } from './athletes-routing.module';
import { AthletesComponent } from './athletes.component';
import { CoachesComponent } from './coaches/coaches.component';


@NgModule({
  declarations: [
    AthletesComponent,
    CoachesComponent
  ],
  imports: [
    CommonModule,
    AthletesRoutingModule
  ]
})
export class AthletesModule { }
