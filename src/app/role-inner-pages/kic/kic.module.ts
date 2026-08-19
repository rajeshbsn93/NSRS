import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KicRoutingModule } from './kic-routing.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { ReportsComponent } from './reports/reports.component';
import { KicMonitoringComponent } from './kic-monitoring/kic-monitoring.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { KicAddAttendanceComponent } from 'src/app/standalone_components/modal-window/kic-add-attendance/kic-add-attendance.component';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { KicTableComponent } from './kic-components/kic-table/kic-table.component';
import { KicStateTableComponent } from './kic-components/kic-state-table/kic-state-table.component';
import { KicRcTableComponent } from './kic-components/kic-rc-table/kic-rc-table.component';
import { KicHoTableComponent } from './kic-components/kic-ho-table/kic-ho-table.component';
import { KicAcademyComponent } from './kic-components/kic-academy/kic-academy.component';
import { KicStakeholderComponent } from './kic-stakeholder/kic-stakeholder.component';
import { EquipmentProcurementComponent } from './kic-monitoring/equipment-procurement/equipment-procurement.component';
import { BrandingComponent } from './kic-monitoring/branding/branding.component';
import { TrainingDetailsComponent } from './kic-monitoring/training-details/training-details.component';
import { PastChampionAthletesComponent } from './kic-monitoring/past-champion-athletes/past-champion-athletes.component';
import { CctcFeedComponent } from './kic-monitoring/cctc-feed/cctc-feed.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleMeetingComponent } from './kic-monitoring/scheduleMeeting/scheduleMeeting.component';
import { AchievementComponent } from './kic-monitoring/achievement/achievement.component';
import { KicAddPcaAttendanceComponent } from 'src/app/standalone_components/modal-window/kic-add-pca-attendance/kic-add-pca-attendance.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { YearFormatDirective } from 'src/app/standalone_components/directives/year-format.directive';
import { KicDashboardComponent } from './kic-dashboard/kic-dashboard.component';
import { StateStatusComponent } from './kic-components/dashboard-components/state-status/state-status.component';
import { MftCardComponent } from './kic-components/dashboard-components/mft-card/mft-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SummaryCardComponent } from './kic-components/dashboard-components/summary-card/summary-card.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FundDetailsComponent } from './kic-components/dashboard-components/fund-details/fund-details.component';
import { MatTableModule } from '@angular/material/table';
import { IndiaMapDensityComponent } from './kic-components/dashboard-components/india-map-density/india-map-density.component';
import { IndiaMapDetailComponent } from './kic-components/dashboard-components/india-map-detail/india-map-detail.component';
import { PageLoaderComponent } from './kic-components/dashboard-components/page-loader/page-loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StateMapDetailComponent } from './kic-components/dashboard-components/state-map-detail/state-map-detail.component';
import { DistrictMapDetailComponent } from './kic-components/dashboard-components/district-map-detail/district-map-detail.component';
import { DashboardOverviewComponent } from './kic-components/dashboard-components/dashboard-overview/dashboard-overview.component';
import { KicMonitoringModalViewComponent } from './kic-monitoring-modal-view/kic-monitoring-modal-view.component';
import { KicSanctionsComponent } from './kic-sanctions/kic-sanctions.component';
import { AddProposalComponent } from './kic-components/add-proposal/add-proposal.component';
import { CommentHistoryComponent } from './kic-components/comment-history/comment-history.component';
import { KicTableViewComponent } from './kic-table-view/kic-table-view.component';
import { KiscePropsalsComponent } from '../kisce/kisce-propsals/kisce-propsals.component';
import { KisceAcademyMasterListComponent } from '../kisce/kisce-academy-master-list/kisce-academy-master-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SanctionReleasedAmountComponent } from './sanction-released-amount/sanction-released-amount.component';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SanctionTableViewComponent } from './sanction-table-view/sanction-table-view.component';
import { SanctionUcComponent } from './sanction-uc/sanction-uc.component';
import { SanctionReleasedAmountUcComponent } from './sanction-released-amount-uc/sanction-released-amount-uc.component';
import { SanctionTotalAmountComponent } from './sanction-total-amount/sanction-total-amount.component';


@NgModule({
  declarations: [
    AttendanceComponent,
    ReportsComponent,
    KicTableComponent,
    KicStateTableComponent,
    KicRcTableComponent,
    KicHoTableComponent,
   KicStakeholderComponent,
    KicMonitoringComponent,
    EquipmentProcurementComponent,
    BrandingComponent,
    TrainingDetailsComponent,
    PastChampionAthletesComponent,
    CctcFeedComponent,
    ScheduleMeetingComponent,
    AchievementComponent,
    KicDashboardComponent,
    MftCardComponent,
    StateStatusComponent,
    SummaryCardComponent,
    FundDetailsComponent,
    IndiaMapDensityComponent,
    IndiaMapDetailComponent,
    PageLoaderComponent,
    StateMapDetailComponent,
    DistrictMapDetailComponent,
    DashboardOverviewComponent,
    KicSanctionsComponent,
    AddProposalComponent,
    CommentHistoryComponent,
    KicTableViewComponent,
    SanctionReleasedAmountComponent,
    SanctionTableViewComponent,
    SanctionUcComponent,
    SanctionReleasedAmountUcComponent,
    SanctionTotalAmountComponent,
  ],
  imports: [
    KiscePropsalsComponent,
    KicAcademyComponent,
    // KicMonitoringModalViewComponent,
    CommonModule,
    KicRoutingModule,
    MaterialModule,
    KicAddAttendanceComponent,
    LoaderComponent,
    ReactiveFormsModule,
    // KicMonitoringModule
    MatDatepickerModule,
    YearFormatDirective,
    KicAddPcaAttendanceComponent,
    MatButtonToggleModule,
    MatTooltipModule,
    HighchartsChartModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    NgxSpinnerModule,
    KisceAcademyMasterListComponent,
    MatFormFieldModule,
    MatDialogModule,
  ],
  providers: [
    NgbActiveModal,
    MatDialogModule,
  ]
})
export class KicModule { }
