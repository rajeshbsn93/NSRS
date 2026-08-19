import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachAchievementService, CoachAchievementAsPlayerEntity, CoachAchievementPlayer } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-coach-popup-pfrofile-best-achievement',
    templateUrl:'./coach-popup-pfrofile-best-achievement.component.html',
    styleUrls:['./coach-popup-pfrofile-best-achievement.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class CoachPopupProfileBestAchievementComponent implements OnInit{
    loader:boolean = false;
    official_detail_id:any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    achievementTableData = new MatTableDataSource<CoachAchievementPlayer>();
    achievementTableColumns:string[] = ['category','level','year', 'represented', 'tournament','event','venue', 'position','document'];
    userDetails:any;
    fileBaseUrl = environment.fileUrl;
    fileBaseUrlActc = environment.fileUrlACTC
    constructor(public activeModal:NgbActiveModal,private storageService:StorageService,
        private coachAchievementService:CoachAchievementService){}

    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails();
        this.getCoachAchievementAsPlayer()
             
    }

    getCoachAchievementAsPlayer(){
        this.loader = true;
        this.coachAchievementService.GetCoachAchieveMent(this.official_detail_id,2).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.achievementTableData = new MatTableDataSource<CoachAchievementPlayer>(response);
                this.achievementTableData.paginator = this.paginator
                this.achievementTableData.sort = this.sort
            },
            error:(err)=>{
                this.loader = false
                console.error(err)
            }
        })
    }
}