import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { resarch_ExperienceEntity, researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { AddEditResearchExperienceComponent } from "../add-edit-research-experience/add-edit-research-experience.component";

@Component({
    selector:'app-research-experience',
    templateUrl:'./research-experience.component.html',
    styleUrls:['./research-experience.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule]
})

export class ResearchExperienceComponent implements OnInit{
    loader:boolean = false;
    experienceList:Array<any> = [];
    userDetails:any;
    @ViewChild('deleteExperience') deleteExperience:any;
    deleteExperienceModalRef:any
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<resarch_ExperienceEntity>();
    experienceTableColumns:string[] = ['sl','year_of_experience','institute_of_research','remark','action'];

    deleteRowData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService, private modalService:NgbModal){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.createExperience(100);
        this.getResarchExperience()
             
    }
    createExperience(number:number){
        for(let i =0; i<=number; i++){
            this.experienceList.push(i)
        }
        return this.experienceList
    }

    getResarchExperience(){
        this.loader = true;
        this.experienceService.resarch_Experience(this.userDetails.user_id).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.experienceTableData = new MatTableDataSource<resarch_ExperienceEntity>(response);
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
        this.experienceService.DeleteResarchExperience(this.deleteRowData.research_experience_details_id).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.getResarchExperience();
                    this.deleteExperienceModalRef.close();
                    this.alertService.swalPopSuccess('Deleted Successfully!');
                }
            }
        })
    }

    AddEdit(data:any){
      const modalRef =  this.modalService.open(AddEditResearchExperienceComponent,{centered:true, size:'xl',backdrop:'static',keyboard:false});
      modalRef.componentInstance.editData = data;
      modalRef.result.then((thenRes)=>{
        if(thenRes){
            this.getResarchExperience();
        }
      }).catch(()=>{})
    }
}