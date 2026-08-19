import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { CoachIdProofService, DOC_TYPE } from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-id-proof.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coach-add-id-proof-modal',
  standalone: true,
  template:  `
    <div class="modal-body id-proof-modal">
  <!-- <button type="button" class="close-btn" aria-label="Close" (click)="activeModal.close(false)"><mat-icon>close</mat-icon></button> -->
  <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close(false)"></button>
  <div class="titleTxt d-flex flex-wrap justify-content-between align-items-center">
    <h3><span class="titleIcon"><i class="icon-image-line"></i></span>{{ isEdit ? 'EDIT' : 'ADD'}} PHOTO ID PROOF</h3>
  </div>
  <form [formGroup]="form">
    <div class="row py-3 justify-content-center">
      <div class="col-6 col-md-5 col-lg-4 text-center">
        <mat-form-field appearance="fill" class="w-100">
          <mat-label>Document Type</mat-label>
          <mat-select [formControl]="docTypeControl" (opened)="onDocTypeOpened()">
            <mat-option *ngFor="let option of docTypesArray" [value]="option">{{ option }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>
    <div class="row g-3">
      <div *ngIf="docTypeControl.value && ![docTypes.OTHERS, docTypes.DOB].includes(docTypeControl.value)" class="col-sm-6">
        <!-- <mat-form-field *ngIf="docTypeControl.value === docTypes.AADHAR" class="w-100" appearance="fill" >
          <mat-label>AADHAR NUMBER</mat-label>
          <input matInput type="string" formControlName="aadhar_number" maxlength="12">
        </mat-form-field> -->
        <mat-form-field *ngIf="docTypeControl.value === docTypes.PASSPORT" class="w-100" appearance="fill">
          <mat-label>PASSPORT NUMBER</mat-label>
          <input matInput type="string" class="text-uppercase" formControlName="passport_number">
        </mat-form-field>
        <mat-form-field *ngIf="docTypeControl.value === docTypes.VOTER_ID" class="w-100" appearance="fill">
          <mat-label>VOTER ID NUMBER</mat-label>
          <input matInput type="string" class="text-uppercase" formControlName="voter_id_number">
        </mat-form-field>
        <mat-form-field *ngIf="docTypeControl.value === docTypes.PAN_CARD" class="w-100" appearance="fill">
          <mat-label>PAN NUMBER</mat-label>
          <input matInput type="string" class="text-uppercase" formControlName="pancard_number" maxlength="10">
        </mat-form-field>
      </div>
      <div *ngIf="docTypeControl.value === docTypes.PASSPORT" class="col-sm-6">
        <mat-form-field 
          class="w-100" appearance="fill" (click)="expiryDate.open()" 
          (keyup.space)="expiryDate.open()" (keyup.enter)="expiryDate.open()"
        >
          <mat-label>EXPIRY DATE</mat-label>
          <input matInput type="string" formControlName="passport_expiry_date" [matDatepicker]="expiryDate" readonly />
          <mat-datepicker-toggle matSuffix [for]="expiryDate"></mat-datepicker-toggle>
          <mat-datepicker #expiryDate></mat-datepicker>
        </mat-form-field>
      </div>
      <div *ngIf="docTypeControl.value" class="col-sm-6">
        <div class="inputFileUpload-wrapper border rounded-1 d-flex align-items-center">
          <div class="inputfileLevel position-relative">
            <span class="text-uppercase upload-level">
              {{
                docTypeControl.value === docTypes.PASSPORT 
                  ? 'Front Page' 
                  : docTypeControl.value === docTypes.DOB 
                    ? 'DOB Proof'
                    : docTypeControl.value === docTypes.OTHERS  
                      ? 'Service Proof'
                      : 'Document'
              }} Upload
            </span>
            <input #docFile type="file" class="upload-input" (change)="fileUpload($event, 1)" accept=".jpg, .jpeg, .png, .pdf">
          </div>
          <div *ngIf="doc_path">
            <a [href]="fileBaseUrl + doc_path" target="_blank"><i class="fa-solid fa-eye"></i></a>
          </div>
        </div>
        <small *ngIf="isSaveClicked && !doc_path && ![docTypes.DOB, docTypes.OTHERS].includes(docTypeControl.value)" class="text-danger">Please upload the document</small>
      </div>
      <div *ngIf="[docTypes.PASSPORT, docTypes.DOB, docTypes.OTHERS].includes(docTypeControl.value)" class="col-sm-6">
        <div class="inputFileUpload-wrapper border rounded-1 d-flex align-items-center">
          <div class="inputfileLevel position-relative">
            <span class="text-uppercase upload-level">
              {{
                docTypeControl.value === docTypes.PASSPORT 
                  ? 'Back Page' 
                  : docTypeControl.value === docTypes.DOB 
                    ? 'Birth Certificate' 
                    : 'Coaching Certificate'
              }} Upload
            </span>
            <input #docFile2 type="file" class="upload-input" (change)="fileUpload($event, 2)" accept=".jpg, .jpeg, .png, .pdf">
          </div>
          <div *ngIf="doc_path2">
            <a [href]="fileBaseUrl + doc_path2" target="_blank"><i class="fa-solid fa-eye"></i></a>
          </div>
        </div>
        <small *ngIf="isSaveClicked && !doc_path2 && ![docTypes.DOB, docTypes.OTHERS].includes(docTypeControl.value)" class="text-danger">Please upload the document</small>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <hr />
        <button type="button" class="btn btn-blue px-4" (click)="save()" [disabled]="!docTypeControl.value">Save</button>
      </div>  
    </div>
  </form>
</div>
<app-loader *ngIf="loader"></app-loader>
  `,
  styles: [`
    :host .id-proof-modal {
      padding: 15px 20px;
    }
    
    :host .id-proof-modal .btn-close {
      position: absolute;
      right: 4px;
      top: 4px;
      font-size: 14px;
      box-shadow: none;
      outline: none;
    }
    
    :host ::ng-deep .id-proof-modal .mat-form-field {
      font-size: 14px;
    }
    
    .id-proof-modal .titleTxt h3 {
      font-size: 16px;
      color: #4b6fbf;
      text-transform: uppercase;
      margin-bottom: 0;
    }
    
    .id-proof-modal .titleTxt {
      border-bottom: 1px solid #d9d9d9;
      padding-bottom: 10px;
    }
    
    .id-proof-modal .titleTxt .titleIcon {
      width: 30px;
      height: 30px;
      border: 1px solid #1e5faa;
      border-radius: 50%;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }
    
    :host ::ng-deep .icon-image-line:before {
      color: #4b6fbf;
    }
    
    :host ::ng-deep .id-proof-modal .close-btn:focus,
    :host ::ng-deep .id-proof-modal .close-btn:hover {
      color: #fff;
      background-color: red;
      border-color: red;
    }
    
    :host .id-proof-modal hr {
      border-top: 1px solid #d9d9d9;
      opacity: 1;
    }
    
    .inputFileUpload-wrapper {
      justify-content: space-between;
      padding: 6.3px 10px;
    }
    
    .inputFileUpload-wrapper .upload-level {
      background-color: #f1f1f1;
      font-size: 11px;
      font-weight: bold;
      padding: 5px 20px;
      border-radius: 4px;
      display: inline-block;
      cursor: pointer;
    }
    
    .inputFileUpload-wrapper .upload-input {
      position: absolute;
      opacity: 0;
      width: 100%;
      left: 0;
    }
    
    .inputFileUpload-wrapper a {
      color: inherit;
    }
    
    ::ng-deep
      .readonlyPhotoIdEdit.mat-form-field-appearance-fill
      .mat-form-field-flex {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }
  `],
  imports: [
    CommonModule, LoaderComponent, FormsModule, MatInputModule,
    ReactiveFormsModule, MatSelectModule, MatExpansionModule, MatDatepickerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, DatePipe
  ]

})
export class CoachAddIdProofModalComponent implements OnInit {
  @ViewChild('docFile', {static: false}) docFile!: ElementRef<any>;
  @ViewChild('docFile2', {static: false}) docFile2!: ElementRef<any>;

