import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';
import { RoleGuard } from '../_common/_helpers/role.guard';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: SuperAdminComponent, children: [
        {
          path: 'super-admin-dashboard',
          canActivate: [RoleGuard],
          loadComponent: () => import('./super-admin-dashboard/super-admin-dashboard.component')
                                .then((mod) => mod.SuperAdminDashboardComponent)
        },
        {
          path: 'manage-user',
          canActivate: [RoleGuard],
          loadComponent: () => import('./manage-user/manage-user.component')
                                .then((mod) => mod.ManageUserComponent)
        },
        {
          path: 'manage-role',
          canActivate: [RoleGuard],
          loadComponent: () => import('./manage-role/manage-role.component')
                                .then((mod) => mod.ManageRoleComponent)
        },
        {
          path: 'manage-project',
          canActivate: [RoleGuard],
          loadComponent: () => import('./manage-project/manage-project.component')
                                .then((mod) => mod.ManageProjectComponent)
        },
        {
          path: 'manage-project-role-mapping',
          canActivate: [RoleGuard],
          loadComponent: () => import('./manage-project-role-mapping/manage-project-role-mapping.component')
                                .then((mod) => mod.ManageProjectRoleMappingComponent)
        },
        {
          path: 'manage-menu',
          canActivate: [RoleGuard],
          loadComponent: () => import('./manage-menu/manage-menu.component')
                                .then((mod) => mod.ManageMenuComponent)
        },
        {
          path: 'manage-menu-role-mapping',
          canActivate: [RoleGuard],
          loadComponent: () => import('./manage-menu-role-mapping/manage-menu-role-mapping.component')
                                .then((mod) => mod.ManageMenuRoleMappingComponent)
        },
        {
          path:'check-credential',
          canActivate: [RoleGuard],
          loadComponent:()=>import('./already-exist-check/already-exist-check.component').then((mod)=>mod.AlreadyExistCheckComponent)
        },
        {
          path:'role-transfer',
          canActivate:[RoleGuard],
          loadComponent: ()=> import('./role-transfer/role-transfer.component').then(comp=> comp.RoleTransferComponent)
        }
      ]}
    ])
  ],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
