import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AthleteAddEducationInfoComponent } from '../athlete-add-education-info/athlete-add-education-info.component';
import { AthleteEducationEntity, AthleteEducationInfoService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-education-info.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-athlete-education',
  templateUrl: './athlete-education.component.html',
  styleUrls: ['./athlete-education.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, LoaderComponent]
})
export class AthleteEducationComponent implements OnInit {
  educationDetails: AthleteEducationEntity[] = [];
  loader: boolean = false;
  @ViewChild('deleteModal') deleteModal:any;
  deleteModalRef:any;
  deleteRowData:any

  constructor(
    public activeModal: NgbActiveModal, 
    private modal: NgbModal, 
    private athleteEducationInfoService: AthleteEducationInfoService,
    private storageService: StorageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getAthleteEducationDetails();
  }

  getAthleteEducationDetails() {
    this.loader = true;
    const user_id = this.storageService.getUserDetails()?.user_id;
    if (user_id)
      this.athleteEducationInfoService.getEducationInfo(user_id).subscribe({
        next: (response: AthleteEducationEntity[]) => {
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

  openAddEducationInfoModal(editEducation: AthleteEducationEntity | null = null) {
    // this.activeModal.close();
    if (editEducation && editEducation.passing_status?.toLowerCase() !== 'ongoing') return;
    const modalRef = this.modal.open(AthleteAddEducationInfoComponent, {centered: true, size: 'xl', backdrop: 'static', keyboard: false});
    if (editEducation) modalRef.componentInstance.editEducation = editEducation;
    modalRef.result.then((result) => {
      if (result) this.getAthleteEducationDetails();
    });
  }

  deleteEducation(record:any){
    // console.log(record)
    this.deleteRowData=record;
    this.deleteModalRef = this.modal.open(this.deleteModal,{centered:true, size:'md'})
  }
  confirmDelete(){
    this.loader = true
      this.athleteEducationInfoService.deleteEducation(this.deleteRowData.player_education_id).subscribe({
        next:(response)=>{
          this.loader = true;
          if(response){
            this.alertService.swalPopSuccess('Deleted successfully')
            this.deleteModalRef.close();
            this.getAthleteEducationDetails();
          }
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
  }

}
