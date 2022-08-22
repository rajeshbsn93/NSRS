import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AthletesComponent } from './athletes.component';
import { CoachesComponent } from './coaches/coaches.component';

const routes: Routes = [
  { path: '', component: AthletesComponent },
  {path:'coaches',component:CoachesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AthletesRoutingModule { }
