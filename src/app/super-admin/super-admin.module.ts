import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminComponent } from './super-admin.component';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { LoaderComponent } from '../standalone_components/loader/loader.component';
import { SuperAdminHeaderComponent } from './super-admin-header/super-admin-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperAdminSidebarComponent } from './super-admin-sidebar/super-admin-sidebar.component';
import { AlreadyExistCheckComponent } from './already-exist-check/already-exist-check.component';



@NgModule({
  declarations: [SuperAdminComponent, SuperAdminHeaderComponent, SuperAdminSidebarComponent],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    LoaderComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SuperAdminModule { }
