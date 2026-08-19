import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingACComponent } from './mappingAC.component';
import { MappingAcRoutesModule } from './mappingAc.routing';
import { MaterialModule } from 'src/app/_common/material.module';
import { MapAthleteComponent } from './map-athlete/map-athlete.component';
import { DelegateMappingComponent } from './delegate-mapping/delegate-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    MappingAcRoutesModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderComponent
  ],
  declarations: [MappingACComponent,MapAthleteComponent,DelegateMappingComponent]
})
export class MappingACModule { }
