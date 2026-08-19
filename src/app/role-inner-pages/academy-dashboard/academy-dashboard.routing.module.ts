import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/_common/_helpers/role.guard';
import { AcademyDashboardComponent } from './academy-dashboard.component';

const routes: Routes = [
    {path:'academy-dashboard', canActivate: [RoleGuard],component:AcademyDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademyDashboardRoutingModule { }
