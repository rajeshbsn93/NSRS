import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import {
  CommonSharableService,
  IGetStateMasterObject,
  IGetStateMasterObjectArray,
} from 'src/app/_common/services/common-services/commonSharable.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicAttendanceService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-attendance.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { AddProposalKisceComponent } from '../add-proposal-kisce/add-proposal-kisce.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/_common/material.module';
import { CommentHistoryKisceComponent } from '../comment-history-kisce/comment-history-kisce.component';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kisce-academy-master-list',
  templateUrl: './kisce-academy-master-list.component.html',
  styleUrls: ['./kisce-academy-master-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    CommentHistoryKisceComponent,
    AddProposalKisceComponent,
    LoaderComponent,
  ],
})
export class KisceAcademyMasterListComponent implements OnInit {
  displayedHoColumns: string[] = [
    'sno',
    'nsrS_Id',
    'nsrS_Registration_Date',
    'academy_name',
    'discipline',
    'district',
    'state',
    'regional_Center',
    'male',
    'female',
  ];
  displayedColumns: string[] = [
    'nsrS_Id',
    'nsrS_Registration_Date',
    'academy_name',
    'discipline',
    'district',
    'state',
    'regional_Center',
    'male',
    'female',
  ];

  isRadioSelected: boolean = false;
  selectedData: any;
  rcList: any = [];
  selectedRcText = '';
  dataSource: any;
  mainLoader: Boolean = false;
  loader1: Boolean = false;
  loader2: Boolean = false;
  academymasterlist: any;
  academyList: any;
  filteredAcademyList: any;
  sportMasterList!: Array<any>;
  stateMasterList!: Array<IGetStateMasterObject>;
  userDetails!: IUserDetails;
  academySearchFilter!: FormGroup;
  selectedIndex: number = 0;
  moduleType: string = '';
  KicUsersRoleId: any = RoleCode;
  @Output() dataFromAcademyMaster: EventEmitter<any> = new EventEmitter<any>();

  addProposalPopup: boolean = false;
  addProposaldocumentPopup: boolean = false;
  enableEdit: boolean = false;
  commentHistoryPopup: boolean = false;
  selectedElementId: any = null;
  onSelectRadio: boolean = false;

