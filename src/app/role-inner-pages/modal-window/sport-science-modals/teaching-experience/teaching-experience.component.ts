import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { teaching_ExperienceEntity, researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { AddEditTeachingExperienceComponent } from "../add-edit-teaching-experience/add-edit-teaching-experience.component";

@Component({
    selector:'app-teaching-experience',
    templateUrl:'./teaching-experience.component.html',
    styleUrls:['./teaching-experience.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule]
})

export class TeachingExperienceComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    experienceList:Array<any> = [];
    userDetails:any;
    @ViewChild('deleteExperience') deleteExperience:any;
    deleteExperienceModalRef:any
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<teaching_ExperienceEntity>();
    experienceTableColumns:string[] = ['sl','year_of_experience','institute_of_teaching','remark','action'];

    deleteRowData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService, private modalService:NgbModal){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            year_of_experience:['', [Validators.required]],            
            institute_of_teaching:['', [Validators.required]],            
            remark:[''],
            teaching_experience_details_id:['']            
        });
        this.createExperience(100);
        this.getTeachingExperience()
             
    }
    createExperience(number:number){
        for(let i =0; i<=number; i++){
            this.experienceList.push(i)
        }
        return this.experienceList
    }

    getTeachingExperience(){
        this.loader = true;
        this.experienceService.teaching_Experience(this.userDetails.user_id).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.experienceTableData = new MatTableDataSource<teaching_ExperienceEntity>(response);
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
        this.experienceService.DeleteTeachingExperience(this.deleteRowData.teaching_experience_details_id).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.getTeachingExperience();
                    this.deleteExperienceModalRef.close();
                    this.experienceForm.reset('');
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
      const modalRef =  this.modalService.open(AddEditTeachingExperienceComponent,{centered:true, size:'xl', backdrop:'static', keyboard:false});
      modalRef.componentInstance.editData = data;
      modalRef.result.then((thenRes)=>{
        if(thenRes){
            this.getTeachingExperience();
        }
      }).catch(()=>{})

    }
}