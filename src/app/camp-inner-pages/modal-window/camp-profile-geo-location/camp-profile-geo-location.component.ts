import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription, map } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { CampGeolocationEntity, CampInnerPagesService } from "src/app/_common/services/camp-services/camp-inner-pages.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachAchievementService, CoachExpNationalCampEntity } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-camp-profile-geo-location',
    templateUrl:'./camp-profile-geo-location.component.html',
    styleUrls:['./camp-profile-geo-location.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class CampProfileGeoLocationComponent implements OnInit, OnDestroy{
    loader:boolean = false;
    userDetails:any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableColumns:string[] = ['gender','location','venue','radius','time'];
    campGeolocationListData!:MatTableDataSource<CampGeolocationEntity>;
    subscription:Subscription = new Subscription()

    constructor(public activeModal:NgbActiveModal,private storageService:StorageService,private campInnerPagesService:CampInnerPagesService,
        private datePipe:DatePipe){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.getCampGeolocation();
    }

    getCampGeolocation(){
      this.loader =true
     this.subscription = this.campInnerPagesService.campGeolocationProfile(this.userDetails.user_id).pipe(map((items:any)=>{
        return items
        .map((item:any,index:number)=>{
            return {...item,start_Time:item.start_Time ? this.datePipe.transform(item.start_Time,'HH:mm') : item.start_Time,
                    end_Time:item.end_Time ? this.datePipe.transform(item.end_Time,'HH:mm') : item.end_Time
                    }
        })
      })).subscribe({
        next:(response)=>{
          this.loader =false;
          // console.log(response)
          const tableData:CampGeolocationEntity[] = response;
          this.campGeolocationListData = new MatTableDataSource<CampGeolocationEntity>(tableData);
          this.campGeolocationListData.paginator = this.paginator;
          this.campGeolocationListData.sort = this.sort;
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
    }
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}