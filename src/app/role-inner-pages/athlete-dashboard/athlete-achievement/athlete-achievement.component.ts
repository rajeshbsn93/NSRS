import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AthleteDashboardSidebarComponent } from "../athlete-dashboard-sidebar/athlete-dashboard-sidebar.component";
import { MaterialModule } from "src/app/_common/material.module";
import { AthleteDashboardService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service";
import { first } from "rxjs";
import { AthleteAchievementOjectItem } from "src/app/_common/models/athlete-dashboard";
import { MatTableDataSource } from "@angular/material/table";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AthleteDetailsAchievementComponent } from "../../modal-window/athlete-dashboard-modal/athlete-details-achievement/athlete-details-achievement.component";
import { environment } from "src/environments/environment";
import { TournamentService } from "src/app/_common/services/innerPagesServices/tournament.service";
import { AthleteEditAchievementComponent } from "../../modal-window/athlete-dashboard-modal/athlete-edit-achievement/athlete-edit-achievement.component";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { VerifyAchievementPopupComponent } from "src/app/standalone_components/modal-window/verify-achievement-popup/verify-achievement-popup.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";


@Component({
    selector:'app-athlete-achievement',
    templateUrl:'./athlete-achievement.component.html',
    styleUrls:['./athlete-achievement.component.css'],
    standalone:true,
    imports:[CommonModule,AthleteDashboardSidebarComponent,MaterialModule,LoaderComponent,MatDialogModule]
})

export class AthleteAchievementComponent implements OnInit{
  dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
    displayedColumns: string[] = ['category','level','year', 'represented', 'tournament','event','venue', 'position','document','createdBy','status','action'];
    athleteAchievementData!:AthleteAchievementOjectItem;
    dataSource!:any;
    loader:boolean = false;
    userDetails:any;
    fileBaseUrl = environment.fileUrl;
    fileBaseUrlActc = environment.fileUrlACTC
    @ViewChild('deleteModal') deleteModal:any;
    deleteModalRef:any;
    deleteRowData:any

    constructor(private athleteDashboardService:AthleteDashboardService,private storageService:StorageService, private modalService:NgbModal,
      private tournamentService:TournamentService,private _alertService:AlertService){}

    ngOnInit() {
      this.userDetails=this.storageService.getUserDetails();
      this.getAthleteAchievement()
    }

    getAthleteAchievement(){
      this.loader = true
      this.athleteDashboardService.athleteAchievementDetail(this.userDetails.user_id).pipe(first()).subscribe({
        next:(response:any)=>{
          this.loader = false
          this.athleteAchievementData = response;
          // console.log(response)
          this.dataSource=new MatTableDataSource<AthleteAchievementOjectItem>(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
        },
        error:()=>{
          this.loader = false
          console.error('caugth in athlet achievement API')
        }
      })
    }
    addAchievement(){
      const modalRef = this.modalService.open(AthleteDetailsAchievementComponent,{size:'xl',centered:true,  backdrop: 'static', keyboard: false});
      modalRef.result.then((thenRes)=>{
        if(thenRes){
          this.getAthleteAchievement();
        }
      }).catch(()=>{})
    }
    
    editAchievement(rowData:any){
      const modalRef = this.modalService.open(AthleteEditAchievementComponent,{centered:true, size:'md'});
      modalRef.componentInstance.editRowData = rowData;
      modalRef.result.then((thenRes)=>{
        if(thenRes){
          this.getAthleteAchievement();
        }
      }).catch(()=>{})

    }
    deleteAchievement(rowData:any){
      this.deleteRowData=rowData;
      this.deleteModalRef = this.modalService.open(this.deleteModal,{centered:true, size:'md'})
    }

    confirmDelete(){
      this.loader = true
      this.tournamentService.deleteAthleteAchievementDetail(this.deleteRowData.player_achievement_detail_id).subscribe({
        next:(response)=>{
          this.loader = true;
          if(response){
            this.deleteModalRef.close();
            this.getAthleteAchievement();
          }
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
    }


    
    openDialog(row:any) {
      const dialogRef = this.dialog.open(VerifyAchievementPopupComponent,{
        panelClass: 'custom-dialog-panel-modal',
        data:{
          message: 'Do you want to verify the achievement?',
          tournamentName:row?.tournament_name,
          buttonText: {
            ok: 'Approve',
            cancel: 'Reject'
          }
        }
      });


      dialogRef.afterClosed().subscribe((confirmData: any) => {
        if (confirmData?.isVerify) {
          this.verifyPlayerAchievement(row?.player_achievement_detail_id,confirmData?.status)
        }
      });
    }

    verifyPlayerAchievement(achievementId:number,status:number){
      this.loader = true
      this.athleteDashboardService.verifyPlayerAchievement(achievementId,status).subscribe({
        next:(response:any)=>{
          this.loader = true;
          if(response){
          this.getAthleteAchievement()
            this.loader=false
            this._alertService.swalPopSuccess(response?.messaage)
          }
        },
        error:(err)=>{
          this.loader = false;
          this._alertService.swalPopSuccess('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
        }
      })
    }
    gmsApiCall(rowData:any){
      this.loader = true;
      this.athleteDashboardService.getCertificateForParticipant(rowData.certificate_no,rowData.is_merit ? 1 : 0).subscribe({
        next:(res:any)=>{
          this.loader = false
          console.log(res)
          if(res.status) this.openBase64InNewTab(res.encodeString,rowData.certificate_no, 'application/pdf');
        },
        error:(err)=>{
          console.error(err)
          this.loader = false;
          this._alertService.swalPopError('Certificate Not Available')
        }
      })
    }
    openBase64InNewTab(base64Data: string,certificate_no:string, contentType: string) {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });

      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      // for download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = certificate_no;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(link.href);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    }
}