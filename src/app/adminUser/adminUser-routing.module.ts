import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserComponent } from './adminUser.component';
//import { SdoComponent } from './sdo/sdo.component';

const routes: Routes = [
  {path: '', component: AdminUserComponent },
  {path:'sdo', loadChildren:()=> import('./sdo/sdo.module').then(m => m.SdoModule)}
  //{path: 'sdo', component:SdoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUserRoutingModule { }
