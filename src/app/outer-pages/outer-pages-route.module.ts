import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AcademySignupComponent } from './academy-registration/academy-signup/academy-signup.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotUseridComponent } from './forgot-userid/forgot-userid.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UsermanualathleteComponent } from './manual/usermanualathlete/usermanualathlete.component';
import { UsermanualcoachComponent } from './manual/usermanualcoach/usermanualcoach.component';
import { UsermanualsportscientistComponent } from './manual/usermanualsportscientist/usermanualsportscientist.component';
import { UsermanualstcusermanualComponent } from './manual/usermanualstcusermanual/usermanualstcusermanual.component';
import { OuterPagesComponent } from './outer-pages.component';
import { RegisterationComponent } from './registeration/registeration.component';
import { PageNotFoundComponent } from '../standalone_components/page-not-found/page-not-found.component';
import { CashAwardsComponent } from './cash-awards/cash-awards.component';

const route: Routes = [
  {
    path: '',
    component: OuterPagesComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'login/:id', loadChildren: () => import("./login/login.module").then(event => event.LoginModule) },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      // { path: 'forgot-password', component: ForgotPasswordComponent},
      // { path: 'registration', component: RegisterationComponent},
      // {path: 'forgot-userid',component:ForgotUseridComponent},
      {path:'usermanualathlete', component:UsermanualathleteComponent},
      {path:'usermanualcoach', component:UsermanualcoachComponent},
      {path:'usermanualsportscientist', component:UsermanualsportscientistComponent}, 
      // {path:'usermanualsportscientist', component:UsermanualsportscientistComponent},
      {path:'usermanualstcuser', component:UsermanualstcusermanualComponent},
      {path:'academy-signup', component:AcademySignupComponent},
      {path:'academy-signin', loadComponent: () => import("./academy-registration/academy-signin/academy-signin.component").then(event=>event.AcademySigninComponent)},
      {
        path:'cash-award', component:CashAwardsComponent
      }
    ],
    
  },
  
];


@NgModule({
  declarations: [	
      
   ],
  imports: [
    RouterModule.forChild(route)
  ],
  exports: [RouterModule],
  providers: [],
})
export class OuterPagesRouteModule {}