  form: FormGroup = this.formBuilder.group({
    official_detail_id: [null, Validators.required],
    aadhar_number: [null, [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
    passport_number: [null, Validators.required],
    passport_expiry_date: [null, Validators.required],
    voter_id_number: [null, Validators.required],
    pancard_number: [null, [Validators.required, Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/)]]
  });

  docTypeControl: FormControl = new FormControl(null);
  coachDetails: any;
  loader: boolean = false;
  docPath: string = 'Coach\\coachDocumentInfo';
  fileBaseUrl = environment.fileUrl;
  docTypes = DOC_TYPE;
  docTypesArray: string[] = [];
  doc_path: string | null = null;
  doc_path2: string | null = null;
  isSaveClicked: boolean = false;
  alreadyExistingDocs: DOC_TYPE[] = [];
  isEdit: boolean = false;

  payload: any = {
    official_detail_id: this.storageService.getUserProfileDataFromSessionRes()?.userData?.user_id,
    official_image_path: null,
    dob_path: null,
    aadhar_number: null,
    aadhar_image_path: null,
    passport_number: null,
    passport_image_path: null,
    passport_last_image_path: null,
    passport_expiry_date: null,
    voter_id_number: null,
    voter_id_image_path: null,
    birth_certificate_path: null,
    pancard_number: null,
    pancard_image_path: null,
    service_id_image_path: null,
    coaching_certificate_image: null
  }

  constructor(
    private coachIdProofService: CoachIdProofService,
    private sharableService: SharableService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private storageService: StorageService,
    private datePipe: DatePipe,
    private encryptionService:EncryptionService
  ) {}

  ngOnInit() {
    if (this.isEdit) {
      this.docTypeControl.disable();
    } else {
      this.docTypesArray = Object.values(DOC_TYPE).filter((docType) => !this.alreadyExistingDocs.includes(docType));
    }
  }

  fileUpload(event: any, fileType: 1 | 2) {
    const file = event.target.files[0];
    if (!file) return;
    const extFile=this.getFileExtension(file);
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      const formData = new FormData();
      formData.append("file",file, file.name);
      formData.append("path",this.docPath)
      formData.append("uploadType","3")
      this.loader = true;
      this.sharableService.uploadFile(formData).subscribe({
        next: (response: any) => {
          this.loader = false;
          if (response.isUploaded==true) {
            this.alertService.swalPopSuccess('Upload Successful!');
            if (fileType === 1) {
              this.doc_path = response.filedataList[0].filePath;
              this.docFile.nativeElement.value = null;
            } else {
              this.doc_path2 = response.filedataList[0].filePath;
              this.docFile2.nativeElement.value = null;
            }
          } else {
            this.alertService.swalPopError(response.errMsg || 'Upload Failed! Please try again.');
          }
        },
        error: () => {
          this.loader=false;
          this.alertService.swalPopError('Upload Failed! Please try again.');
          console.error("error caught in upload file")
        }
      });
    } 
    else {
      this.alertService.swalPopWarning('Only jpg, jpeg, png or pdf file is allowed!');
    }
  } 

