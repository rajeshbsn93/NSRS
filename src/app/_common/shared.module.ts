import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InnerPageLayoutSidebarComponent } from './layouts/inner-page-layout/inner-page-layout-sidebar/inner-page-layout-sidebar.component';
import { InnerPagesLayoutHeaderComponent } from './layouts/inner-page-layout/inner-pages-layout-header/inner-pages-layout-header.component';
import { TransferWeedoutComponent } from './modal-window/transfer-weedout/transfer-weedout.component';
import { AthleteInsuranceComponent } from '../standalone_components/modal-window/athlete-insurance/athlete-insurance.component';
import { AthleteInsuranceSuccessComponent } from '../standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { FinanialModalComponent } from './modal-window/finanial-modal/finanial-modal.component';
import { MatSortModule } from '@angular/material/sort';
import { CoachAcademyComponent } from './modal-window/coach-academy/coach-academy.component';
import { AddFinancialAthleteComponent } from './modal-window/addFinancialAthlete/addFinancialAthlete.component';
import { AddInsuranceAthleteComponent } from './modal-window/addInsuranceAthlete/addInsuranceAthlete.component';
import { ReimbursementDetailsComponent } from './modal-window/reimbursement-details/reimbursement-details.component';
import { AddTournamentComponent } from '../standalone_components/modal-window/addTournament/addTournament.component';
import { TournamentEventListComponent } from './modal-window/tournamentEventList/tournamentEventList.component';
import { MaterialModule} from './material.module'
import { TournamentCreatEventComponent } from './modal-window/tournamentCreatEvent/tournamentCreatEvent.component';
import { LoaderComponent } from '../standalone_components/loader/loader.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MatSortModule, 
    NgbModule,
    LoaderComponent,
    MaterialModule
  ],
  declarations: [
    InnerPageLayoutSidebarComponent,
    InnerPagesLayoutHeaderComponent,
    TransferWeedoutComponent, 
    FinanialModalComponent, 
    CoachAcademyComponent, 
    AddFinancialAthleteComponent, 
    AddInsuranceAthleteComponent, 
    ReimbursementDetailsComponent,
    TournamentEventListComponent,
    TournamentCreatEventComponent,
    
  ],
  exports: [
    CommonModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule,
    InnerPageLayoutSidebarComponent,
    InnerPagesLayoutHeaderComponent,
    RouterModule,
    LoaderComponent,
  ],
  providers: [DatePipe],
})
export class SharedModule { }
 