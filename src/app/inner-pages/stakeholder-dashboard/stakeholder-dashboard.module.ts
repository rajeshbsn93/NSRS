import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakeholderDashboardComponent } from './stakeholder-dashboard.component';
import { StakeholderDashboardRoutingModule } from './stakeholder-dashboard-routing.module';
import { AcsatCardsComponent } from './stakeholder-dashboard-components/acsat-cards/acsat-cards.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { StakeholderDashboardOverviewComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-overview/stakeholder-dashboard-overview.component';
import { StakeholderDashboardCardSummaryComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-card-summary/stakeholder-dashboard-card-summary.component';
import { StakeholderDashboardVacancyComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-vacancy/stakeholder-dashboard-vacancy.component';
import { StakeholderDashboardMapIndiaComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-map-india/stakeholder-dashboard-map-india.component';
import { StakeholderDashboardInsuranceComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-insurance/stakeholder-dashboard-insurance.component';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import { StakeholderDashboardVacancyModalComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-vacancy-modal/stakeholder-dashboard-vacancy-modal.component';
import { StakeholderDashboardInsuranceDisciplineModalComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-insurance-discipline-modal/stakeholder-dashboard-insurance-discipline-modal.component';
import { StakeholderDashboardOverviewCommonModalsComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-overview-common-modals/stakeholder-dashboard-overview-common-modals.component';
import { StakeholderDashboardCardSummaryModalComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-card-summary-modal/stakeholder-dashboard-card-summary-modal.component';
import { StakeholderDashboardCardSummaryModalAcademyComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-card-summary-modal-academy/stakeholder-dashboard-card-summary-modal-academy.component';
import { StakeholderDashboardCardSummaryModalAthleteComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-card-summary-modal-athlete/stakeholder-dashboard-card-summary-modal-athlete.component';
import { StakeholderDashboardCardSummaryModalCoachComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-card-summary-modal-coach/stakeholder-dashboard-card-summary-modal-coach.component';
import { StakeholderDashboardCardSummaryModalSportScientistComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-card-summary-modal-sport-scientist/stakeholder-dashboard-card-summary-modal-sport-scientist.component';
import { StakeholderDashboardRcComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-rc/stakeholder-dashboard-rc.component';
import { StakeholderDashboardRcModalComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-rc-modals/stakeholder-dashboard-rc-modal/stakeholder-dashboard-rc-modal.component';
import { StakeholderDashboardRcModalAcademyComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-rc-modals/stakeholder-dashboard-rc-modal-academy/stakeholder-dashboard-rc-modal-academy.component';
import { StakeholderDashboardRcModalAthleteComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-rc-modals/stakeholder-dashboard-rc-modal-athlete/stakeholder-dashboard-rc-modal-athlete.component';
import { StakeholderDashboardRcModalCoachComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-rc-modals/stakeholder-dashboard-rc-modal-coach/stakeholder-dashboard-rc-modal-coach.component';
import { StakeholderDashboardRcModalSportScientistComponent } from './stakeholder-dashboard-components/stakeholder-dashboard-modals/stakeholder-dashboard-rc-modals/stakeholder-dashboard-rc-modal-sport-scientist/stakeholder-dashboard-rc-modal-sport-scientist.component';

@NgModule({
  imports: [
    CommonModule,
    StakeholderDashboardRoutingModule,
    MaterialModule,
    HighchartsChartModule,
    LoaderComponent,
    MatProgressBarModule,
  ],
  declarations: [
    StakeholderDashboardComponent,
    AcsatCardsComponent,
    StakeholderDashboardOverviewComponent,
    StakeholderDashboardCardSummaryComponent,
    StakeholderDashboardVacancyComponent,
    StakeholderDashboardMapIndiaComponent,
    StakeholderDashboardInsuranceComponent,
    StakeholderDashboardVacancyModalComponent,
    StakeholderDashboardInsuranceDisciplineModalComponent,
    StakeholderDashboardOverviewCommonModalsComponent,
    StakeholderDashboardCardSummaryModalComponent,
    StakeholderDashboardCardSummaryModalAcademyComponent,
    StakeholderDashboardCardSummaryModalAthleteComponent,
    StakeholderDashboardCardSummaryModalCoachComponent,
    StakeholderDashboardCardSummaryModalSportScientistComponent,
    StakeholderDashboardRcComponent,
    StakeholderDashboardRcModalComponent,
    StakeholderDashboardRcModalAcademyComponent,
    StakeholderDashboardRcModalAthleteComponent,
    StakeholderDashboardRcModalCoachComponent,
    StakeholderDashboardRcModalSportScientistComponent,
  ]
})
export class StakeholderDashboardModule { }
