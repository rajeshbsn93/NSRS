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
import { teaching_ExperienceEntity, researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { AddEditPublicationComponent } from "../add-edit-publication/add-edit-publication.component";

@Component({
    selector:'app-publication',
    templateUrl:'./publication.component.html',
    styleUrls:['./publication.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class PublicationComponent implements OnInit{
    loader:boolean = false;
    userDetails:any;
    @ViewChild('deleteExperience') deleteExperience:any;
    deleteExperienceModalRef:any
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<teaching_ExperienceEntity>();
    experienceTableColumns:string[] = ['sl','type','name','date_of_publication','action'];

    deleteRowData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService, private modalService:NgbModal){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.getPublication_details()
             
    }

    getPublication_details(){
        this.loader = true;
        this.experienceService.publication_details(this.userDetails.user_id).subscribe({
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
        this.experienceService.DeletePublicationDetails(this.deleteRowData.publication_detail_id).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.getPublication_details();
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
        const modalRef = this.modalService.open(AddEditPublicationComponent,{centered:true,size:'xl',backdrop:'static',keyboard:false});
        modalRef.componentInstance.editData = data;
        modalRef.result.then((thenRes)=>{
            if(thenRes){
                this.getPublication_details();
            }
        }).catch(()=>{})
    }
}