import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KIAARoutingModule } from './kiaa.routing.module';
import { MaterialModule } from 'src/app/_common/material.module';
import { KiaaProposalComponent } from './kiaaProposal/kiaaProposal.component';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';




@NgModule({
  declarations: [
    KiaaProposalComponent,
  ],
  imports: [
    KIAARoutingModule,
    MaterialModule,
    CommonModule,
    LoaderComponent
  ],
  providers: [
   
  ]
})
export class KIAAModule { }
