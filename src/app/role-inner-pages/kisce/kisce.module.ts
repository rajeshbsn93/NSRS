import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KiscePropsalsComponent } from './kisce-propsals/kisce-propsals.component';
import { KisceRoutingModule } from './kisce-routing.module';
import { KisceStakeholderComponent } from './kisce-stakeholder/kisce-stakeholder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { YearFormatDirective } from 'src/app/standalone_components/directives/year-format.directive';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/_common/material.module';
import { AddProposalKisceComponent } from './add-proposal-kisce/add-proposal-kisce.component';
import { CommentHistoryKisceComponent } from './comment-history-kisce/comment-history-kisce.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KisceSanctionsComponent } from './kisce-sanctions/kisce-sanctions.component';
import { KisceAcademyMasterListComponent } from './kisce-academy-master-list/kisce-academy-master-list.component';
import { KisceTableViewComponent } from './kisce-table-view/kisce-table-view.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { KicAcademyComponent } from '../kic/kic-components/kic-academy/kic-academy.component';
import { SanctionReleasedKisceComponent } from './sanction-released-kisce/sanction-released-kisce.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SanctionUcTableViewComponent } from './sanction-uc-table-view/sanction-uc-table-view.component';
import { KisceSanctionUcComponent } from './kisce-sanction-uc/kisce-sanction-uc.component';
import { SanctionReleasedKisceUcComponent } from './sanction-released-kisce-uc/sanction-released-kisce-uc.component';
import { KisceSanctionTotalAmountComponent } from './kisce-sanction-total-amount/kisce-sanction-total-amount.component';
import { MY_DATE_FORMATS } from 'src/app/_common/modal-window/finanial-modal/finanial-modal.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { KisceDashboardComponent } from './kisce-dashboard/kisce-dashboard.component';
import { StateStatusComponent } from './dashboard-components/state-status/state-status.component';
import { MftCardComponent } from './dashboard-components/mft-card/mft-card.component';
import { SummaryCardComponent } from './dashboard-components/summary-card/summary-card.component';
import { FundDetailsComponent } from './dashboard-components/fund-details/fund-details.component';
import { IndiaMapDensityComponent } from './dashboard-components/india-map-density/india-map-density.component';
import { IndiaMapDetailComponent } from './dashboard-components/india-map-detail/india-map-detail.component';
import { StateMapDetailComponent } from './dashboard-components/state-map-detail/state-map-detail.component';
import { DashboardOverviewComponent } from './dashboard-components/dashboard-overview/dashboard-overview.component';
import { PageLoaderComponent } from './dashboard-components/page-loader/page-loader.component';
import { DistrictMapDetailComponent } from './dashboard-components/district-map-detail/district-map-detail.component';
import { KisceMonitoringComponent } from './kisce-monitoring/kisce-monitoring.component';
import { TrainingDetailsComponent } from './kisce-monitoring/training-details/training-details.component';
import { PastChampionAthletesComponent } from './kisce-monitoring/past-champion-athletes/past-champion-athletes.component';
import { EquipmentProcurementComponent } from './kisce-monitoring/equipment-procurement/equipment-procurement.component';
import { CctvFeedComponent } from './kisce-monitoring/cctv-feed/cctv-feed.component';
import { BrandingComponent } from './kisce-monitoring/branding/branding.component';
import { AchievementComponent } from './kisce-monitoring/achievement/achievement.component';
import { ScheduleMeetingComponent } from './kisce-monitoring/schedule-meeting/schedule-meeting.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { KisceTableComponent } from './kisce-components/kisce-table/kisce-table.component';
import { KisceStateTableComponent } from './kisce-components/kisce-state-table/kisce-state-table.component';
import { KisceRcTableComponent } from './kisce-components/kisce-rc-table/kisce-rc-table.component';
import { KisceHoTableComponent } from './kisce-components/kisce-ho-table/kisce-ho-table.component';
import { KisceAddProposalComponent } from './kisce-components/kisce-add-proposal/kisce-add-proposal.component';
import { KisceCommentHistoryComponent } from './kisce-components/kisce-comment-history/kisce-comment-history.component';
import { KisceFinancialStatusComponent } from './kisce-monitoring/kisce-financial-status/kisce-financial-status.component';


@NgModule({
  declarations: [
    KisceStakeholderComponent,
    KisceSanctionsComponent,
    KisceTableViewComponent,
    KisceSanctionsComponent,
    SanctionReleasedKisceComponent,
    SanctionUcTableViewComponent,
    KisceSanctionUcComponent,
    SanctionReleasedKisceUcComponent,
    KisceSanctionTotalAmountComponent,
    KisceDashboardComponent,
    StateStatusComponent,
    MftCardComponent,
    SummaryCardComponent,
    FundDetailsComponent,
    IndiaMapDensityComponent,
    IndiaMapDetailComponent,
    StateMapDetailComponent,
    DistrictMapDetailComponent,
    DashboardOverviewComponent,
    MftCardComponent,
    PageLoaderComponent,
    KisceMonitoringComponent,
    TrainingDetailsComponent,

    
    
    PastChampionAthletesComponent,
    EquipmentProcurementComponent,
    CctvFeedComponent,
    BrandingComponent,
    AchievementComponent,
    ScheduleMeetingComponent,
    AttendanceComponent,
    KisceTableComponent,
    KisceStateTableComponent,
    KisceRcTableComponent,
    KisceHoTableComponent,
    KisceAddProposalComponent,
    KisceCommentHistoryComponent,
    KisceFinancialStatusComponent
  ],
  imports: [
    KisceAcademyMasterListComponent,
    CommentHistoryKisceComponent,
    AddProposalKisceComponent,
    CommonModule,
    KisceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    YearFormatDirective,
    HighchartsChartModule,
    MatPaginatorModule,
    MatTableModule,
    MaterialModule,
    MatRadioModule,
    MatButtonModule,
    MatSortModule,
    LoaderComponent,
    KiscePropsalsComponent,
    KicAcademyComponent,
    MatDialogModule,
    


  ],
  providers: [
    NgbActiveModal,
    MatDialogModule,
    DatePipe,
  ]
})
export class KisceModule { }
