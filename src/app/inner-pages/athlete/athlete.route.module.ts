import { NgModule } from '@angular/core';
import { Routes , RouterModule } from '@angular/router';
import { AthleteComponent } from './athlete.component';

const athleteRoutes:Routes = [
  { path: '' , component: AthleteComponent},

  
]

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(athleteRoutes)
  ],
  exports:[ RouterModule ],
  providers: [],
})
export class AthleteRouteModule { }
