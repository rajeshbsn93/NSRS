import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, first, tap } from "rxjs";
import { AthleteDashboardIRootObject } from "src/app/_common/models/athlete-dashboard";
import { AthleteDashboardService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewAadhaarComponent } from "src/app/standalone_components/modal-window/view-aadhar/view-aadhar.component";
import { AadhaarVerifyDialogComponent } from "src/app/standalone_components/modal-window/aadhaar-verify-dialog/aadhaar-verify-dialog.component";


@Component({
    selector:'app-upcoming-event',
    template:`
    <div class="row upcomming-event" *ngIf="(athleteDashboardData$ | async) as athleteDashboardData;">
            <div class="col-sm item">
                <div class="card">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div>
                            <span class="d-block">CURRENT ACADEMY</span>
                            <h4>{{athleteDashboardData?.currentAcademy ? athleteDashboardData.currentAcademy : 'NA'}}</h4>
                        </div>
                        <div class="icon">
                            <i class="icon-kiaa"></i>
                        </div>
                    </div>
                </div>
            </div>                    
            <div class="col-sm item">
                <div class="card">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div>
                            <span class="d-block">CURRENT COACH</span>
                            <h4>{{athleteDashboardData?.currentCoach ? athleteDashboardData.currentCoach : 'NA'}}</h4>
                        </div>
                        <div class="icon">
                            <img src="assets/images/Coaches.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm item">
                <div class="card"  (click)="viewAadhaarModal()" [ngClass]="athleteDashboardData?.isAadhaarVerified ? 'active-aadhar' : ''">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div>
                            <span class="d-block">AADHAAR</span>
                            <h4>{{athleteDashboardData?.isAadhaarVerified ? 'Verified' : 'Not Verified'}} 
                            <img *ngIf="athleteDashboardData?.isAadhaarVerified" src="assets/images/veryfied.svg" alt="">
                            </h4>
                        </div>
                        <div class="icon">
                            <img src="assets/images/aadhaar.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
    </div>
    <!-- <ng-template #loader>
        <app-loader></app-loader>
    </ng-template> -->
    `,
    styles:[`
    .upcomming-event .card{background-color: #FFB24D;border-color: #FFB24D;box-shadow:  0 3px 6px #FFAA3A80;padding: 15px 0;width:100%}
    .upcomming-event .item{margin-top:10px;display:flex}
    .upcomming-event .item:nth-child(2) .card{background-color: #8894DF;border-color: #8894DF;box-shadow:  0 3px 6px #AEB9FF85;}
    .upcomming-event .item:nth-child(3) .card{background-color: #DC4E5B;border-color: #DC4E5B;box-shadow: 0 3px 6px #FF9CA6A3;}
    .upcomming-event .card span{color: #fff;font-size: 10px;}
    .upcomming-event .card h4{color: #fff;font-weight: bold;font-size: 16px;}
    .upcomming-event .icon{width: 34px;height: 34px;display: inline-flex;background-color: #FFFFFF;justify-content: center;align-items: center;
    border-radius: 3px;}
    .upcomming-event .icon i::before{color: #FFB24D;}
    .upcomming-event .item:nth-child(3) .card.active-aadhar{background-color: #49a54d;
    border-color: #49a54d;
    box-shadow: 0 3px 6px #49a54da6;
    cursor: pointer;}
    
    `],
    standalone:true,
    imports:[CommonModule,LoaderComponent]
})

export class UpcommingEventComponent implements OnInit {
    athleteDashboardData$:Observable<any> = new Observable();
    userDetails:any

    constructor(private athleteDashboardService:AthleteDashboardService,private storageService:StorageService,
        private modalService:NgbModal){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails()
        this.athleteDashboardData$ = this.athleteDashboardService.GetAthleteDashboardData(this.userDetails.user_id)
        .pipe(
            first(),
            tap(response=>{
                // console.log(response)
                if(!response.isAadhaarVerified){
                    const modalRef = this.modalService.open(
                        AadhaarVerifyDialogComponent,
                        {
                            size:'md',
                            centered:true,
                            backdrop:'static'
                        }
                    )
                }
            })
        )
    }
    viewAadhaarModal(){
       const modalRef = this.modalService.open(ViewAadhaarComponent,{size:'lg', centered:true,backdrop:'static'})
    }
}