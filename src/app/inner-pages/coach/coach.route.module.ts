import { NgModule } from '@angular/core';
import { Routes , RouterModule } from '@angular/router';
import { CoachComponent } from './coach.component';

const coachRoutes:Routes = [
  { path: '' , component: CoachComponent},  
]

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(coachRoutes)
  ],
  exports:[ RouterModule ],
  providers: [],
})

export class CoachRouteModule { }
