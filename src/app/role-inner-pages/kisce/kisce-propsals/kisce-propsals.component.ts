import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IGetStateMasterObject, CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicAttendanceService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-attendance.service';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/_common/material.module';
import { CommentHistoryKisceComponent } from '../comment-history-kisce/comment-history-kisce.component';
import { AddProposalKisceComponent } from '../add-proposal-kisce/add-proposal-kisce.component';
import { DynamicModalComponent } from 'src/app/standalone_components/modal-window/dynamicModal/dynamicModal.component';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-kisce-propsals',
  templateUrl: './kisce-propsals.component.html',
  styleUrls: ['./kisce-propsals.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CommentHistoryKisceComponent,
    AddProposalKisceComponent,
    DynamicModalComponent,
    LoaderComponent,
  ],
  providers:[
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class KiscePropsalsComponent implements OnInit {
  fileBaseUrl: any = environment.fileUrl;
  fileUploadedStatusTable2: boolean[] = [];
  fileUploadedStatus: boolean[] = [];
  fileUploaded: Boolean = false;
  mainLoader: Boolean = false;
  userDetails: any;
  proposalList: any = [];
  sanctionsList: Array<any> = [];
  KicUsersRoleId: any = RoleCode;
  submitted = false;
  docType: string = 'Export';
  addPropodalDocumentPopup: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('exporter') exporter: any;
  @ViewChild('matSortAthlete') matSortAthlete!: MatSort;
  @ViewChild('tablePaginatorAthlete') tablePaginatorAthlete!: MatPaginator;
  @ViewChild('startDateInput')
  startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput')
  endDateInput!: ElementRef<HTMLInputElement>;
  isPopupOpen: boolean = false;

  stateMasterList!: Array<IGetStateMasterObject>;
  // addProposalForm!:FormGroup;
  validateRowIndices: number[] = []; // Array to store indices of rows to validate
  isLoading: boolean = false;
  totalItems: number = 0;
  moduleType: string = '';
  documentsIndex: number = 0;
  selectedStatus: string = '';
  proposalForm!: FormGroup | any;
  addProposalPopup: boolean = false;
  enableEdit: boolean = false;
  commentHistoryPopup: boolean = false;
  unsubscribe: Subject<any> = new Subject();
  addProposaldocumentPopup: boolean = false;
  initialData: any;
  filterlisting: Array<any> = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'proposal_Id',
    'nsrs_Id',
    'proposal_Head',
    'proposal_Document',
    'proposal_Date',
    'pac_Agenda',
    'pac_Minutes',
    'dpac_Agenda',
    'dpac_Minutes',
    'proposal_Status',
    'date_Of_Approval',
  ];
  initialFormValues: any;
  proposalDetailsControl: any;
  approvalDateControl: any;
  constructor(
    public activeModal: NgbActiveModal,
    private _proposalService: KicProposalService,
    private _storageService: StorageService,
    private _ngbModal: NgbModal,
    private _alertService: AlertService,
    private _fb: FormBuilder,
    private _router: Router,
    private datepipe: DatePipe
  ) {
    this.userDetails = this._storageService.getUserDetails();
    this.formInitialization();
    this.fileBaseUrl = environment.fileUrl;
  }

  ngOnInit(): void {
    if (this._router.url == '/kisce') {
      this.moduleType = 'kisce';
    } else {
      this.moduleType = 'kic';
    }
    this.getProposalList();
    this.formInitialization();
  }

  getProposalList() {
    let sessionId: string = JSON.parse(localStorage.getItem('sessiondata') || '')?.sessionId;
    this.isLoading = true;
    this._proposalService.getProposalList(sessionId, this.moduleType).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === 'success') {
          this.proposalArray.clear(); // Clear existing form array controls
          this.proposalList = res.data || [];
          this.totalItems = this.proposalList.length;
          // this.proposalList.forEach((ele: any) => {
          //   this.addItemProposal(ele); // Add each item to the form array
          // });
          this.proposalList.forEach((ele: any, i: number) => {
            ele['index'] = i + 1;
            this.addItemProposal(ele);
          });
          this.initialData = [...this.proposalArray.controls];
          // Update dataSource with form array controls
          this.dataSource.data = this.proposalArray.controls;
          this.dataSource.paginator = this.paginator;
        } else {
          this._alertService?.swalPopErrorTimer(res?.message);
        }
      },
      error: (errors: any) => {
        this.isLoading = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  formInitialization() {
    this.proposalForm = this._fb.group({
      items: this._fb.array([]),
    });
  }

  get proposalArray(): FormArray {
    return this.proposalForm.get('items') as FormArray;
  }

  toggleValidation(index: number) {
    const currentIndex = this.validateRowIndices.indexOf(index);
    if (currentIndex === -1) {
      this.validateRowIndices.push(index); // Add index to array if not present
    } else {
      this.validateRowIndices.splice(currentIndex, 1); // Remove index if already present
    }
  }

  addItemProposal(ele: any) {
    const group = this._fb.group({
      index: [ele.index || ''],
      proposal_Id: [ele?.proposal_Id || ''],
      nsrs_Id: [ele?.nsrs_Id || ''],
      proposal_Head: [ele?.proposal_Head || ''],
      proposal_Document: [ele?.proposal_Document || ''],
      proposal_Date: [ele?.proposal_Date || ''],
      pac_Agenda: [ele?.pac_Agenda || ''],
      pac_Minutes: [ele?.pac_Minutes || ''],
      dpac_Agenda: [ele?.dpac_Agenda || ''],
      dpac_Minutes: [ele?.dpac_Minutes || ''],
      proposal_Status: [ele?.proposal_Status == '' ? '1' : ele?.proposal_Status || ''],
      approval_date: [ele?.approval_date || null],
      module_Type: this.moduleType,
      proposal_details: [ele?.proposal_details || ''],
      notification_Letter: [ele?.notification_Letter || ''],
      In_principal_Approval_document: [ele?.in_Principal_Approval || ''],
      Sanction_Order: [ele?.sanction_Order || ''],
      isEdit: false,
    });
    this.proposalArray.push(group);
  }

  createProposalItem(value: any = null): FormGroup {
    return this._fb.group({
      index: [value.index || ''],
      proposal_Id: [value?.proposal_Id || '', []],
      nsrs_Id: [value?.nsrs_Id || '', []],
      proposal_Head: [value?.proposal_Head || '', []],
      proposal_Document: [value?.proposal_Document || '', []],
      proposal_Date: [value?.proposal_Date || '', []],
      pac_Agenda: [value?.pac_Agenda || '', []],
      pac_Minutes: [value?.pac_Minutes || '', []],
      dpac_Agenda: [value?.dpac_Agenda || '', []],
      dpac_Minutes: [value?.dpac_Minutes || '', []],
      proposal_Status: [value?.proposal_Status == '' ? '1' : value?.proposal_Status || '', []],
      approval_date: [value?.approval_date || '', []],
      proposal_details: [value?.proposal_details || '', []],
      notification_Letter: [value?.notification_Letter || '', []],
      In_principal_Approval_document: [value?.in_Principal_Approval || '', []],
      Sanction_Order: [value?.sanction_Order || '', []],
    });
  }

  validationSet(index: any) {
    this.proposalArray.controls[index].get('proposal_details')?.setValidators(Validators.required);
    this.proposalArray.controls[index].get('proposal_details')?.updateValueAndValidity();
  }

  validationSetforDatePicker(event: any, index: any) {
    const date = event.value;
    if (date) {
      const formattedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
      this.proposalArray.at(index).get('approval_date')?.setValue(formattedDate);
    }
    this.proposalArray.controls[index].get('proposal_details')?.setValidators(Validators.required);
    this.proposalArray.controls[index].get('proposal_details')?.updateValueAndValidity();
  }

  removeProposal(index: any) {
    const items = this.proposalForm.get('items') as FormArray;
    items.removeAt(index);
    // this.removeFile(index)
  }

  closeDocumentsModal() {
    this.addPropodalDocumentPopup = false;
  }

  searchFilter(value: string) {
    this.sanctionsList = this.proposalList;
    if (value) {
      const data = this.sanctionsList.filter((ele) => ele.proposal_Id.toLowerCase().includes(value.toLowerCase()));
      this.proposalArray.clear();
      data.forEach((ele: any) => {
        this.addItemProposal(ele);
      });
      this.dataSource.data = this.proposalArray.controls;
    } else {
      this.dataSource.data = this.initialData;
    }
  }

  filterProposalList() {
    this.sanctionsList = this.proposalList;
    if (this.selectedStatus) {
      const filterData = this.sanctionsList.filter((proposal) => proposal.proposal_Status === this.selectedStatus);
      this.proposalArray.clear();
      filterData.forEach((ele: any) => {
        this.addItemProposal(ele);
      });
      this.dataSource.data = this.proposalArray.controls;
    } else {
      this.proposalArray.clear();
      this.initialData.forEach((control: any) => {
        this.proposalArray.push(control);
      });
      this.dataSource.data = this.initialData;
    }
  }

  // onDateChangeFilter() {
  //   debugger
  //   const startDateValue = this.startDateInput.nativeElement.value;
  //   const endDateValue = this.endDateInput.nativeElement.value;

  //   // const startDate = this.datepipe.transform(startDateValue, 'yyyy-MM-dd');
  //   // const endDate = this.datepipe.transform(endDateValue, 'yyyy-MM-dd');

  //   this.sanctionsList = this.proposalList;

  //   if (startDateValue && endDateValue) {
  //     const filteredData = this.sanctionsList.filter((ele) => {
  //       const sanctionDate = ele.proposal_Date !== '-' ? this.datepipe.transform(ele.proposal_Date, 'dd-MM-yyyy'): null;
  //       console.log(sanctionDate,'my date');
  //       console.log(sanctionDate && sanctionDate >= startDateValue && sanctionDate <= endDateValue)
  //       return sanctionDate && sanctionDate >= startDateValue && sanctionDate <= endDateValue;
  //     });

  //     this.proposalArray.clear();
  //     filteredData.forEach((ele: any) => {
  //       this.addItemProposal(ele);
  //     });
  //     this.dataSource.data = this.proposalArray.controls;
  //   } else {
  //     this.dataSource.data = this.initialData;
  //   }
  // }
 

  onDateChangeFilter() {
    const startDateValue = this.startDateInput.nativeElement.value;
    const endDateValue = this.endDateInput.nativeElement.value;  
  
    // Parse input date strings to Date objects, assuming the format 'dd-MM-yyyy'
    const startDate = startDateValue ? this.parseDate(startDateValue) : null;
    const endDate = endDateValue ? this.parseDate(endDateValue) : null;
  
    if (startDate) {
      // Set the start date to the beginning of the day
      startDate.setHours(0, 0, 0, 0);
    }
  
    if (endDate) {
      // Set the end date to the end of the day
      endDate.setHours(23, 59, 59, 999);
    }
  
    // Reset to the full list of sanctions
    this.sanctionsList = this.proposalList;
  
    if (startDate && endDate) {
      const filteredData = this.sanctionsList.filter((ele) => {
        const proposalDateValue = ele.proposal_Date; // Assume it's in 'yyyy-MM-ddTHH:mm:ss' format
        const proposalDate = proposalDateValue ? new Date(proposalDateValue) : null;  
        // Return records that fall within the start and end date range
        return proposalDate && proposalDate >= startDate && proposalDate <= endDate;
      });  
      // Update the proposal array with filtered data
      this.proposalArray.clear();
      filteredData.forEach((ele: any) => {
        this.addItemProposal(ele);
      });
      this.dataSource.data = this.proposalArray.controls;
    } else {
      // Reset data source if no valid date range is provided
      this.dataSource.data = this.initialData;
    }
  }
  
  // Helper function to parse 'dd-MM-yyyy' formatted date strings to Date objects
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(part => parseInt(part, 10));
    return new Date(year, month - 1, day); // month is zero-indexed in JavaScript Date
  }
  
  onEdit() {
    this.enableEdit = true;
  }

  editSanctonObj(index: any, proposalHead: any, proposalDetails: any, approvalDate: any, proposalStatus: any) {
    const itemArray = this.proposalForm.get('items') as FormArray;
    itemArray.at(index).get('isEdit')?.setValue(true);

    const proposalHeadControl = itemArray.at(index).get(proposalHead);
    const proposalDetailsControl = itemArray.at(index).get(proposalDetails);
    const approvalDateControl = itemArray.at(index).get(approvalDate);
    const proposalStatusControl = itemArray.at(index).get(proposalStatus);

    if (proposalHeadControl) {
      proposalHeadControl.setValidators([Validators.required]); // Add required validator
      proposalHeadControl.updateValueAndValidity(); // Update control validity
    }
    if (proposalStatusControl?.value === '2') {
      if (proposalDetailsControl) {
        proposalDetailsControl.setValidators([Validators.required]); // Add required validator
        proposalDetailsControl.updateValueAndValidity(); // Update control validity
      }
      if (approvalDateControl) {
        approvalDateControl.setValidators([Validators.required]); // Add required validator
        approvalDateControl.updateValueAndValidity(); // Update control validity
      }
    }
  }

  onSave() {
    this.submitted = true;
    if (this.proposalArray.valid) {
      this.enableEdit = false;
      this.isLoading = true;
      this._proposalService.updateProposal(this.proposalArray.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status === 1) {
            this.handleSuccess('Record Save Successfully!');
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.proposalArray.markAllAsTouched();
    }
  }

  private handleSuccess(message: string) {
    this.modalClose();
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: message,
      showConfirmButton: true,
      timer: 3000,
    });
  }

  onCancel() {
    this.enableEdit = false;
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
    this.isPopupOpen = false;
  }

  // ++++++++++++++++ Custom Validation Start +++++++++++++++
  spaceValidator() {
    return (control: any) => {
      if (control.value && control.value?.trim()?.length == 0) {
        return { required: true };
      }
      return null;
    };
  }

  amountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const amount = control.value;
      const amountPattern = /^\d+$/; // adjust pattern based on your requirements

      if (amount && !amountPattern.test(amount)) {
        return { invalidAmount: true };
      }
      return null;
    };
  }
  // ++++++++++++++++ Custom Validation End +++++++++++++++

  addProposal() {
    this.addProposalPopup = true;
  }

  getPdf() {
    // Temporarily hide the columns by adding a CSS class
    const columnsToHide = ['proposal_Document','pac_Agenda','pac_Minutes','dpac_Agenda','dpac_Minutes',];
    columnsToHide.forEach((column) => {
      const headerCell = document.querySelector(`th.mat-header-cell.cdk-column-${column}`);
      const cells = document.querySelectorAll(`td.mat-cell.cdk-column-${column}`);
      if (headerCell) {
        headerCell.classList.add('hide-column');
      }
      cells.forEach((cell) => cell.classList.add('hide-column'));
    });

    // Generate the PDF
    const doc = new jsPDF();
    const img = new Image();
    img.src = '../assets/images/NSRS.png';

    // Create a temporary jsPDF object to get the table's dimensions
    const temp = new jsPDF();
    autoTable(temp, { html: '#proposalTable' });

    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      if (pageNumber < temp.getNumberOfPages()) {
        doc.addPage();
      }
    }
    doc.setPage(1);
    autoTable(doc, { html: '#proposalTable',headStyles:{valign:'middle',fillColor:'#1F60AB',fontSize:8},theme:'grid',bodyStyles:{fontSize:7,fillColor:false,textColor:'#000'}});

    if (temp.getNumberOfPages() > 1) {
      doc.deletePage(temp.getNumberOfPages() + 1);
    }

    doc.save(this.moduleType ==='kic' ? 'kicProposal.pdf' : 'KisceProposal.pdf');

    // Restore the columns by removing the CSS class
    columnsToHide.forEach((column) => {
      const headerCell = document.querySelector(`th.mat-header-cell.cdk-column-${column}`);
      const cells = document.querySelectorAll(`td.mat-cell.cdk-column-${column}`);
      if (headerCell) {
        headerCell.classList.remove('hide-column');
      }
      cells.forEach((cell) => cell.classList.remove('hide-column'));
    });
  }

  exportToExcelPdfChange(event: any) {
    if (event.target.value == 'excel') {
      // this.exportToExcel();
    } else if (event.target.value == 'pdf') {
      this.getPdf();
    }
  }

  addProposaldocument(index: any,selectMode:string) {
    this.documentsIndex = index;
    const modalRef = this._ngbModal.open(DynamicModalComponent, { size: 'xl', centered: true });
    modalRef.componentInstance.proposalArray = this.proposalArray;
    modalRef.componentInstance.documentsIndex = this.documentsIndex;
    modalRef.componentInstance.selectMode = selectMode;
  }

  viewComment() {
    this.commentHistoryPopup = true;
  }

  showHideProposalPopup(event: any) {
    this.addProposalPopup = event;
  }

  showHideCommentPopup(event: any) {
    this.commentHistoryPopup = event;
  }
  
  verifyFileSize(files: any) {
    var fileSize = files[0].size;
    return fileSize;
  }

  uploadProposalDocumentFile(files: any, formcontrolname: any) {
    if (files.length === 0) {
      return;
    } else {
      let extFile = this.getFileExtension(files[0]);
      let fileSize = this.verifyFileSize(files);
      if (extFile == 'pdf') {
        if (fileSize < 10485770) {
          const formData = new FormData();
          formData.append('file', files[0], files[0].name);
          formData.append('path', 'data/Tempimage');
          formData.append('uploadType', '4');

          // Uploading file - calling service
          this.mainLoader = true;
          this._proposalService?.uploadFile(formData).subscribe({
            next: (res: any) => {
              this.mainLoader = false;
              if (res?.isUploaded == true) {
                // this.addProposalForm.get(`${formcontrolname}`)?.setValue(res?.filedataList[0].filePath)
                this.proposalArray.controls[this.documentsIndex].get(`${formcontrolname}`)?.setValue(res?.filedataList[0].filePath);
                this._alertService.swalPopSuccess('File Uploaded');
              } else {
                this._alertService.swalPopError(res?.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.mainLoader = false;
              // Handle error
            },
          });
        } else {
          this._alertService.swalPopWarning('File Size must be less than 10Mb.');
        }
      } else {
        this._alertService.swalPopError('Only PDF files are allowed.');
      }
    }
  }

  getFileExtension(file: any) {
    let fileIndex = file.name.lastIndexOf('.') + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }

  uploadFile(files: any, index: any, formControlName: any) {
    if (files.length === 0) {
      return;
    } else {
      let extFile = this.getFileExtension(files[0]);
      // TODO: Check extension here

      if (extFile == 'pdf') {
        let fileSize = files[0].size;
        // TODO: Check file size here
        if (fileSize < 10485770) {
          const formData = new FormData();
          formData.append('file', files[0], files[0].name);
          formData.append('path', 'data/Tempimage');
          formData.append('uploadType', '4');

          // Uploading file - calling service
          this.mainLoader = true;
          this._proposalService?.uploadFile(formData).subscribe({
            next: (res) => {
              this.mainLoader = false;
              if (res?.isUploaded == true) {
                this._alertService.swalPopSuccess('File Uploaded');

                // var d = this.proposalForm.get('items') as FormArray;
                // d.controls[index].get(`${formControlName}`)?.patchValue(res?.filedataList[0].filePath);
                // console.log(d)
                const formArray = this.proposalForm.get('items') as FormArray;
                formArray.controls[index].get(formControlName)?.patchValue(res?.filedataList[0].filePath);
              } else {
                this._alertService.swalPopError(res?.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.mainLoader = false;
            },
          });
        } else {
          const control = this.proposalForm.get('items') as FormArray;
          control.at(index).patchValue({
            filePath: '',
          });
          this._alertService.swalPopError('File size must not be more than 10Mb.');
        }
      } else {
        const control = this.proposalForm.get('items') as FormArray;
        control.at(index).patchValue({
          filePath: '',
        });
        this._alertService.swalPopWarning('Only PDF files are allowed!');
      }
    }
  }

  openFile(controlName: string) {
    // const filePath = this.addProposalForm.get(controlName)?.value;
    const filePath = this.proposalArray.controls[this.documentsIndex].get(controlName)?.value;

    if (filePath) {
      const fileUrl = this.fileBaseUrl + filePath;
      window.open(fileUrl, '_blank');
    } else {
      this._alertService.swalPopError('File path is not available.');
    }
  }

  detectFileUpload(event: any) {
    this.fileUploaded = event.target.files.length > 0;
  }
}
