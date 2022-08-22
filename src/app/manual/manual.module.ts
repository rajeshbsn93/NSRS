import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualRoutingModule } from './manual-routing.module';
import { ManualComponent } from './manual.component';
import { UsermanualathleteComponent } from './usermanualathlete/usermanualathlete.component';


@NgModule({
  declarations: [
    ManualComponent,
    UsermanualathleteComponent
  ],
  imports: [
    CommonModule,
    ManualRoutingModule
  ]
})
export class ManualModule { }
