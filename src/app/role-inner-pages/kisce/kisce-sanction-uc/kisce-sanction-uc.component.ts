import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { CommonSharableService, IGetStateMasterObject } from 'src/app/_common/services/common-services/commonSharable.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
// import { SanctionReleasedAmountUcComponent } from '../sanction-released-amount-uc/sanction-released-amount-uc.component';
import { Router } from '@angular/router';
import { CommentHistoryKisceComponent } from '../comment-history-kisce/comment-history-kisce.component';
import { SanctionReleasedKisceUcComponent } from '../sanction-released-kisce-uc/sanction-released-kisce-uc.component';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';
import { RoleCode } from 'src/app/_common/_enums/role-code';

@Component({
  selector: 'app-kisce-sanction-uc',
  templateUrl: './kisce-sanction-uc.component.html',
  styleUrls: ['./kisce-sanction-uc.component.css']
})
export class KisceSanctionUcComponent implements OnInit {
  users: any[] = [];
  fileUrl: string = environment.fileUrl;
  fileUploadedStatusTable2: boolean[] = [];
  fileUploadedStatus: boolean[] = [];
  mainLoader: Boolean = false;
  addAttendanceModalRef: any;
  userDetails: any;
  docType: string = 'Export';
  displayedColumns: string[] = [
    'kiC_id',
    'rcName',
    'state_name',
    'sanction_Id',
    'sanction_No',
    'sanction_Date',
    'e_File_Number',
    'total_Sanction_Amount',
    'released_Amount',
    'uc_recieved',
    'financial_Sanction',
    'admin_Sanction',
    'comment_History',
  ];
  pageSize: number = 10;
  totalItems: number = 0;
  sanctionsList: Array<any> = [];
  filteredSanctionsList: Array<any> = [];
  proposalList: any[] = [];
  filteredProposals: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  paginatedData: any[] = [];
  isPopupOpen: boolean = false;
  kicId: string = '';
  commentHistoryTableModalRef: any;
  stateMasterList!: Array<IGetStateMasterObject>;
  kicAttendanceFilter!: FormGroup;
  isLoading: boolean = false;
  showPcaTable: boolean = false;
  proposalForm!: FormGroup;
  brandingForm!: FormGroup;
  addProposalPopup: boolean = false;
  enableEdit: boolean = false;
  commentHistoryPopup: boolean = false;
  sanctionReleasedPopup: boolean = false;
  notFound: boolean = false;
  events: string[] = [];
  startDateControl = new FormControl();
  endDateControl = new FormControl();
  initialData: any;
  startDate: Date | null = null;
  endDate: Date | null = null;
  @ViewChild('exporter') exporter: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('startDateInput')
  startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput')
  endDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sanctionTable', { static: false }) academtTablecontent!: ElementRef<any>;
  showReleasedAmountWarning: { [key: number]: string } = {};
  moduleType: string = '';
  rcList: any = [];
  statelist: any = [];
    KicUsersRoleId: any = RoleCode

  constructor(
    public activeModal: NgbActiveModal,
    private sanctionService: KicSanctionService,
    private _proposalService: KicProposalService,
    private _storageService: StorageService,
    private _alertService: AlertService,
    private _fb: FormBuilder,
    private _modalService: NgbModal,
    private datePipe: DatePipe,
    private _commonSharableService: CommonSharableService,
    private _router: Router,
    private _kicDashboardService: KicDashboardService,
  ) {
    this.userDetails = this._storageService.getUserDetails();
    this.fileUrl = environment.fileUrl;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getSanctionUcList();
    this.initializeArrays();
    this.formInitialization();
    this.masterRcList();
    console.log('');
    
  }

