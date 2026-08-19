import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { CoachIdProofService, DOC_TYPE } from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-id-proof.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-official-popup-profile-id-proof-modal',
  templateUrl: './official-popup-profile-id-proof-modal.component.html',
  styleUrls: ['./official-popup-profile-id-proof-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, MatExpansionModule, MatButtonModule, MatIconModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
  ],
})
export class OfficialPopupProfileIdProofModalComponent implements OnInit {
  readonly fileBaseUrl = environment.fileUrl;
  readonly docTypes = DOC_TYPE;
  idProofDetails: any = [];
  loader: boolean = false;
  firstDoc: DOC_TYPE | null = null;
  isAllDocsUploaded: boolean = false;
  isNoDocUploaded: boolean = false;
  popupDataReceived:any

  constructor(
    public activeModal: NgbActiveModal,
    private storageService: StorageService,
    private coachIdProofService: CoachIdProofService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //console.log(this.popupDataReceived)
    if (this.storageService.getUserDetails()?.user_id) {
    //   this.getOfficialDocumentDetails();
    this.idProofDetails = this.popupDataReceived;
            // if (this.popupDataReceived.aadhar_number) this.firstDoc = DOC_TYPE.AADHAR;
            // else if (this.popupDataReceived.passport_number) this.firstDoc = DOC_TYPE.PASSPORT;
            if (this.popupDataReceived.passport_number) this.firstDoc = DOC_TYPE.PASSPORT;
            else if (this.popupDataReceived.voter_id_number) this.firstDoc = DOC_TYPE.VOTER_ID;
            else if (this.popupDataReceived.pancard_number) this.firstDoc = DOC_TYPE.PAN_CARD;
            else if (this.popupDataReceived.dob_path || this.popupDataReceived.birth_certificate_path) this.firstDoc = DOC_TYPE.DOB;
            else if (this.popupDataReceived.service_id_image_path || this.popupDataReceived.coaching_certificate_image) this.firstDoc = DOC_TYPE.OTHERS;
            this.loader = false;

            this.isAllDocsUploaded = this.popupDataReceived.aadhar_number && this.popupDataReceived.passport_number && this.popupDataReceived.voter_id_number && 
                                     this.popupDataReceived.pancard_number && (this.popupDataReceived.dob_path || this.popupDataReceived.birth_certificate_path) &&
                                     (this.popupDataReceived.service_id_image_path || this.popupDataReceived.coaching_certificate_image);

            this.isNoDocUploaded = !this.popupDataReceived.aadhar_number && !this.popupDataReceived.passport_number && !this.popupDataReceived.voter_id_number &&
                                   !this.popupDataReceived.pancard_number && !this.popupDataReceived.dob_path && !this.popupDataReceived.birth_certificate_path &&
                                   !this.popupDataReceived.service_id_image_path && !this.popupDataReceived.coaching_certificate_image;
    }
  }

//   getOfficialDocumentDetails() {
//     this.loader = true;
//       this.coachIdProofService.getOfficialDocumentInfo(this.popupDataReceived.official_detail_id)
//         .pipe(first())
//         .subscribe({
//           next: (response: any) => {
//             this.idProofDetails = response;
//             if (response.aadhar_number) this.firstDoc = DOC_TYPE.AADHAR;
//             else if (response.passport_number) this.firstDoc = DOC_TYPE.PASSPORT;
//             else if (response.voter_id_number) this.firstDoc = DOC_TYPE.VOTER_ID;
//             else if (response.pancard_number) this.firstDoc = DOC_TYPE.PAN_CARD;
//             else if (response.dob_path || response.birth_certificate_path) this.firstDoc = DOC_TYPE.DOB;
//             else if (response.service_id_image_path || response.coaching_certificate_image) this.firstDoc = DOC_TYPE.OTHERS;
//             this.loader = false;

//             this.isAllDocsUploaded = response.aadhar_number && response.passport_number && response.voter_id_number && 
//                                      response.pancard_number && (response.dob_path || response.birth_certificate_path) &&
//                                      (response.service_id_image_path || response.coaching_certificate_image);

//             this.isNoDocUploaded = !response.aadhar_number && !response.passport_number && !response.voter_id_number &&
//                                    !response.pancard_number && !response.dob_path && !response.birth_certificate_path &&
//                                    !response.service_id_image_path && !response.coaching_certificate_image;
//           },
//           error: () => {
//             this.loader = false;
//             this.alertService.swalPopError('Something went wrong!');
//           }
//       });
//   }
}
