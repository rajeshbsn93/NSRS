import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { CoachAddSportsEducationComponent } from './coach-add-sports-education/coach-add-sports-education.component';
import { CommonSportSpecificEducationService, GetSportSpecificEducation } from 'src/app/_common/services/role-inner-pages-services/common-role-services/common-sport-specific-education.service';
import { first } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coach-sports-specific-education-modal',
  templateUrl: './coach-sports-specific-education-modal.component.html',
  styleUrls: ['./coach-sports-specific-education-modal.component.css'],
  standalone: true,
  imports: [CommonModule, LoaderComponent],
})
export class CoachSportsSpecificEducationModalComponent implements OnInit {
  educationDetails: GetSportSpecificEducation[] = [];
  loader: boolean = false;
  readonly fileBaseUrl = environment.fileUrl;
  @ViewChild('deleteModal') deleteModal:any;
  deleteModalRef:any;
  deleteRowData:any

  constructor(
    public activeModal: NgbActiveModal,
    private storageService: StorageService,
    private modal: NgbModal,
    private commonSportSpecificEducationService: CommonSportSpecificEducationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (this.storageService.getUserDetails()?.user_id) this.getDetails();
  }

  getDetails() {
    this.loader = true;
    this.commonSportSpecificEducationService.getOfficialDisciplineSpecificEducationDetails(
      this.storageService.getUserDetails().user_id
    ).pipe(first()).subscribe({
      next: (response: GetSportSpecificEducation[]) => {
        this.educationDetails = response;
        this.loader = false;
      },
      error: () => {
        this.loader = false;
        console.error('Error caught in getOfficialDisciplineSpecificEducationDetails API');
        this.alertService.swalPopError('Something went wrong!');
      }
    });
  }

  openAddSportsEducationModal() {
    const modalRef = this.modal.open(CoachAddSportsEducationComponent, {centered: true, size: 'xl', backdrop: 'static', keyboard: false});
    modalRef.result.then((result: boolean) => {
      if (result) this.getDetails();
    });
  }
  deleteEducation(record:any){
    console.log(record)
    this.deleteRowData=record;
    this.deleteModalRef = this.modal.open(this.deleteModal,{centered:true, size:'md'})
  }
  confirmDelete(){
    this.loader = true
      this.commonSportSpecificEducationService.deleteOfficialDisciplineSpecificEducation(this.deleteRowData.official_sport_spfic_id).subscribe({
        next:(response)=>{
          this.loader = true;
          if(response){
            this.alertService.swalPopSuccess('Deleted successfully!')
            this.deleteModalRef.close();
             this.getDetails();
          }
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
  }
}
