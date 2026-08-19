import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "../../loader/loader.component";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { GetGameStateUniDetailEntity, GetGameStateUniDetailsEntity, KheloIndiaGamesService } from "src/app/_common/services/common-services/khelo-india-games.service";
import { Subject, takeUntil } from "rxjs";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { MaterialModule } from "src/app/_common/material.module";
import { MatTableDataSource } from "@angular/material/table";
import { KheloIndiaGamesEditModalComponent } from "../khelo-india-games-edit-modal/khelo-india-games-edit-modal.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { KheloIndiaGamesCertificatesModalComponent } from "../khelo-india-games-certificates-modal/khelo-india-games-certificates-modal.component";

@Component({
    selector:'app-khelo-india-games-view-modal',
    templateUrl:'./khelo-india-games-view-modal.component.html',
    styleUrls:['./khelo-india-games-view-modal.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent, MaterialModule, NgbTooltipModule]
})
export class KheloIndiaGamesViewModalComponent implements OnInit{
    loader:boolean = false;
    userDetails:any;
    kheloIndiaPlayerTableColumns:String[] =['gameName','st_Uni_name','status','action']
    subject:Subject<any> = new Subject();
    @ViewChild(MatPaginator) paginator!:MatPaginator;
    @ViewChild(MatSort) sort!:MatSort;
    @ViewChild('deleteModalRef') deleteModalRef:any
    KheloIndiaPlayerData = new MatTableDataSource<GetGameStateUniDetailsEntity>();
    deleteGameRow!:GetGameStateUniDetailEntity;
    deleteModal:any;

    constructor(
        public activeModal:NgbActiveModal,
        private storageService:StorageService,
        private kheloIndiaGamesService:KheloIndiaGamesService,
        private alertService:AlertService,
        private modalService:NgbModal
        ){}
    ngOnInit(): void {
        this.userDetails = this.storageService.getUserDetails();
        this.getGameStateUniDetail();
    }
    getGameStateUniDetail(){
        this.loader = true
        this.kheloIndiaGamesService.getGameStateUniDetail(
            this.userDetails.user_id,
            this.userDetails.role_id
            ).pipe(
                takeUntil(this.subject)
                ).subscribe({
                    next:(res:any)=>{
                        this.loader = false;
                        // console.log(res) 
                        const filterData = res.data.filter((item:any)=>item.gameId!=0);
                        if(res.status){
                            this.KheloIndiaPlayerData = new MatTableDataSource<GetGameStateUniDetailsEntity>(filterData);
                            this.KheloIndiaPlayerData.paginator = this.paginator;
                            this.KheloIndiaPlayerData.sort = this.sort

                        }else{
                        this.alertService.swalPopError(res.message)
                        }
                    },
                    error:(err)=>{
                        this.loader = false
                    }
                    })
    }
    addEditKheloIndiaGames(data:any){
        const modalRef = this.modalService.open(
            KheloIndiaGamesEditModalComponent,
            {
                size:'xl',
                centered:true,
                backdrop:'static',
                keyboard:false
            }
        )
        modalRef.componentInstance.rowData = data;
        modalRef.result
        .then((res)=>{
            this.getGameStateUniDetail();

        })
        .catch((res)=>{
        })
    }

    deleteGame(rowData:any){
        console.log(rowData)
        this.deleteGameRow = rowData
       this.deleteModal =  this.modalService.open(
            this.deleteModalRef,
            {
                centered:true,
                size:'md'
            }
            )
    }
    confirmDelete(){
        this.loader = true;
        this.kheloIndiaGamesService.deleteGameStateUniDetail(
            this.deleteGameRow.id,
            this.userDetails.role_id,
            this.userDetails.user_id
            ).subscribe({
            next:(response:any)=>{
                this.loader = false
                console.log(response)
                if(response.status){
                    this.deleteModal.close();
                    this.alertService.swalPopSuccess(response.message)
                    this.getGameStateUniDetail();
                }else{
                    this.alertService.swalPopError(response.message)
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }

    downloadImage(rowData:any){
        // console.log(rowData)
        let galaryPath= rowData.galaryPath;
        if(galaryPath==''){
            this.alertService.swalPopWarning('No Images Found!')
        }else{
            this.kheloIndiaGamesService.downloadTournamentGalary(galaryPath).subscribe({
                next:(res:any)=>{
                    // console.log(res)
                    let anchor = document.createElement('a')
                    anchor.download = this.userDetails.nsrs_id+'_'+rowData.gamename;
                    anchor.href = window.URL.createObjectURL(res)
                    anchor.click();
                    anchor.remove();
                },
                error:(err)=>{
                    console.error(err)
                }
            })
        }      
    }

    certificates(data:any){
        // console.log(data)

        const modalRef = this.modalService.open(
            KheloIndiaGamesCertificatesModalComponent,
            {
                size:'xl',
                centered:true,
                backdrop:'static',
                keyboard:false
            }
        )
        
        modalRef.componentInstance.certificateDetailsData = data
        modalRef.result
        .then((res)=>{

        })
        .catch((res)=>{
        })
    }
}