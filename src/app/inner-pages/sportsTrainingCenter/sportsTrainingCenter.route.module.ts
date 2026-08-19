import { NgModule } from '@angular/core';
import { Routes , RouterModule } from '@angular/router';
import { SportsTrainingCenterComponent } from './sportsTrainingCenter.component';

const sportsTrainingCenterRoutes:Routes = [
  { path: '' , component: SportsTrainingCenterComponent},
]

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(sportsTrainingCenterRoutes)
  ],
  exports:[ RouterModule ],
  providers: [],
})
export class SportsTrainingCenterRouteModule { }
