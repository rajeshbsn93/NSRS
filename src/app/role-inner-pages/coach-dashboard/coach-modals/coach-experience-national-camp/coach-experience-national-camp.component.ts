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
import { CoachAchievementService, CoachExpNationalCampEntity } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { AddEditExperienceNationalCampComponent } from "../add-edit-experience-national-camp/add-edit-experience-national-camp.component";

@Component({
    selector:'app-coach-experience-national-camp',
    templateUrl:'./coach-experience-national-camp.component.html',
    styleUrls:['./coach-experience-national-camp.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class CoachExperienceNationalCampComponent implements OnInit{
    loader:boolean = false;
    userDetails:any;
    @ViewChild('deleteExperience') deleteExperience:any;
    deleteExperienceModalRef:any
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<CoachExpNationalCampEntity>();
    experienceTableColumns:string[] = ['sl','designation','Category','from_Date','nsrs_id_academy','academy','action'];

    deleteRowData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private coachAchievementService:CoachAchievementService,private storageService:StorageService,
        private alertService:AlertService, private modalService:NgbModal){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.getCoachExpNationalCamp()
             
    }

    getCoachExpNationalCamp(){
        this.loader = true;
        this.coachAchievementService.coachExpNationalCamp(this.userDetails.user_id).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.experienceTableData = new MatTableDataSource<CoachExpNationalCampEntity>(response);
                this.experienceTableData.paginator = this.paginator
                this.experienceTableData.sort = this.sort
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
        this.coachAchievementService.deleteCoachExpNationalCamp(this.deleteRowData.id).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.getCoachExpNationalCamp();
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
        const modalRef = this.modalService.open(AddEditExperienceNationalCampComponent,{centered:true,size:'xl',backdrop:'static',keyboard:false});
        modalRef.componentInstance.editData = data;
        modalRef.result.then((thenRes)=>{
            if(thenRes){
                this.getCoachExpNationalCamp();
            }
        }).catch(()=>{})
    }
}