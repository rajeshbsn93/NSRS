import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AcademyDetailListComponent } from 'src/app/standalone_components/modal-window/academy-detailList/academy-detailList.component';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { SportTrainingService, StakeHolderSchemeListEntity } from 'src/app/_common/services/innerPagesServices/sportTraining.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { Observable, first, forkJoin } from 'rxjs';
import { SchemeAcademyRegistrationComponent } from 'src/app/standalone_components/modal-window/scheme-academy-registration/scheme-academy-registration.component';

export interface PeriodicElement {
  id: number;
  academy_detail_id: number;
  academy_name: string;
  contact_person: string;
  contact_person_no: string;
  mobile_number: string;
  nsrs_id: string;
  role_id: number;
  scheme_name: string;
  sports_name: string;
  state_id: number;
  state_name: string;
}

@Component({
  selector: 'app-sportsTrainingCenter',
  templateUrl: './sportsTrainingCenter.component.html',
  styleUrls: ['./sportsTrainingCenter.component.css']
})
export class SportsTrainingCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('academyTable', { static: false }) academtTablecontent!: ElementRef<any>;
  userid: any;
  innerLoader: boolean = false;
  innerLoaderSportList: boolean = false;
  innerLoaderSchemeList: boolean = false;
  innerLoaderMainData: boolean = false;
  addSchemeListLoader: boolean = false;
  scheme_id: any = 0;
  sportsTrainingListData: any = [];
  searchedSportsTrainingListData: any = [];
  dataSource: any;
  isloading: boolean = true;
  docType: string = 'Export';
  selectedType: string = ''
  searchFilter!: FormGroup;
  sportListData: any = [];
  schemeData: any = [];
  stateListData: any = [];
  schemeListData: any;
  addSchemeListData: any;
  sportsTrainingMenuData: any;
  roleid: any;
  academyPermisssionData: any;
  schemeForm!: FormGroup;

  ListTypeUserId: any = {
    athleteUserid: 1,
    coachUserid: 2,
    ssUserid: 103,
  };

  viewPermission: any;

  addSateId:any


  @ViewChild('exporter') exporter: any;
  distinctSchemeListData:any


  displayedColumns: string[] = ['nsrsId', 'academy', 'discipline', 'scheme_name', 'athleteCount', 'coachCount', 'sportScientistCount', 'state_name', 'Kiaa'];

  constructor(private sportTrainingService: SportTrainingService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _storageService: StorageService,
    private _sharableService: SharableService,
    private _router: Router,
    private innerPagesSharableService: SharableService) { }

  ngOnInit() {
    this.searchFilter = this.fb.group({
      nsrsid: [''],
      academyName: [''],
      discipline: [''],
      scheme: [''],
      stateName: ['']
    });
    this.schemeForm = this.fb.group({
      selectedScheme: []
    })
    var temp: any = localStorage.getItem('loginUserdata');
    var tempData = JSON.parse(temp);
    this.userid = tempData.user_id;
    this.roleid = tempData.role_id;

    this.sportsTrainingList();
    this.sportList();
    this.getStateList();
    // this.getSchemeList();
    this.getStakeHolderSchemeList();

    this.sportsTrainingMenuData = this._storageService.newGetState();
    // console.log("sports training menu data", this.sportsTrainingMenuData);
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  sportsTrainingList() {
    this.innerLoaderMainData = true
    if (this.roleid == 68) {
      this.scheme_id = 82 //Academy list will be KIC @Suraj
    }
    forkJoin([
      this.sportTrainingService.sportsTrainingList(this.userid, this.scheme_id),
      this._sharableService.schemeList()
    ]).subscribe({
      next: (res:any) => {
        this.innerLoaderMainData = false
        this.sportsTrainingListData = res[0];
        let schemeData = res[1];
        const sportsTrainingCenterList: PeriodicElement[] = this.sportsTrainingListData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(sportsTrainingCenterList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

         //distinctsportsTraining values
         let distinctsportsTraining = this.sportsTrainingListData.filter((item:any, i:any) => this.sportsTrainingListData.findIndex((s:any) => item.role_id === s.role_id) === i)
         //distinctsportsTraining Id
        // let distinctsportsTrainingId = this.sportsTrainingListData.map((item:any) => item.role_id) .filter((value:any, index:number, self:any) => self.indexOf(value) === index)
         console.log(distinctsportsTraining)

        // fetching unique data from two array of objects
        var uniqueResultScheme = schemeData.filter((obj:any)=> {
          return distinctsportsTraining.some((obj2:any)=> {
              return obj.scheme_id == obj2.role_id;
          });
      });
      this.schemeListData = uniqueResultScheme
        console.log(uniqueResultScheme);

      },
      error: () => {
        console.error('error caught in sports training list')
        this.innerLoaderMainData = false;
      }
    })
  }

  search() {
    this.searchedSportsTrainingListData = this.sportsTrainingListData

    if (this.searchFilter.value.nsrsid != '') {
      this.searchedSportsTrainingListData = this.searchedSportsTrainingListData.filter((data: any) => {
        if (data.nsrs_id.toLowerCase() == this.searchFilter.value.nsrsid.toLowerCase()) {
          return data;
        }
      });
    }

    if (this.searchFilter.value.academyName != '') {
      this.searchedSportsTrainingListData = this.searchedSportsTrainingListData.filter((data: any) => {
        if (data.academy_name.toLowerCase().includes(this.searchFilter.value.academyName.toLowerCase())) {
          return data
        }
      });
    }

    if (this.searchFilter.value.discipline != '') {
      this.searchedSportsTrainingListData = this.searchedSportsTrainingListData.filter((data: any) => {
        if (data.sports_name.includes(this.searchFilter.value.discipline)) {
          return data
        }
      });
    }
    if (this.searchFilter.value.scheme != '') {
      this.searchedSportsTrainingListData = this.searchedSportsTrainingListData.filter((data: any) => {
        if (data.scheme_name.includes(this.searchFilter.value.scheme)) {
          return data
        }
      });
    }
    if (this.searchFilter.value.stateName != '') {
      this.searchedSportsTrainingListData = this.searchedSportsTrainingListData.filter((data: any) => {
        if (data.state_name == this.searchFilter.value.stateName) {
          return data;
        }
      });
    }

    if (this.searchFilter.value.nsrsid == '' && this.searchFilter.value.academyName == '' && this.searchFilter.value.discipline == '' && this.searchFilter.value.scheme == '' && this.searchFilter.value.stateName == '') {
      this.searchedSportsTrainingListData = this.sportsTrainingListData
    }

    this.dataSource = this.searchedSportsTrainingListData;
    this.dataSource = new MatTableDataSource<PeriodicElement>(
      this.searchedSportsTrainingListData
    );

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }
  //sportList api for filters
  sportList() {
    this.innerLoaderSportList = true
    this._sharableService.sportList().subscribe({
      next: (res) => {
        this.sportListData = res
        this.innerLoaderSportList = false
      },
      error: () => {
        console.error('error caught in sport list')
        this.innerLoaderSportList = false;
      }
    })
  }

  getStateList() {
    this.innerLoader = true
    this._sharableService.stateList().subscribe({
      next: (res) => {
        this.stateListData = res;
        this.innerLoader = false
      },
      error: () => {
        console.error('error caught in state list')
        this.innerLoader = false;
      }
    })
  }

  // getSchemeList() {
  //   this.innerLoaderSchemeList = true;    
  //   this._sharableService.schemeList().subscribe({
  //     next: (res: any) => {
  //       this.innerLoaderSchemeList = false;
  //       this.schemeListData = res;

  //       //filter SchemeListData based on role
  //       // if (this.roleid == 39) {
  //       //   this.addSchemeListData = res.filter((items: any) => items.scheme_owner_id == 39);
  //       // } else if (this.roleid == 68) {
  //       //   this.addSchemeListData = res.filter((items: any) => items.scheme_owner_id == 68);
  //       // }else if (this.roleid == 1005 && this.userid == 1053) {
  //       //   this.addSchemeListData = res.filter((items: any) => items.scheme_owner_id == 1005);
  //       // }
  //      this.distinctSchemeListData =   this.schemeListData.filter((a:any, i:any) =>  this.schemeListData.findIndex((s:any) => a.scheme_id === s.scheme_id) === i);
  //     console.log('filterData',this.distinctSchemeListData)
  //     },
  //     error: () => {
  //       console.error('error caught in scheme list')
  //       this.innerLoaderSchemeList = false;
  //     }
  //   })
  // }

  getStakeHolderSchemeList(){
   this.addSchemeListLoader = true;
    this.addSchemeListData = [];
    this.sportTrainingService.getStakeHolderSchemeList(this.userid,this.roleid).subscribe({
      next:(res:StakeHolderSchemeListEntity)=>{
        this.addSchemeListLoader = false;
        // console.log(res)
        this.addSchemeListData = res
        if(this.addSchemeListData.length)this.addSateId = this.addSchemeListData[0].stateId
      },
      error:(err)=>{
        console.error(err)
        this.addSchemeListLoader = false;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#academyTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#academyTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('academy.pdf');
  }

  athleteModal(rowData: any, userId: number) {
    let userData = {
      rowData,
      userId: userId
    }
    const athleteModalRef = this.modalService.open(AcademyDetailListComponent, { size: 'xl', centered: true });
    athleteModalRef.componentInstance.data = userData;
    athleteModalRef.componentInstance.academyPermisssionData = this.academyPermisssionData;
  }

  exportToExcelPdfChange(event: any) {
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'Academy', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()

    }
  }

  navigateToKiaa(event: any, elementData: any, rowData: any) {
    var academy_detail_id = rowData.academy_detail_id
    let buttonType = event.target.innerText;
    if (buttonType == "YES" || buttonType == "NO") {
      this._router.navigate(['/kiaa'], {
        queryParams: { nsrs_id: btoa(JSON.stringify(elementData)), buttonType: btoa(buttonType), academy_detail_id: btoa(JSON.stringify(academy_detail_id)) }
      });
    }
    else if (buttonType == "KIAA+") {
      this._router.navigate(['/kiaa'], {
        queryParams: { nsrs_id: btoa(JSON.stringify("")), buttonType: btoa(buttonType), academy_detail_id: btoa(JSON.stringify(academy_detail_id)) }
      });
    }
  }

  // addToVisibility(event:any){
  //   // console.log(event)
  // }

  academyRegModal() {
    const modalRef = this.modalService.open(SchemeAcademyRegistrationComponent, { size: 'xl', centered: true });
    modalRef.componentInstance.academyRoleValue = this.schemeForm.value.selectedScheme;
    modalRef.componentInstance.addSateId = this.addSateId
    //  modalRef.componentInstance.academyRoleValue = this.schemeListData.filter((item:any)=> item?.scheme_name === this.schemeForm.value.selectedScheme)
    modalRef.result.then((thenRes) => {
      if (thenRes) {
        this.schemeForm.get('selectedScheme')?.reset('');
        this.sportsTrainingList();
      }
    })
      .catch((catchRes) => {
        //ESC 1, outside click 0 and close click argumaent value
        console.log(catchRes);
        this.schemeForm.get('selectedScheme')?.reset('');
      })
  }

}