  getFileExtension(file:any) {
    let fileIndex = file.name.lastIndexOf(".") + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }

  save() {
    this.isSaveClicked = true;

    switch(this.docTypeControl.value) {
      // case DOC_TYPE.AADHAR:
      //   if (this.form.get('aadhar_number')?.invalid || !this.doc_path) {
      //     this.form.markAllAsTouched();
      //     this.alertService.swalPopError(
      //       this.form.get('aadhar_number')?.hasError('required')
      //         ? 'Aadhar Number is required!'
      //         : this.form.get('aadhar_number')?.hasError('pattern')
      //           ? 'Aadhar Number provided is invalid!' 
      //           : 'Please upload document to proceed!'
      //     );
      //     return;
      //   }
      //   this.payload.aadhar_number = this.encryptionService.encryptionAES(this.form.get('aadhar_number')?.value) ;
      //   this.payload.aadhar_image_path = this.doc_path;
      //   break;
      
      case DOC_TYPE.PASSPORT:
        if (this.form.get('passport_number')?.invalid || this.form.get('passport_expiry_date')?.invalid || !this.doc_path || !this.doc_path2) {
          this.form.markAllAsTouched();
          this.alertService.swalPopError(
            this.form.get('passport_number')?.hasError('required')
              ? 'Passport Number is required!'
              : this.form.get('passport_expiry_date')?.hasError('required')
                ? 'Passport Expiry Date is required!'
                : 'Please upload document to proceed!'
          );
          return; 
        }
        this.payload.passport_number = this.encryptionService.encryptionAES(this.form.get('passport_number')?.value?.toUpperCase());
        this.payload.passport_expiry_date = this.datePipe.transform(this.form.get('passport_expiry_date')?.value, 'yyyy-MM-dd');
        this.payload.passport_image_path = this.doc_path;
        this.payload.passport_last_image_path = this.doc_path2;
        break;

      case DOC_TYPE.VOTER_ID:
        if (this.form.get('voter_id_number')?.invalid || !this.doc_path) {
          this.form.markAllAsTouched();
          this.alertService.swalPopError(
            this.form.get('voter_id_number')?.hasError('required')
              ? 'Voter ID Number is required!' 
              : 'Please upload document to proceed!'
          );
          return;
        }
        this.payload.voter_id_number = this.encryptionService.encryptionAES(this.form.get('voter_id_number')?.value?.toUpperCase());
        this.payload.voter_id_image_path = this.doc_path;
        break;

      case DOC_TYPE.PAN_CARD:
        if (this.form.get('pancard_number')?.invalid || !this.doc_path) {
          this.form.markAllAsTouched();
          this.alertService.swalPopError(
            this.form.get('pancard_number')?.hasError('required')
              ? 'PAN Number is required!' 
              : this.form.get('pancard_number')?.hasError('pattern')
                ? 'PAN Number provided is invalid!'
                : 'Please upload document to proceed!'
          );
          return;
        }
        this.payload.pancard_number = this.encryptionService.encryptionAES(this.form.get('pancard_number')?.value?.toUpperCase());
        this.payload.pancard_image_path = this.doc_path;
        break;

      case DOC_TYPE.DOB:
        if (!this.doc_path && !this.doc_path2) {
          this.alertService.swalPopError('Please upload document to proceed!');
          return;
        }
        this.payload.dob_path = this.doc_path;
        this.payload.birth_certificate_path = this.doc_path2;
        break;

      case DOC_TYPE.OTHERS:
        if (!this.doc_path && !this.doc_path2) {
          this.alertService.swalPopError('Please upload document to proceed!');
          return;
        }
        this.payload.service_id_image_path = this.doc_path;
        this.payload.coaching_certificate_image = this.doc_path2;
        break;

      default:
        break;
    }

    this.loader = true;
    this.coachIdProofService.saveOfficialDocumentInfo(this.payload).pipe(first()).subscribe({
      next: (response: any) => {
        this.loader = false;
        if (response) {
          this.activeModal.close(true);
          this.alertService.swalPopSuccess('Document Added Successfully!');
        } else {
          this.alertService.swalPopError('Something went wrong! Please try again');
        }
      },
      error: () => {
        this.loader = false;
        this.alertService.swalPopError('Something went wrong! Please try again');
      }
    })
  }

  onDocTypeOpened() {
    this.form.reset();
    this.isSaveClicked = false;
    this.doc_path = this.doc_path2 = null;
    if (this.docFile?.nativeElement?.value) this.docFile.nativeElement.value = null;
    if (this.docFile2?.nativeElement?.value) this.docFile2.nativeElement.value = null;
  }
}
