import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualComponent } from './manual.component';
import { UsermanualathleteComponent } from './usermanualathlete/usermanualathlete.component';

const routes: Routes = [
  { path: '', component: ManualComponent },
  {path:'usermanualathlete', component:UsermanualathleteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualRoutingModule { }
