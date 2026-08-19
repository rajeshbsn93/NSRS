import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription, first } from "rxjs";
import { AthleteDashboardIRootObject } from "src/app/_common/models/athlete-dashboard";
import { AthleteDashboardService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service";

@Component({
    selector:'app-top-insured-kia',
    template:`
    <div class="athlete-top-row d-flex flex-wrap">
    <div *ngIf="athleteDashboardData?.isInsured" class="list justify-content-center fw-bold me-2">INSURED</div>
    <ng-container *ngIf="currentFASchemesData != (null || '')">
    <div class="list justify-content-center fw-bold me-2">KIA</div>
    <div class="list justify-content-center fw-bold">TOPS</div>
    </ng-container>
</div>
    `,
    styles:[`
    .athlete-top-row .list{padding: 5px 25px;display: inline-flex;background-color: #8BE2DF;color: #1B6866;border-radius: 2px;font-size: 14px; min-width: 95px;}
    .athlete-top-row .list:nth-child(2){background-color: #FFF1E5;color: #BB5905;}
    .athlete-top-row .list:nth-child(3){background-color: #FBE5FF;color: #74008A;}
    `],
    standalone:true,
    imports:[CommonModule]
})

export class TopInsuredKiaComponent implements OnInit, OnDestroy{
    
    //@Input() topRowData:any;
    currentFASchemesData:any;
    subscription!:Subscription;
    athleteDashboardData!:AthleteDashboardIRootObject

    constructor(private athleteDashboardService:AthleteDashboardService){}

    ngOnInit(): void {
        // this.currentFASchemesData = this.topRowData?.currentFASchemes.split(",")
        // console.log(this.currentFASchemesData)
        this.subscription = this.athleteDashboardService.GetAthleteDashboardData(216912).pipe(first()).subscribe({
            next:(response)=>{
                this.athleteDashboardData = response
                this.currentFASchemesData = this.athleteDashboardData?.currentFASchemes.split(",")
            },
            error:()=>{
                console.error('caught in athleteDashboardService API')
            }
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}