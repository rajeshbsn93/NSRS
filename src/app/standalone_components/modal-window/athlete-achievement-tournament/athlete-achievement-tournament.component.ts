import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from '../../loader/loader.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAthleteAchievementTournamentComponent } from '../add-athlete-achievement-tournament/add-athlete-achievement-tournament.component';
import { MatTableDataSource } from '@angular/material/table';
import { TournamentService } from 'src/app/_common/services/innerPagesServices/tournament.service';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { VerifyAchievementPopupComponent } from '../verify-achievement-popup/verify-achievement-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AthleteDashboardService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AthleteEditAchievementComponent } from 'src/app/role-inner-pages/modal-window/athlete-dashboard-modal/athlete-edit-achievement/athlete-edit-achievement.component';

@Component({
  selector: 'app-athlete-achievement-tournament',
  templateUrl:'./athlete-achievement-tournament.component.html',
  styleUrls: ['./athlete-achievement-tournament.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,LoaderComponent],
})
export class AthleteAchievementTournamentComponent implements OnInit {
  dialog = inject(MatDialog);
  elementRowData:any;
  loader:boolean = false;
  loader2:boolean = false;
  @ViewChild(MatPaginator) paginator!:MatPaginator
  fileUrl = environment.fileUrl;
  @ViewChild('deleteModal') deleteModal: any;
  deleteModalRef: any;
  deleteRowData: any;
  addBtnAuth:number = 0;

  constructor(
    public activeModal:NgbActiveModal,
    private modalService:NgbModal,
    private _tournamentService:TournamentService,
    private _athleteDashboardService:AthleteDashboardService,
    private _alertService:AlertService
  ) { }

  athleteAchievementTableColumns:String[] =['kitd_unique_id','full_name','sport_display_name','academy_name','category','represented','event_name','competition_name','venue','position','document_path','verifyStatus',];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.getTournamentAcheivementList();
    this.getUserAbletoAddAchievement();
  }
  getTournamentAcheivementList(){
    this.loader = true;
    this._tournamentService.getTournamentAcheivementList(this.elementRowData.tournament_Detail_Id).subscribe({
      next:(res:any)=>{
        this.loader =false;
        // console.log(res)
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })

  }
  getUserAbletoAddAchievement() {
    this.loader2 = true
    this._athleteDashboardService.getUserAbletoAddAchievement().subscribe({
      next: (response: any) => {
        this.loader2 = false
        this.addBtnAuth = response
        if (response) {
          if (this.addBtnAuth === 1) {
            this.athleteAchievementTableColumns.push('action')
          }
        }
      },
      error: () => {
        this.loader2 = false
        console.error('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
      }
    })
  }
  addAchievement(){
    const modalRef = this.modalService.open(
      AddAthleteAchievementTournamentComponent,
      {
        size:'xl',centered:true, backdrop:'static',keyboard:false
      }
    )
    modalRef.componentInstance.elementRowData = this.elementRowData;
    modalRef.result.then((res)=>{
      // console.log('modalRef close',res)
      if(res) this.getTournamentAcheivementList();
    })
  }

  openDialog(row: any) {
    // console.log(row)
    // debugger
    if(row.isEditable){
      const dialogRef = this.dialog.open(VerifyAchievementPopupComponent, {
        panelClass: 'custom-dialog-panel-modal',
        data: {
          message: 'Do you want to verify the achievement?',
          tournamentName: row?.tournament_name,
          buttonText: {
            ok: 'Approve',
            cancel: 'Reject'
          }
        },
        autoFocus:false
      });
      dialogRef.afterClosed().subscribe((confirmData: any) => {
        if (confirmData?.isVerify) {
          this.verifyPlayerAchievement(row?.player_achievement_detail_id, confirmData?.status)
        }
      }); 
    }
      
  }

  verifyPlayerAchievement(achievementId: number, status: number) {
    this.loader = true
    this._athleteDashboardService.verifyPlayerAchievement(achievementId, status).subscribe({
      next: (response: any) => {
        this.loader = true;
        if (response) {
          this.getTournamentAcheivementList()
          this.loader = false
          this._alertService.swalPopSuccess(response?.messaage)
        }
      },
      error: (err) => {
        this.loader = false;
        this._alertService.swalPopSuccess('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
      }
    });
  }

  editAchievement(rowData: any) {
    const modalRef = this.modalService.open(AthleteEditAchievementComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.editRowData = rowData;
    modalRef.result.then((thenRes) => {
      if (thenRes) {
       this.getTournamentAcheivementList()
      }
    }).catch(() => { })

  }
  deleteAchievement(rowData: any) {
    this.deleteRowData = rowData;
    this.deleteModalRef = this.modalService.open(this.deleteModal, { centered: true, size: 'md' })
  }



  confirmDelete() {
    this.loader = true
    this._tournamentService.deleteAthleteAchievementDetail(this.deleteRowData.player_achievement_detail_id).subscribe({
      next: (response) => {
        this.loader = true;
        if (response) {
          this.deleteModalRef.close();
          this.loader = false
          this.getTournamentAcheivementList();
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }

}
