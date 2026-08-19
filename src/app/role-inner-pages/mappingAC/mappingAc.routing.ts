import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MappingACComponent } from './mappingAC.component';

const routes: Routes = [
  { path:'', component:MappingACComponent},
];
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class MappingAcRoutesModule{}
