import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserComponent } from './adminUser/adminUser.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './staticpages/about/about.component';
import { ContactComponent } from './staticpages/contact/contact.component';
import { PagenotFoundComponent } from './staticpages/pagenot-found/pagenot-found.component';
import { AuthGuardGuard } from './_helpers/auth-guard.guard';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';

const routes: Routes = [
  // site Route
  {
    path: '', component:SiteLayoutComponent,
    children:[      
      {path:'', redirectTo:'home', pathMatch:'full'},
      {path:'home', component:HomeComponent},
      {path:'about', component:AboutComponent},
      {path:'pagenotFound', component:PagenotFoundComponent},
      {path:'contact', component:ContactComponent},
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'manual', loadChildren: () => import('./manual/manual.module').then(m => m.ManualModule) },
    ]
  },
  //App Route
  {
    path:'', component:AppLayoutComponent,
    children:[      
      { path: 'adminUser', loadChildren: () => import('./adminUser/adminUser.module').then(m => m.AdminUserModule),
    canActivate: [AuthGuardGuard] },
      { path: 'athletes', loadChildren: () => import('./athletes/athletes.module').then(m => m.AthletesModule) }
    ]
  },
  
  {path:'pagenotFound', component:PagenotFoundComponent},  
  { path: '**', redirectTo: 'pagenotFound', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