  masterRcList() {
    this._kicDashboardService?.rcList().subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          const updatedArray = res.data.map((item: any) => {
            if (item.id === 6691 && item.value === "") {
              return { ...item, value: "All" };
            }
            return item;
          });
          this.rcList = updatedArray
        }
      },
      error: (errors: any) => { },
    })
  }

  onChangeRc(rc_Id: any) {
    const selectedRc = this.rcList.find((rc: { id: any; }) => rc.id == rc_Id);
    if (selectedRc && selectedRc.value !== 'All') {
      const filteredData = this.filteredProposals.filter(item => item.rcName === selectedRc.value);
      this.proposalArray.clear();
      filteredData.forEach((ele: any) => {
        this.addItemProposal(ele);
      });
      this.dataSource.data = this.proposalArray.controls;
    } else {
      this.proposalArray.clear();
      this.filteredProposals.forEach((ele: any, i: any) => {
        ele['index'] = i + 1;
        this.addItemProposal(ele);
      });
      this.dataSource.data = this.proposalArray.controls;
    }
    this.sanctionService.getSanctionStateListByRC(rc_Id).subscribe({
      next: (res: any) => {
        if (res.data) this.statelist = res.data;
      },
      error: (errors: any) => { },
    })
  }
  onChangeState(stateName: any) {

    if (stateName && stateName != '') {

      const filteredData = this.filteredProposals.filter(item => item.state_name === stateName);
      this.proposalArray.clear();
      filteredData.forEach((ele: any) => this.addItemProposal(ele));
      this.dataSource.data = this.proposalArray.controls;
    }
  }

  initializeArrays() {
    this.proposalList.forEach(() => {
      this.fileUploadedStatus.push(false);
      this.fileUploadedStatusTable2.push(false);
    });
  }

  formInitialization() {
    this.proposalForm = this._fb.group({
      items: this._fb.array([]),
    });
  }

  addItemProposal(ele: any) {
    const group = this._fb.group({
      kiC_id: [ele.kiC_id || ''],
      rcName: [ele.rcName || ''],
      state_id: [ele.state_id || ''],
      state_name: [ele.state_name || ''],
      sanction_Id: [ele.sanction_Id || '-'],
      sanction_No: [ele.sanction_No || '-'],
      sanction_Date: [ele?.sanction_Date !== '-' ? new Date(ele.sanction_Date) : '', []],
      e_File_Number: [ele.e_File_Number || '-'],
      total_Sanction_Amount: [ele.total_Sanction_Amount || '-'],
      released_Amount: [ele.released_Amount || '-'],
      uC_Received: [ele.uC_Received || '-'],
      financial_Sanction: [ele.financial_Sanction || '-'],
      admin_Sanction: [ele.admin_Sanction || '-'],
      kiC_Name: [ele.kiC_Name || '-'],
      kiC_Type: [ele.kiC_Type || '-'],
    });

    this.proposalArray.push(group);
  }

  // createProposalItem(ele: any = null): FormGroup {
  //   return this._fb.group({
  //     kiC_id: [ele?.kiC_id || '',[]],
  //     sanction_Id: [ele.sanction_Id || '',[]],
  //     sanction_No: [ele.sanction_No || '',[]],
  //     sanction_Date: [ele?.sanction_Date || '', []],
  //     e_File_Number: [ele.e_File_Number || '' ,[]],
  //     total_Sanction_Amount: [ele.total_Sanction_Amount || '',[]],
  //     released_Amount: [ele.released_Amount || '',[]],
  //     uc_recieved: [ele.uc_recieved || '',[]],
  //     financial_Sanction: [ele.financial_Sanction || '',[]],
  //     admin_Sanction: [ele.admin_Sanction || '',[]],
  //   });
  // }

  onDateChange(event: any, index: number) {
    const date = event.value;
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.proposalArray.at(index).get('sanction_Date')?.setValue(formattedDate);
    }
  }

  onDateChangeFilter() {
    const startDateValue = this.startDateInput.nativeElement.value;
    const endDateValue = this.endDateInput.nativeElement.value;

    const startDate = this.datePipe.transform(startDateValue, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(endDateValue, 'yyyy-MM-dd');

    this.sanctionsList = this.filteredProposals;

    if (startDate && endDate) {
      const filteredData = this.sanctionsList.filter((ele) => {
        const sanctionDate = ele.sanction_Date !== '-' ? this.datePipe.transform(ele.sanction_Date, 'yyyy-MM-dd') : null;
        return sanctionDate && sanctionDate >= startDate && sanctionDate <= endDate;
      });

      this.proposalArray.clear();
      filteredData.forEach((ele: any) => {
        this.addItemProposal(ele);
      });
      this.dataSource.data = this.proposalArray.controls;
    } else {
      this.dataSource.data = this.initialData;
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  searchFilter(value: string) {
    this.sanctionsList = this.filteredProposals;
    if (value) {
      const data = this.sanctionsList.filter((ele) => ele.sanction_Id.toLowerCase().includes(value.toLowerCase()));
      this.proposalArray.clear();
      data.forEach((ele: any) => {
        this.addItemProposal(ele);
      });
      this.dataSource.data = this.proposalArray.controls;
    } else {
      this.dataSource.data = this.initialData;
    }
  }



  getSanctionUcList() {
    const sessionId: string = JSON.parse(localStorage.getItem('sessiondata') || '{}')?.sessionId;
    this.sanctionService.getSanctionUcList(this.userDetails.user_id,this.userDetails.role_id, 'kisce').subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === 'success') {
          this.proposalArray.clear(); // Clear existing form array controls
          this.filteredProposals = res.data || [];
          this.totalItems = this.filteredProposals.length;
          this.filteredProposals.forEach((ele: any) => {
            this.addItemProposal(ele);
          });

          this.initialData = [...this.proposalArray.controls];
          this.dataSource.data = this.proposalArray.controls;
          this.dataSource.paginator = this.paginator;
        } else {
          this._alertService.swalPopErrorTimer(res?.message);
        }
      },
      error: (errors: any) => {
        this.isLoading = false;
        this._alertService.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  opencommentHistorysPopup(item: any) {
    this.commentHistoryTableModalRef = this._modalService.open(CommentHistoryKisceComponent, { size: 'lg', centered: true });
    this.commentHistoryTableModalRef.componentInstance.sanction_Id = item?.value?.sanction_Id;
    this.commentHistoryTableModalRef.componentInstance.enableEdit = this.enableEdit;
    this.commentHistoryTableModalRef.componentInstance.kiC_id = item?.value?.kiC_id;
    this.commentHistoryTableModalRef.componentInstance.state_id = item?.value?.state_id;
    this.commentHistoryTableModalRef.componentInstance.onAdd.subscribe(() => {
      this.getSanctionUcList();
    });
  }

  openReleasedAmountPopup(value: any) {
    this.commentHistoryTableModalRef = this._modalService.open(SanctionReleasedKisceUcComponent, { size: 'lg', centered: true, backdrop: 'static' });
    this.commentHistoryTableModalRef.componentInstance.sanction_Id = value?.value?.sanction_Id;
    this.commentHistoryTableModalRef.componentInstance.sanction_No = value?.value?.sanction_No;
    this.commentHistoryTableModalRef.componentInstance.sanction_Date = value?.value?.sanction_Date;
    this.commentHistoryTableModalRef.componentInstance.released_Amount = value?.value?.released_Amount;
    this.commentHistoryTableModalRef.componentInstance.kiC_Name = value?.value?.kiC_Name;
    this.commentHistoryTableModalRef.componentInstance.kiC_Type = value?.value?.kiC_Type;
    this.commentHistoryTableModalRef.componentInstance.state_name = value?.value?.state_name;
    this.commentHistoryTableModalRef.componentInstance.onAdd.subscribe(() => {
      this.getSanctionUcList();
    });
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
    this.isPopupOpen = false;
  }

  get proposalArray(): FormArray {
    return this.proposalForm.get('items') as FormArray;
  }

  removeProposal(index: any) {
    const items = this.proposalForm.get('items') as FormArray;
    items.removeAt(index);
  }

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

  exportToExcelPdfChange(event: any) {
    if (event.target.value == 'excel') {
      this.exportToExcel();
    } else if (event.target.value == 'pdf') {
      this.getPdf();
    }
  }

  exportToExcel() {

    const exportData = this.filteredProposals.map((item, index) => {
      const rawDate = item.sanction_Date;
      const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '';
      return {
        'S.No': index + 1,
        'RC NAME': item.rcName,
        'STATE NAME': item.state_name,
        'SANCTION ID': item.sanction_Id,
        'SANCTION NO': item.sanction_No,
        'SANCTION DATE': formattedDate,
        'E-FILE NUMBER': item.e_File_Number,
        'TOTAL SANCTIONED AMOUNT': item.total_Sanction_Amount || '-',
        'RELEASED TO RC': item.released_Amount || '-',
      };
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'KISCE SANCTION LIST': worksheet }, SheetNames: ['KISCE SANCTION LIST'] };
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KISCE_Sanction.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);


  }

  getPdf() {

    const doc = new jsPDF();
    const img = new Image();
    img.src = '../assets/images/NSRS.png';

    const exportData = this.filteredProposals.map((item, index) => {
      const formattedDate = item.sanction_Date
        ? new Date(item.sanction_Date).toLocaleDateString('en-GB').replace(/\//g, '-')
        : '';
      return [
        index + 1,
        item.rcName,
        item.state_name,
        item.sanction_Id,
        item.sanction_No,
        formattedDate,
        item.e_File_Number,
        item.total_Sanction_Amount || '-',
        item.released_Amount || '-',
      ];
    });

    const headers = [
      [
        'S.No',
        'RC NAME',
        'STATE NAME',
        'SANCTION ID',
        'SANCTION NO',
        'SANCTION DATE',
        'E-FILE NUMBER',
        'TOTAL SANCTIONED AMOUNT',
        'RELEASED TO RC',
      ]
    ];


    doc.addImage(img, 'PNG', 15, 10, 40, 20);

    autoTable(doc, {
      startY: 35,
      head: headers,
      body: exportData,
      theme: 'grid',
      headStyles: { fillColor: '#1F60AB', fontSize: 8, halign: 'center' },
      bodyStyles: { fontSize: 7, textColor: '#000' },
      styles: { overflow: 'linebreak', cellPadding: 2 }
    });
    doc.save('KISCE_Sanction.pdf');

    /*nzim4hmed end***************************************************************************************************88 */
  }

  onSave() {
    this.enableEdit = false;
    this.sanctionService.updateSanction(this.proposalArray.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === 1) {
          this.handleSuccess('Record Updated Successfully!');
        } else {
          this.showError('Failed!');
        }
      },
      error: (errors: any) => {
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  getFileExtension(file: any) {
    if (file && file.name) {
      let fileIndex = file.name.lastIndexOf('.') + 1;
      let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
      return extFile;
    }
    return ''; // Return an empty string or handle it based on your logic
  }

  verifyFileSize(files: any) {
    var fileSize = files[0].size;
    return fileSize;
  }

  uploadFile(event: any, index: any, formControlName: any) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    const extFile = this.getFileExtension(file);

    if (extFile === 'pdf') {
      const fileSize = file.size;
      if (fileSize < 10485770) {
        // File size less than or equal to 10MB
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('path', 'data/Tempimage');
        formData.append('uploadType', '4');

        // Uploading file - calling service
        this.mainLoader = true;
        this._proposalService?.uploadFile(formData).subscribe({
          next: (res) => {
            this.mainLoader = false;
            if (res?.isUploaded === true) {
              this._alertService.swalPopSuccess('File Uploaded');
              const formArray = this.proposalForm.get('items') as FormArray;
              formArray.controls[index].get(formControlName)?.patchValue(res?.filedataList[0].filePath);
            } else {
              this._alertService.swalPopError(res?.errorMsg || 'Upload Failed! Please Try Again.');
            }
          },
          error: () => {
            this.mainLoader = false;
            this._alertService.swalPopError('Upload Failed! Please Try Again.');
          },
        });
      } else {
        this._alertService.swalPopError('File size must not be more than 10MB.');
        const formArray = this.proposalForm.get('items') as FormArray;
        formArray.controls[index].get(formControlName)?.patchValue('');
      }
    } else {
      this._alertService.swalPopWarning('Only PDF files are allowed!');
      const formArray = this.proposalForm.get('items') as FormArray;
      formArray.controls[index].get(formControlName)?.patchValue('');
    }
  }

  openFile(index: number, controlName: string) {
    const formArray = this.proposalForm.get('items') as FormArray;
    const filePath = formArray.controls[index].get(controlName)?.value;

    if (filePath) {
      const fileUrl = this.fileUrl + filePath;
      window.open(fileUrl, '_blank');
    } else {
      this._alertService.swalPopError('File path is not available.');
    }
  }

  private showError(message: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      text: message,
      showConfirmButton: true,
      timer: 3000,
    });
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

  
  isNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
}
