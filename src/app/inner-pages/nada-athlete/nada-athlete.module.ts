import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NadaAthleteComponent } from './nada-athlete.component';
import { NadaAthleteRoutingModule } from './nada-athlete-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    LoaderComponent,
    NadaAthleteRoutingModule
  ],
  declarations: [NadaAthleteComponent]
})
export class NadaAthleteModule { }