  @ViewChild('exporter') exporter: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _storageService: StorageService,
    private _commonSharableService: CommonSharableService,
    private _modalService: NgbModal,
    private _alertService: AlertService,
    private _fb: FormBuilder,
    private _router: Router,
    private _kicDashboardService: KicDashboardService,
    private _proposalService: KicProposalService
  ) {}

  ngOnInit(): void {
    this.userDetails = this._storageService.getUserDetails();
    if (this._router.url == '/kisce') {
      this.moduleType = 'kisce';
    } else {
      this.moduleType = 'kic';
    }
    this.createAcademySearchFilter();
    this.getStateMasterList();
    this.getSportMasterList();
    this.masterRcList();
    this.academyMasterList();
  }

  masterRcList() {
    this._kicDashboardService?.rcList().subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          this.rcList = res?.data;
          console.log('rc', res);
        }
      },
      error: (errors: any) => {},
      complete: () => {},
    });
  }

  createProposalItem(value: any): FormGroup {
    return this._fb.group({
      nsrS_Id: [value?.nsrS_Id ? value.nsrS_Id : ''],
      nsrS_Registration_Date: [value?.nsrS_Registration_Date ? value.nsrS_Registration_Date : ''],
      academy_name: [value?.academy_name ? value.academy_name : ''],
      discipline: [value?.discipline ? value.discipline : ''],
      district: [value?.district ? value.district : ''],
      state: [value?.state ? value.state : ''],
      regional_Center: [value?.regional_Center ? value.regional_Center : ''],
      male: [value?.male ? value.male : ''],
      female: [value?.female ? value.female : ''],
    });
  }

  onRadioChange(element: any) {
    // this.isRadioSelected = true;
    // this.selectedData = element;

    //     console.log(element,'element')
    //     this.isRadioSelected = true;
    //     this.selectedData = element;
    // console.log(this.selectedData,'selected')
    //      this.selectedElementId = element;
    //      console.log(this.selectedElementId,'element id')
    this.selectedElementId = element;
    this.isRadioSelected = true;
    this.selectedData = element;
    this.onSelectRadio = true;
  }

  createAcademySearchFilter() {
    this.academySearchFilter = this._fb.group({
      stateId: [''],
      discipline: [''],
      rc: ['All_Region'],
      Academyname: [''],
      Academykid: [''],
    });
  }

  getSportMasterList() {
    this.loader2 = true;
    this._commonSharableService.getSportMasterList().subscribe({
      next: (res: any) => {
        console.log(res);
        this.loader2 = false;
        this.sportMasterList = res;
      },
      error: () => {
        this.loader2 = false;
      },
    });
  }

  getStateMasterList() {
    this.loader1 = true;
    this._commonSharableService.stateMasterList(1).subscribe({
      next: (res: any) => {
        this.loader1 = false;
        this.stateMasterList = res;
        console.log(res);
      },
      error: () => {
        this.loader1 = false;
      },
    });
  }

  academyMasterList() {
    this.mainLoader = true;
    this._proposalService.getacadmeyproposalmasterlist(0, 0, 0, this.moduleType).subscribe({
      next: (res: any) => {
        this.mainLoader = false;
        if (res?.status === 'success') {
          this.academymasterlist = res?.data;
          if (this.academymasterlist.length > 0) {
            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
      },
      error: () => {
        this.mainLoader = false;
      },
    });
  }

  // searchFilter() {
  //   debugger
    
  //   this.filteredAcademyList = this.academymasterlist;

  //   if (this.academySearchFilter.value.stateId != '') {
  //     this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
  //       if (data.state.toLowerCase().trim() == this.academySearchFilter.value.stateId.toLowerCase().trim()) {
  //         return data;
  //       }
  //     });
  //   }

  //   if (this.academySearchFilter.value.discipline != '') {
  //     this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
  //       // console.log(data.discipline)
  //       // console.log(data.discipline.includes(this.academySearchFilter.value.discipline))
  //       // console.log(this.academySearchFilter.value.discipline)
  //       if (data.discipline.includes(this.academySearchFilter.value.discipline)) {
  //         return data;
  //       }
  //     });
  //   }

  //   if (this.academySearchFilter.value.rc !== 'All_Region') {
  //     this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
  //       const regionalCenter = data?.regional_Center?.toLowerCase().trim();
  //       const searchValue = this.academySearchFilter.value.rc.toLowerCase().trim();
    
  //       console.log(regionalCenter, 'regional center');
  //       console.log(searchValue, 'search value');
    
  //       if (regionalCenter === searchValue) {
  //         console.log('Match found:', data);
  //         return data;  // Correctly returning true to keep the item in the list
  //       }else{
  //         return 
  //         console.log('not found')
  //       }
    
  //       return false;  // Explicitly return false to remove the item
  //     });
  //   }
  //   if (this.academySearchFilter.value.Academyname != '') {
  //     this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
  //       if (data.academy_name.toLowerCase().trim().includes(this.academySearchFilter.value.Academyname.toLowerCase().trim())) {
  //         return data;
  //       }
  //     });
  //   }

  //   if (this.academySearchFilter.value.Academykid != '') {
  //     this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
  //       if (data.nsrS_Id.toLowerCase().trim().includes(this.academySearchFilter.value.Academykid.toLowerCase().trim())) {
  //         return data;
  //       }
  //     });
  //   }

  //   // if (this.academySearchFilter.value.stateId == '') {
  //   //   this.filteredAcademyList = this.academyList
  //   // }

  //   if (
  //     this.academySearchFilter.value.stateId == '' &&
  //     this.academySearchFilter.value.discipline == '' &&
  //     this.academySearchFilter.value.rc == 'All_Region' &&
  //     this.academySearchFilter.value.Academyname == '' &&
  //     this.academySearchFilter.value.Academykid == ''
  //   ) {
  //     this.filteredAcademyList = this.academymasterlist;
  //   }

  //   this.dataSource = new MatTableDataSource(this.filteredAcademyList);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  searchFilter() {
    
    // Reset filtered list to the full list at the beginning of the function
    this.filteredAcademyList = [...this.academymasterlist];

    const { stateId, discipline, rc, Academyname, Academykid } = this.academySearchFilter.value;

    if (stateId && stateId.trim() !== '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        return data.state.toLowerCase().trim() === stateId.toLowerCase().trim();
      });
    }

    if (discipline && discipline.trim() !== '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        return data.discipline.includes(discipline);
      });
    }

    if (rc && rc !== 'All_Region') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        return data.regional_Center.includes(rc)
        // return data.regional_Center && data.regional_Center.toLowerCase().trim() === rc.toLowerCase().trim();
      });
    }

    if (Academyname && Academyname.trim() !== '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        return data.academy_name.toLowerCase().trim().includes(Academyname.toLowerCase().trim());
      });
    }

    if (Academykid && Academykid.trim() !== '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        return data.nsrS_Id.toLowerCase().trim().includes(Academykid.toLowerCase().trim());
      });
    }

    // Check if all search fields are empty or set to default values
    if (
      (!stateId || stateId.trim() === '') &&
      (!discipline || discipline.trim() === '') &&
      (!rc || rc === 'All_Region') &&
      (!Academyname || Academyname.trim() === '') &&
      (!Academykid || Academykid.trim() === '')
    ) {
      this.filteredAcademyList = [...this.academymasterlist];
    }

    this.dataSource = new MatTableDataSource(this.filteredAcademyList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  exportToExcelPdfChange(event: any) {
    if (event.target.value == 'excel') {
      this.mainLoader = true;
      this.exporter.exportTable('xlsx', { fileName: 'KICACADEMYMASTER', sheet: 'MasterList', Props: { Author: 'NSRS' } });
      this.mainLoader = false;
    } else if (event.target.value == 'pdf') {
      this.getPdf();
    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF();
    autoTable(temp, { html: '#kicAcademyTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, {
      html: '#kicAcademyTable',
      headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 },
      theme: 'grid',
      bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' },
    });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('kicTrainingCenter.pdf');
  }

  addProposal() {
    if (this.selectedData == '') {
      this._alertService.swalPopWarning('Please Select Academy');
    }
    if (!this.selectedData) return;
    console.log(this.selectedData);
    const modelRef = this._modalService.open(AddProposalKisceComponent, { size: 'xl', centered: true, });
    const data = this.selectedData;
    modelRef.componentInstance.scheduleMeetingModalData = { data: data };
    modelRef.result
      .then((res: any) => {
        console.log('res', res);
        if (res) {
          this.selectedIndex = 1;
          this._proposalService.changeTab(1);
          this.dataFromAcademyMaster.emit({
            selectedTabindex: 1,
          });
        }
      })
      .catch(() => {});
  }

  viewComment() {
    // this.commentHistoryPopup = true;
  }

  onCancel() {
    this.selectedElementId = null;
    this.isRadioSelected = false;
    this.selectedData = null;
    console.log(this.selectedData, 'ssssss');
    console.log(this.academySearchFilter, 'data');
    this.onSelectRadio = false;
  }

  showHideProposalPopup(event: any) {
    this.addProposalPopup = event;
  }
  showHideCommentPopup(event: any) {
    this.commentHistoryPopup = event;
  }
  refreshListOfProposal(event: any) {}

  addProposaldocument() {
    this.addProposaldocumentPopup = true;
  }
}
