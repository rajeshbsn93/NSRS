import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './standalone_components/page-not-found/page-not-found.component';
import { AuthGuard } from './_common/_helpers/auth.guard';


const route: Routes = [
  { path: '', loadChildren: () => import("./outer-pages/outer-pages.module").then(event => event.OuterPagesModule) },
  { path: '', loadChildren: () => import("./inner-pages/inner-pages.module").then(event => event.InnerPagesModule), canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import("./role-inner-pages/role-inner-pages.module").then(event => event.RoleInnerPagesModule), canActivate: [AuthGuard] },
  // { path: '', loadChildren: () => import("./role-inner-pages/role-inner-pages.module").then(event => event.RoleInnerPagesModule)},
  { path: '', loadChildren: () => import("./super-admin/super-admin.module").then(event => event.SuperAdminModule), canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import("./camp-admin-pages/camp-admin-pages.module").then((mod) => mod.CampAdminPagesModule), canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import("./camp-inner-pages/camp-inner-pages.module").then((mod) => mod.CampInnerPagesModule), canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import("./ticketing-agency/ticketing-agency.module").then((mod)=>mod.TicketingAgencyModule), canActivate:[AuthGuard]},
  { path: '', loadChildren: () => import("./young-professionals/young-professionals.module").then((mod)=>mod.YoungProfessionalsModule), canActivate:[AuthGuard]},
  { path: 'pagenot-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'pagenot-found', pathMatch: 'full' },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(route, {
      // preloadingStrategy:PreloadAllModules
    })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRouteModule { }
