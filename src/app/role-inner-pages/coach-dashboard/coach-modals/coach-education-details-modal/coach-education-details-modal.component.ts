import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { 
  CoachEducationInfoService, OfficialEducationEntity
} from "src/app/_common/services/role-inner-pages-services/coach-services/coach-education-info.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { CoachAddEducationInfoComponent } from "../coach-add-education-info/coach-add-education-info.component";

@Component({
selector:'app-coach-education-details-modal',
templateUrl:'./coach-education-details-modal.component.html',
styleUrls:['./coach-education-details-modal.component.css'],
standalone:true,
imports:[CommonModule, LoaderComponent]
})
export class CoachEducationDetailsModalComponent implements OnInit{
  educationDetails: OfficialEducationEntity[] = [];
  loader: boolean = false;
  @ViewChild('deleteModal') deleteModal:any;
  deleteModalRef:any;
  deleteRowData:any

    constructor(
      public activeModal: NgbActiveModal, 
      private modal: NgbModal, 
      private coachEducationInfoService: CoachEducationInfoService,
      private storageService: StorageService,
      private alertService: AlertService
    ) {}

    ngOnInit(): void {
      this.getOfficialEducationDetails();
  }

  getOfficialEducationDetails() {
    this.loader = true;
    const user_id = this.storageService.getUserDetails()?.user_id;
    if (user_id)
      this.coachEducationInfoService.getEducationInfo(user_id).subscribe({
        next: (response: OfficialEducationEntity[]) => {
          this.loader = false;
          if (response?.length)
            this.educationDetails = response;
          else
            this.educationDetails = [];
        },
        error: () => {
          this.loader = false;
          this.alertService.swalPopError('Something went wrong! Please try again.');
        }
      })
  }

  openAddEducationInfoModal(editEducation: OfficialEducationEntity | null = null) {
    // this.activeModal.close();
    if (editEducation && editEducation.passing_status?.toLowerCase() !== 'ongoing') return;
    const modalRef = this.modal.open(CoachAddEducationInfoComponent, {centered: true, size: 'xl', backdrop: 'static', keyboard: false});
    if (editEducation) modalRef.componentInstance.editEducation = editEducation;
    modalRef.result.then((result) => {
      if (result) this.getOfficialEducationDetails();
    });
  }

  deleteEducation(record:any){
    // console.log(record)
    this.deleteRowData=record;
    this.deleteModalRef = this.modal.open(this.deleteModal,{centered:true, size:'md'})
  }
  confirmDelete(){
    this.loader = true
      this.coachEducationInfoService.deleteEducation(this.deleteRowData.official_education_id).subscribe({
        next:(response)=>{
          this.loader = true;
          if(response){
            this.alertService.swalPopSuccess('Deleted successfully!')
            this.deleteModalRef.close();
             this.getOfficialEducationDetails();
          }
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
  }

}