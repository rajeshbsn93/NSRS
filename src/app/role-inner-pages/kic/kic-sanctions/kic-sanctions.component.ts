import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, MaxLengthValidator, ValidatorFn } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IGetStateMasterObject } from 'src/app/_common/services/common-services/commonSharable.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';
import { SanctionReleasedAmountComponent } from '../sanction-released-amount/sanction-released-amount.component';
import { CommentHistoryComponent } from '../kic-components/comment-history/comment-history.component';
import { AddProposalComponent } from '../kic-components/add-proposal/add-proposal.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SanctionTotalAmountComponent } from '../sanction-total-amount/sanction-total-amount.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';


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
  selector: 'app-kic-sanctions',
  templateUrl: './kic-sanctions.component.html',
  styleUrls: ['./kic-sanctions.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class KicSanctionsComponent implements OnInit {
  KicUsersRoleId: any = RoleCode
  users: any[] = [];
  fileUrl: string = environment.fileUrl;
  fileUploadedStatusTable2: boolean[] = [];
  fileUploadedStatus: boolean[] = [];
  mainLoader: Boolean = false;
  addAttendanceModalRef: any;
  userDetails: any;
  docType: string = 'Export';
  displayedColumns: string[] = [
    's_no',
    'rcName',
    'state_Name',
    'sanction_Id',
    'sanction_No',
    'sanction_Date',
    'e_File_Number',
    'financialYear',
    'total_Sanction_Amount',
    'released_Amount',
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
  unsubscribe: Subject<any> = new Subject();
  pageIndex: any;
  notFound: boolean = false;
  events: string[] = [];
  startDateControl = new FormControl();
  endDateControl = new FormControl();
  initialData: any;
  startDate: Date | null = null;
  endDate: Date | null = null;
  rcList: any = [];
  statelist: any = [];



  @ViewChild('exporter') exporter: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('startDateInput')
  startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput')
  endDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sanctionTable', { static: false }) academtTablecontent!: ElementRef<any>;
  showReleasedAmountWarning: { [key: number]: string } = {};

  constructor(
    public activeModal: NgbActiveModal,
    private sanctionService: KicSanctionService,
    private _proposalService: KicProposalService,
    private _storageService: StorageService,
    private _alertService: AlertService,
    private _fb: FormBuilder,
    private _modalService: NgbModal,
    private datePipe: DatePipe,
    private _kicDashboardService: KicDashboardService,
  ) {
    this.userDetails = this._storageService.getUserDetails();
    this.formInitialization();
    this.fileUrl = environment.fileUrl;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getProposalList();
    this.initializeArrays();
    this.masterRcList();
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
      const filteredData = this.filteredProposals.filter(item => item.state_Name === stateName);
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

  onDateChange(event: any, index: number) {
    const date = event.value;
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.proposalArray.at(index).get('sanction_Date')?.setValue(formattedDate);
    }
  }

  // onDateChangeFilter() {
  //   // debugger
  //   const startDateValue = this.startDateInput.nativeElement.value;
  //   const endDateValue = this.endDateInput.nativeElement.value;

  //   console.log(startDateValue);
  //   console.log(endDateValue)

  //   this.sanctionsList = this.filteredProposals;

  //   if (startDateValue && endDateValue) {
  //     const filteredData = this.sanctionsList.filter((ele) => {
  //       const sanctionDate = ele.sanction_Date !== '-' ? this.datePipe.transform(ele.sanction_Date, 'dd-MM-yyyy') : null;
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
    this.sanctionsList = this.filteredProposals;

    if (startDate && endDate) {
      const filteredData = this.sanctionsList.filter((ele) => {
        // Assume it's in 'yyyy-MM-ddTHH:mm:ss' format
        const proposalDateValue = ele.sanction_Date;
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

  getProposalList() {
    const sessionId: string = JSON.parse(localStorage.getItem('sessiondata') || '{}')?.sessionId;
    this.sanctionService.getSanctionListNew(this.userDetails.user_id, this.userDetails.role_id, 82).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === 'success') {
         

          this.proposalArray.clear(); // Clear existing form array controls
          this.filteredProposals = res.data || [];
          this.totalItems = this.filteredProposals.length;
          this.filteredProposals.forEach((ele: any, i: any) => {
            ele['index'] = i + 1;
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
    this.commentHistoryTableModalRef = this._modalService.open(CommentHistoryComponent, { size: 'lg', centered: true });
    this.commentHistoryTableModalRef.componentInstance.sanction_Id = item?.value?.sanction_Id;
    this.commentHistoryTableModalRef.componentInstance.enableEdit = this.enableEdit;
    this.commentHistoryTableModalRef.componentInstance.state_id = item?.value?.state_id;
    this.commentHistoryTableModalRef.componentInstance.onAdd.subscribe(() => {
      this.getProposalList();
    });
  }

  openReleasedAmountPopup(id: any, index: number) {
    this.commentHistoryTableModalRef = this._modalService.open(SanctionReleasedAmountComponent, { size: 'xl', centered: true });
    this.commentHistoryTableModalRef.componentInstance.kiC_id = id?.value?.kiC_id;
    this.commentHistoryTableModalRef.componentInstance.sanction_Id = id?.value?.sanction_Id;
    this.commentHistoryTableModalRef.componentInstance.sanction_No = id?.value?.sanction_No;
    this.commentHistoryTableModalRef.componentInstance.state_Name = id?.value?.state_Name;
    this.commentHistoryTableModalRef.componentInstance.onAdd.subscribe(() => {
      this.getProposalList();
    });
    // if ((id?.value?.released_Amount > 0 && !this.enableEdit) || (id?.value?.released_Amount > 0 && this.enableEdit)) {
    //   this.commentHistoryTableModalRef = this._modalService.open(SanctionReleasedAmountComponent, { size: 'xl', centered: true });
    //   this.commentHistoryTableModalRef.componentInstance.kiC_id = id?.value?.kiC_id;
    //   this.commentHistoryTableModalRef.componentInstance.sanction_Id = id?.value?.sanction_Id;
    //   this.commentHistoryTableModalRef.componentInstance.sanction_No = id?.value?.sanction_No;
    //   this.commentHistoryTableModalRef.componentInstance.onAdd.subscribe(() => {
    //     this.getProposalList();
    //   });
    // } else {
    //   this.showReleasedAmountWarning[index] = 'Please add release amount before proceeding';
    //   setTimeout(() => {
    //     this.showReleasedAmountWarning[index] = '';
    //   }, 3000);
    // }
  }

  openTotalAmountPopup(id: any, index: number) {
    this.commentHistoryTableModalRef = this._modalService.open(SanctionTotalAmountComponent, { size: 'xl', centered: true });
    this.commentHistoryTableModalRef.componentInstance.kiC_id = id?.value?.kiC_id;
    this.commentHistoryTableModalRef.componentInstance.sanction_Id = id?.value?.sanction_Id;
    this.commentHistoryTableModalRef.componentInstance.sanction_No = id?.value?.sanction_No;
    this.commentHistoryTableModalRef.componentInstance.is_kic_kisce = 'kic';
    this.commentHistoryTableModalRef.componentInstance.onAdd.subscribe(() => {
      this.getProposalList();
    });
  }

  addSanctionPopup() {
    this.commentHistoryTableModalRef = this._modalService.open(AddProposalComponent, { size: 'xl', centered: true });
    this.commentHistoryTableModalRef.componentInstance.onAdd.subscribe(() => {
      this.getProposalList();
    });
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
    this.isPopupOpen = false;
  }

  get proposalArray(): FormArray {
    return this.proposalForm.get('items') as FormArray;
  }

  formInitialization() {
    this.proposalForm = this._fb.group({
      items: this._fb.array([]),
    });
  }

  addItemProposal(ele: any) {
    const group = this._fb.group({
      index: [ele.index || ''],
      kiC_id: [ele.kiC_id || ''],
      rcName: [ele.rcName || ''],
      state_id: [ele.state_id || ''],
      state_Name: [ele.state_Name || ''],
      sanction_Id: [ele.sanction_Id || '-'],
      sanction_No: [ele.sanction_No || '-'],
      sanction_Date: [ele?.sanction_Date !== '-' ? new Date(ele.sanction_Date) : '', []],
      e_File_No: [ele.e_File_No || '-'],
      financialYear: [ele.financialYear || '-'],
      total_Sanction_Amount: [ele.total_Sanction_Amount || '-'],
      released_Amount: [ele.released_Amount || '-'],
      financial_Sanction: [ele.financial_Sanction || '-'],
      admin_Sanction: [ele.admin_Sanction || '-'],
      module_Type: ['kic']
    });

    this.proposalArray.push(group);
  }

  createProposalItem(value: any = null): FormGroup {
    return this._fb.group({
      index: [value.index || ''],
      kiC_id: [value?.kiC_id || '', []],
      sanction_Id: [value?.sanction_Id || '', []],
      sanction_No: [value?.sanction_No || '', []],
      sanction_Date: [value?.sanction_Date || '', []],
      e_File_No: [value?.e_File_No || '', []],
      total_Sanction_Amount: [value?.total_Sanction_Amount || '', []],
      released_Amount: [value?.released_Amount || '', []],
      financial_Sanction: [value?.financial_Sanction || '', []],
      admin_Sanction: [value?.admin_Sanction || '', []],
    });
  }

  removeProposal(index: any) {
    const items = this.proposalForm.get('items') as FormArray;
    items.removeAt(index);
    // this.removeFile(index)
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
    // const table = document.getElementById('sanctionTable');
    // if (table) {
    //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table, { raw: true });

    //   const columnsToRemove = ['J', 'K', 'L'];
    //   columnsToRemove.forEach(column => {
    //     for (let cell in ws) {
    //       if (cell.startsWith(column)) {
    //         delete ws[cell];
    //       }
    //     }
    //   });

    //   const range = XLSX.utils.decode_range(ws['!ref']!);
    //   range.e.c -= columnsToRemove.length; 
    //   ws['!ref'] = XLSX.utils.encode_range(range);
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'KIC Sanctions');

    //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //   const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'KIC_Sanction.xlsx';
    //   a.click();
    //   window.URL.revokeObjectURL(url);

    /*nzim4hmed**************************************************************************************************** */

    const exportData = this.filteredProposals.map((item, index) => {
      const rawDate = item.sanction_Date;
      const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '';
      return {
        'S.No': index + 1,
        'RC NAME': item.rcName,
        'STATE NAME': item.state_Name,
        'SANCTION ID': item.sanction_Id,
        'SANCTION NO': item.sanction_No,
        'SANCTION DATE': formattedDate,
        'E-FILE NUMBER': item.e_File_No,
        'FINANCIAL YEAR': item.financialYear,
        'TOTAL SANCTIONED AMOUNT': item.total_Sanction_Amount || '-',
        'RELEASED TO RC': item.released_Amount || '-',
      };
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'KIC SANCTION LIST': worksheet }, SheetNames: ['KIC SANCTION LIST'] };
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KIC_Sanction.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);

    /*nzim4hmed end************************************************************************************************** */

    // const filtered = this.proposalArray.controls;
    // const exportData = filtered.map(control => {
    //   const value = control.value;
    //   return {
    //     'Name': value.rcName,
    //     'State': value.state_Name
    //   };
    // });
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    // const workbook: XLSX.WorkBook = { Sheets: { 'Filtered Data': worksheet }, SheetNames: ['Filtered Data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'KIC_Sanction.xlsx';
    //   a.click();
    //   window.URL.revokeObjectURL(url);
  }

  getPdf() {

    // const columnsToHide = ['financial_Sanction', 'admin_Sanction', 'comment_History'];
    // columnsToHide.forEach((column) => {
    //   const headerCell = document.querySelector(`th.mat-header-cell.cdk-column-${column}`);
    //   const cells = document.querySelectorAll(`td.mat-cell.cdk-column-${column}`);
    //   if (headerCell) {
    //     headerCell.classList.add('hide-column');
    //   }
    //   cells.forEach((cell) => cell.classList.add('hide-column'));
    // });

    // const doc = new jsPDF();
    // const img = new Image();
    // img.src = '../assets/images/NSRS.png';
    // const temp = new jsPDF();
    // autoTable(temp, { html: '#sanctionTable' });

    // for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
    //   doc.addImage(img, 'png', 0, 0, 200, 250);
    //   if (pageNumber < temp.getNumberOfPages()) {
    //     doc.addPage();
    //   }
    // }
    // doc.setPage(1);
    // autoTable(doc, { html: '#sanctionTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 8 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });

    // if (temp.getNumberOfPages() > 1) {
    //   doc.deletePage(temp.getNumberOfPages() + 1);
    // }

    // doc.save('kic_Sanction.pdf');
    // columnsToHide.forEach((column) => {
    //   const headerCell = document.querySelector(`th.mat-header-cell.cdk-column-${column}`);
    //   const cells = document.querySelectorAll(`td.mat-cell.cdk-column-${column}`);
    //   if (headerCell) {
    //     headerCell.classList.remove('hide-column');
    //   }
    //   cells.forEach((cell) => cell.classList.remove('hide-column'));
    // });
    /**nzim4hmed******************************************************************************************* */
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
        item.state_Name,
        item.sanction_Id,
        item.sanction_No,
        formattedDate,
        item.e_File_No,
        item.financialYear,
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
        'FINANCIAL YEAR',
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
    doc.save('KIC_Sanction.pdf');

    /*nzim4hmed end***************************************************************************************************88 */
  }

  showHideProposalPopup(event: any) {
    this.addProposalPopup = event;
  }

  showHideCommentPopup(event: any) {
    this.commentHistoryPopup = event;
  }

  showHideReleasedPopup(event: any) {
    this.sanctionReleasedPopup = event;
  }

  onSave() {

    const cleanedData = this.proposalArray.value.map((item: any) => {
      const { rcName, state_Name, state_id, index, ...rest } = item;
      return rest;
    });
    this.enableEdit = false;
    this.isLoading = true;
    this.sanctionService.updateSanction(cleanedData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === 1) {
          this.handleSuccess('Record Updated Successfully');
          this.getProposalList();
        } else {
          this.showError('Failed!');
        }
      },
      error: (errors: any) => {
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  preventCharacters(event: KeyboardEvent): void {
    const char = String.fromCharCode(event.which);
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
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
              formArray.controls[index]?.get(formControlName)?.patchValue(res?.filedataList[0].filePath);
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

  onCancel() {
    this.enableEdit = false;
  }

  onEdit() {
    this.enableEdit = true;
  }

  isNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

}
