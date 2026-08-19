import { NgModule } from '@angular/core';
import { RoleInnerPagesRoutingModule } from './role-inner-pages-routing.module';
import { RoleInnerPagesHeaderComponent } from './layout/role-inner-pages-header/role-inner-pages-header.component';
import { RoleInnerPagesComponent } from './role-inner-pages.component';
import { RoleInnerPagesSidebarComponent } from './layout/role-inner-pages-sidebar/role-inner-pages-sidebar.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_common/shared.module';

@NgModule({
  declarations: [
    RoleInnerPagesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RoleInnerPagesHeaderComponent,
    RoleInnerPagesSidebarComponent,
    RoleInnerPagesRoutingModule,
  ],
})
export class RoleInnerPagesModule { }
