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
import { CoachAddIdProofModalComponent } from './coach-add-id-proof-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coach-id-proof-modal',
  templateUrl: './coach-id-proof-modal.component.html',
  styleUrls: ['./coach-id-proof-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, MatExpansionModule, MatButtonModule, MatIconModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
  ],
})
export class CoachIdProofModalComponent implements OnInit {
  readonly fileBaseUrl = environment.fileUrl;
  readonly docTypes = DOC_TYPE;
  idProofDetails: any = [];
  loader: boolean = false;
  firstDoc: DOC_TYPE | null = null;
  isAllDocsUploaded: boolean = false;
  isNoDocUploaded: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private storageService: StorageService,
    private coachIdProofService: CoachIdProofService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.storageService.getUserDetails()?.user_id) {
      this.getOfficialDocumentDetails();
    }
  }

  getOfficialDocumentDetails() {
    this.loader = true;
      this.coachIdProofService.getOfficialDocumentInfo(this.storageService.getUserDetails().user_id)
        .pipe(first())
        .subscribe({
          next: (response: any) => {
            this.idProofDetails = response;
            // if (response.aadhar_number) this.firstDoc = DOC_TYPE.AADHAR;
            // else if (response.passport_number) this.firstDoc = DOC_TYPE.PASSPORT;
            if (response.passport_number) this.firstDoc = DOC_TYPE.PASSPORT;
            else if (response.voter_id_number) this.firstDoc = DOC_TYPE.VOTER_ID;
            else if (response.pancard_number) this.firstDoc = DOC_TYPE.PAN_CARD;
            else if (response.dob_path || response.birth_certificate_path) this.firstDoc = DOC_TYPE.DOB;
            else if (response.service_id_image_path || response.coaching_certificate_image) this.firstDoc = DOC_TYPE.OTHERS;
            this.loader = false;

            this.isAllDocsUploaded = response.aadhar_number && response.passport_number && response.voter_id_number && 
                                     response.pancard_number && (response.dob_path || response.birth_certificate_path) &&
                                     (response.service_id_image_path || response.coaching_certificate_image);

            this.isNoDocUploaded = !response.aadhar_number && !response.passport_number && !response.voter_id_number &&
                                   !response.pancard_number && !response.dob_path && !response.birth_certificate_path &&
                                   !response.service_id_image_path && !response.coaching_certificate_image;
          },
          error: () => {
            this.loader = false;
            this.alertService.swalPopError('Something went wrong!');
          }
      });
  }

  openAddIdProofModal(docType: DOC_TYPE | null = null) {
    const modalRef = this.modalService.open(
      CoachAddIdProofModalComponent, {centered: true, size: 'lg', backdrop: 'static', keyboard: false}
    );

    const existingDocs: DOC_TYPE[] = [];
    if (docType) {
      modalRef.componentInstance.isEdit = true;
      modalRef.componentInstance.docTypesArray = [docType];
      modalRef.componentInstance.docTypeControl.setValue(docType);

      switch(docType) {
        // case DOC_TYPE.AADHAR:
        //   modalRef.componentInstance.form.get('aadhar_number').setValue(this.idProofDetails.aadhar_number);
        //   modalRef.componentInstance.doc_path = this.idProofDetails.aadhar_image_path;
        //   break;
          
        case DOC_TYPE.PASSPORT:
          modalRef.componentInstance.form.get('passport_number').setValue(this.idProofDetails.passport_number);
          modalRef.componentInstance.form.get('passport_expiry_date').setValue(this.idProofDetails.passport_expiry_date);
          modalRef.componentInstance.doc_path = this.idProofDetails.passport_image_path;
          modalRef.componentInstance.doc_path2 = this.idProofDetails.passport_last_image_path;
          break;
        
        case DOC_TYPE.VOTER_ID:
          modalRef.componentInstance.form.get('voter_id_number').setValue(this.idProofDetails.voter_id_number);
          modalRef.componentInstance.doc_path = this.idProofDetails.voter_id_image_path;
          break;
        
        case DOC_TYPE.PAN_CARD:
          modalRef.componentInstance.form.get('pancard_number').setValue(this.idProofDetails.pancard_number);
          modalRef.componentInstance.doc_path = this.idProofDetails.pancard_image_path;
          break;

        case DOC_TYPE.DOB:
          modalRef.componentInstance.doc_path = this.idProofDetails.dob_path;
          modalRef.componentInstance.doc_path2 = this.idProofDetails.birth_certificate_path;
          break;

        case DOC_TYPE.OTHERS:
          modalRef.componentInstance.doc_path = this.idProofDetails.service_id_image_path;
          modalRef.componentInstance.doc_path2 = this.idProofDetails.coaching_certificate_image;
          break;

        default:
          break;
      }
    } else {
      // if (this.idProofDetails.aadhar_number) existingDocs.push(DOC_TYPE.AADHAR);
      if (this.idProofDetails.passport_number) existingDocs.push(DOC_TYPE.PASSPORT);
      if (this.idProofDetails.voter_id_number) existingDocs.push(DOC_TYPE.VOTER_ID);
      if (this.idProofDetails.pancard_number) existingDocs.push(DOC_TYPE.PAN_CARD);
      if (this.idProofDetails.dob_path || this.idProofDetails.birth_certificate_path) existingDocs.push(DOC_TYPE.DOB);
      if (this.idProofDetails.service_id_image_path || this.idProofDetails.coaching_certificate_image) existingDocs.push(DOC_TYPE.OTHERS);
      modalRef.componentInstance.alreadyExistingDocs = existingDocs;
    }

    modalRef.result.then((result) => {
      if (result) this.getOfficialDocumentDetails();
    });
  }
}
