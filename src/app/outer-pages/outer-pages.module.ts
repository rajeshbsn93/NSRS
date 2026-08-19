import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuterPagesRouteModule } from './outer-pages-route.module';
import { OuterPagesComponent } from './outer-pages.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotUseridComponent } from './forgot-userid/forgot-userid.component';
import { UsermanualathleteComponent } from './manual/usermanualathlete/usermanualathlete.component';
import { UsermanualcoachComponent } from './manual/usermanualcoach/usermanualcoach.component';
import { UsermanualsportscientistComponent } from './manual/usermanualsportscientist/usermanualsportscientist.component';
import { UsermanualstcusermanualComponent } from './manual/usermanualstcusermanual/usermanualstcusermanual.component';
import { AcademySignupComponent } from './academy-registration/academy-signup/academy-signup.component';
import { RegisterationComponent } from './registeration/registeration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OuterPageLayoutFooterComponent } from '../_common/layouts/outer-page-layout/outer-page-layout-footer/outer-page-layout-footer.component';
import { OuterPageLayoutHeaderComponent } from '../_common/layouts/outer-page-layout/outer-page-layout-header/outer-page-layout-header.component';

import { PageNotFoundComponent } from '../standalone_components/page-not-found/page-not-found.component';
import { LoaderComponent } from '../standalone_components/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { CashAwardsComponent } from './cash-awards/cash-awards.component';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OuterPagesRouteModule,
    CarouselModule,
    LoaderComponent,
    MatIconModule
  ],
  declarations: [
    OuterPagesComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ForgotPasswordComponent,
    ForgotUseridComponent,
    UsermanualathleteComponent,
    UsermanualcoachComponent,
    UsermanualsportscientistComponent,
    UsermanualstcusermanualComponent,
    RegisterationComponent,
    AcademySignupComponent,
    OuterPageLayoutFooterComponent,
    OuterPageLayoutHeaderComponent,
    PageNotFoundComponent,
    CashAwardsComponent
  ]
})
export class OuterPagesModule { }
