import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachAchievementService, CoachAchievementAsPlayerEntity, CoachAchievementPlayer } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { AddEditCoachBestAchievementComponent } from "../add-edit-coach-best-achievement/add-edit-coach-best-achievement.component";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-coach-best-achievement',
    templateUrl:'./coach-best-achievement.component.html',
    styleUrls:['./coach-best-achievement.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class CoachBestAchievementComponent implements OnInit{
    loader:boolean = false;
    userDetails:any;
    @ViewChild('deleteExperience') deleteExperience:any;
    deleteExperienceModalRef:any
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    achievementTableData = new MatTableDataSource<CoachAchievementPlayer>();
    fileBaseUrl = environment.fileUrl;
    fileBaseUrlActc = environment.fileUrlACTC
    achievementTableColumns: string[] = ['category','level','year', 'represented', 'tournament','event','venue', 'position','document','action'];
    deleteRowData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private coachAchievementService:CoachAchievementService,private storageService:StorageService,
        private alertService:AlertService, private modalService:NgbModal){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.getCoachAchievementAsPlayer();
    }

    getCoachAchievementAsPlayer(){
        this.loader = true;
         this.coachAchievementService.GetCoachAchieveMent(this.userDetails.user_id,this.userDetails.role_id).subscribe({
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


    deleteRow(rowData:any){
        this.deleteRowData = rowData;
        this.deleteExperienceModalRef = this.modalService.open(this.deleteExperience, {centered:true})

    }

    confirmDelete(){
        this.loader = true;
        this.coachAchievementService.deleteCoachAchievementRcd(this.userDetails?.user_id,this.deleteRowData?.official_detail_id,this.deleteRowData?.coach_achievement_detail_id ).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.getCoachAchievementAsPlayer();
                    this.deleteExperienceModalRef.close();
                    this.alertService.swalPopSuccess('Deleted Successfully!');
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }

    addEdit(data:any){
        const modalRef = this.modalService.open(AddEditCoachBestAchievementComponent,{centered:true,size: data?'md' :'xl',backdrop:'static',keyboard:false});
        modalRef.componentInstance.editRowData = data;
        modalRef.result.then((thenRes)=>{
            if(thenRes){
                this.getCoachAchievementAsPlayer();
            }
        }).catch(()=>{})
    }

}