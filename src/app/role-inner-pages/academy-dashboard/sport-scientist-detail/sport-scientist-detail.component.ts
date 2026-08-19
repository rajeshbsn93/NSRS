import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { map } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { AthleteInsuranceComponent } from 'src/app/standalone_components/modal-window/athlete-insurance/athlete-insurance.component';
import { AthleteInsuranceSuccessComponent } from 'src/app/standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { CoachInsuranceService } from 'src/app/_common/services/innerPagesServices/coach-insurance.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';
import { SportScientistDetailMultipleTagComponent } from '../../modal-window/sport-scientist-detail-multiple-tag/sport-scientist-detail-multiple-tag.component';
import { SportScientistEditDetailsWeedoutComponent } from '../../modal-window/sportScientist-EditDetails-Weedout/sportScientist-EditDetails-Weedout.component';
import { PopupOfficialProfileComponent } from 'src/app/standalone_components/modal-window/popup-official-profile/popup-official-profile.component';

export interface sportScientist{
  kitd_unique_id:string ;
  full_name:string ,
  designation:string ,
  date_of_joining:string,
  Gender:string,
  mobile_number:string,
  state_name:string,
  is_Insured:string,
  sport_name:string,
}

export interface SportsScientistHistoryListEntity {
  official_detail_id: number
  kitd_unique_id: string
  full_name: string
  designation: string
  sport_name: string
  sport_detail_id: number
  academy_coach_detail_id: number
  date_of_joining: null | string
  weedOut_Date: string
  weedOut_Remark: string
}

@Component({
  selector: 'app-sport-scientist-detail',
  templateUrl: './sport-scientist-detail.component.html',
  styleUrls: ['./sport-scientist-detail.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,FormsModule,LoaderComponent,ReactiveFormsModule],
  providers: [DatePipe]
})
export class SportScientistDetailComponent implements OnInit {
  displayedColumns: string[] = ['kitd_unique_id', 'full_name','sport_name','is_Insured','date_of_joining','designation','employmenttype','mobile_number','state_name'];
  displayedColumnsPrevious: string[] = ['kitd_unique_id', 'full_name','sport_name','date_of_joining','weedOut_Date','weedOut_Remark'];
  dataSource:any
  previousDataSource = new MatTableDataSource<SportsScientistHistoryListEntity>();
  docType: string = 'Export';
  sportsScientistList:any;
  sportsScientistListPrevious:any;
  searchedSportScientistList:any;
  userDetails:any
  sportsDisciplineList:any
  mainListLoader:boolean=false;
  searchFilter!:FormGroup;
  popupData:any
  noCoachInsurancePopup:any
  submitDetailInsuranceModal:any
  deleteInsuranceModalRef:any
  
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild('exporter') exporter: any;
  @ViewChild('noInsuranceConfirmModal') noInsurancePopup: any;
  @ViewChild('SubmitInsurancecContent') submitDetailConfirmPopup: any;
  @ViewChild('delete') deleteInsuranceModal: any;

  constructor(private sportsScientistService:SportscientistDetailListService,private storageService:StorageService,
    private sharableService:AcademySharableService,private modalService:NgbModal,private fb:FormBuilder,
    private alertService:AlertService,private coachInsuraceService:CoachInsuranceService,
    private datePipe:DatePipe) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.getSportsDisciplineList()
    this.sportScientistDetailsList();
    this.searchReactiveForm();
  }
  searchReactiveForm(){
    this.searchFilter=this.fb.group({
      sportScienceListToSearch:['']
    })
  }

  sportScientistDetailsList(){
    this.mainListLoader=true
    this.sportsScientistService.sportsScientistList(this.userDetails.user_id).pipe(map((items:any)=>{
      return items.map((item:any)=>{
        return {...item,date_of_joining:item.date_of_joining ? this.datePipe.transform(item.date_of_joining, 'dd/MM/yyyy'): item.date_of_joining}
      })
    }))
    .subscribe({
      next:(res)=>{
        this.mainListLoader=false
        //console.log(res)
        this.sportsScientistList=res
        const ELEMENT_DATA: sportScientist[] = this.sportsScientistList;
        this.dataSource = new MatTableDataSource<sportScientist>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort.toArray()[0];
      },
      error:()=>{
        console.error('error caught in sportsScientist Detail List')
        this.mainListLoader=false
      }
    })
  }

  getSportsDisciplineList(){
    this.sharableService.ssCatList().subscribe({
      next:(res)=>{
        // console.log(res)
        this.sportsDisciplineList=res
      },
      error:()=>{
        console.error("error caught in getting SportScienceList")
      }
    })
  }

  changeDiscipline(){
    console.log(this.searchFilter.value)
    if(this.searchFilter.value.sportScienceListToSearch !=''){
      this.searchedSportScientistList = this.sportsScientistList?.filter((res:any)=>{
        if(res.sport_detail_id == this.searchFilter.value.sportScienceListToSearch){
          return res
        }
      })
    }else{
      this.searchedSportScientistList = this.sportsScientistList
    }
    const ELEMENT_DATA: sportScientist[] = this.searchedSportScientistList;
    this.dataSource = new MatTableDataSource<sportScientist>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }

  openmultiTag(){
    const disciplineval = this.searchFilter.value.sportScienceListToSearch
    if(disciplineval !== ''){
      const modalRef = this.modalService.open(SportScientistDetailMultipleTagComponent,{size:'xl',centered:true});
      modalRef.componentInstance.disciplineToAddID=this.searchFilter.value.sportScienceListToSearch;
      modalRef.result.then(x=>{
        //alert('alert then');
        this.searchFilter.get('sportScienceListToSearch')?.setValue('')
        this.sportScientistDetailsList() 
      }).catch(y=>{
        this.searchFilter.get('sportScienceListToSearch')?.setValue('')
        //this.sportScientistDetailsList()        
      })
    }else{
      this.alertService.swalPopError('Please Select Category ')
    }
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectChange(event: any) {
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'sportScientistDetail', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()
    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#sportScientistDetailTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#sportScientistDetailTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('sportScientistDetail.pdf');
  }

  openEditWeedout(rowData:any){
    const modalRef =  this.modalService.open(SportScientistEditDetailsWeedoutComponent,{size:'xl',centered:true})
    modalRef.componentInstance.ssRowData = rowData
    modalRef.result.then((event) => {
      this.sportScientistDetailsList();
    });
  }

  noInsurance(elementRowData:any){
    this.popupData=elementRowData
    console.log(this.popupData)
    this.noCoachInsurancePopup = this.modalService.open(this.noInsurancePopup, {size: 'md',centered: true,});
  }

  confirmNoInsuranceTag(){
    if (this.popupData) {
      this.noCoachInsurancePopup.close();
      // console.log("nsrsid "+this.nsrsidInsurancePopup);
      // var athleteData = this.sportScientistListData.filter((data: any) => {
      //   if (data.kitd_unique_id == this.nsrsidInsurancePopup) {
      //     // console.log(data);
      //     return data;
      //   }
      // });
      // this.selectedPlayerData = athleteData;
      // console.log("this athlete data"+ this.selectedPlayerData[0])
      if (this.popupData.insurance_Status == '0') {
        this.mainListLoader=true
        this.coachInsuraceService.coachInsuranceTagging(this.popupData.official_detail_id,this.userDetails.user_id).subscribe({
          next:(res)=>{
            this.mainListLoader=false
            if(res!=-1){
              this.alertService.swalPopSuccess('Coach Tagged Successfully!')
              // var data = this.sportScientistListData.filter((data: any) => {
              //   if (data.kitd_unique_id == this.nsrsidInsurancePopup) {
                      
              //     return data
              //   }
              // });
              this.popupData.insurance_Status = 'P'
              this.popupData.taggedby_id=this.userDetails.user_id 
              this.popupData.insurance_tagId=res  
              // this.selectedPlayerData[0].taggedby_id = this.insurance_id;
              this.submitDetailInsuranceModal = this.modalService.open(this.submitDetailConfirmPopup, { size: 'md', centered: true });

            }else{
              this.alertService.swalPopError('Can Not Insure the Sports Scientist')
            }
          },
          error:()=>{
            console.error('error caught in tagging insurance')
            // this.errorMessage = error;
            this.mainListLoader = false;
          }
        })
      }
    }
  }
  
  CoachInsuranceDetails(elementRowData:any){
    if(elementRowData!=null){
      const modalRef=this.modalService.open(AthleteInsuranceComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false })
      modalRef.componentInstance.coachData=elementRowData
      modalRef.componentInstance.menuName='coach'
      modalRef.result.then((event) => {
        this.sportScientistDetailsList()
      });
    }else{
      this.submitDetailInsuranceModal.close()
      const modalRef=this.modalService.open(AthleteInsuranceComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false })
      modalRef.componentInstance.coachData=this.popupData
      modalRef.componentInstance.menuName='coach'
      modalRef.result.then((event) => {
        this.sportScientistDetailsList()
      });
    }
  }

  coachInsuredSuccess(elementRowData:any){
    this.mainListLoader=true
    this.coachInsuraceService.coachGetData(elementRowData.official_detail_id,elementRowData.insurance_tagId).subscribe({
      next:(res)=>{
        if (res) {
          this.mainListLoader=false
          // console.log(res)
          var resData:any=res
          // console.log("coach get data")
          // console.log(res)
          const modalRef = this.modalService.open(AthleteInsuranceSuccessComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
          modalRef.componentInstance.coachData = elementRowData
          modalRef.componentInstance.coachGetData=resData
          modalRef.componentInstance.menuName='coach'
          modalRef.result.then((event) => {
            this.sportScientistDetailsList()
          });
     
        } else {
          this.alertService.swalPopErrorTimer("Internal Server Error")
        }
      },
      error:()=>{
        console.error(`error caught in getting ${elementRowData.official_detail_id} data`)
        this.mainListLoader = false;
      }
    })
  }

  
  expiredInsuranceModal(elementRowData:any){
    this.mainListLoader=true
    this.coachInsuraceService.coachInsuranceTagging(elementRowData.official_detail_id,this.userDetails.user_id).subscribe({
      next:(res)=>{
          // console.log(res)
          this.mainListLoader=false
          if (res != false) {
            const modalRef = this.modalService.open(AthleteInsuranceComponent, {
              size: 'xl',
              centered: true,
              backdrop: 'static',
              keyboard: false,
            });
            modalRef.componentInstance.coachData = elementRowData
            modalRef.componentInstance.menuName='coach'
            modalRef.result.then((event) => {
              this.sportScientistDetailsList();
            });
          } else {
            this.alertService.swalPopErrorTimer("Can Not Insure the player")
          }
      },
      error:()=>{
        console.error('error caught in insurance tagging list')
        this.mainListLoader = false;
      }
    })
  }

  deleteInsurance(elementRowData:any){
    this.popupData = elementRowData;
    //console.log(this.popupData)
    this.deleteInsuranceModalRef = this.modalService.open(this.deleteInsuranceModal,{size: 'md', centered: true,})
  }

  confirmDeleteInsurance(){
    this.mainListLoader=true
    this.coachInsuraceService.deleteInsurance(this.popupData.insurance_tagId,this.userDetails.user_id).subscribe({
      next:(res)=>{
        this.mainListLoader=false
        if(res==true){
          this.alertService.swalPopSuccess("Delete officialInsurance successfully!")
          this.sportScientistDetailsList();
        }else{
          this.alertService.swalPopError("OfficialInsurance can't delete!")
        }
      },
      error:()=>{
        console.error('error caught in deleting insurance')
        this.mainListLoader = false;
      }
    })
    this.deleteInsuranceModalRef.close()
  }
  openSportScientistPopupProfile(rowData:any){
    //console.log(this.userDetails)
    const modalRef = this.modalService.open(PopupOfficialProfileComponent,{size:'xl', centered:true, scrollable:true, modalDialogClass:'customModalSizeLarge',
  backdrop:'static',keyboard:false})
  let officialRowData = {official_detail_id:rowData.official_detail_id,role_Id:103}
  modalRef.componentInstance.officialInstanceData = officialRowData
  }

  getAcademySportsScientistHistoryList(){
    this.mainListLoader = true;
    this.sportsScientistService.getAcademySportsScientistHistoryList(this.userDetails.user_id).pipe(map((items:any)=>{
      return items.map((item:any)=>{
        return {...item,date_of_joining:item.date_of_joining ? this.datePipe.transform(item.date_of_joining, 'dd/MM/yyyy'): item.date_of_joining,
          weedOut_Date:item.weedOut_Date ? this.datePipe.transform(item.weedOut_Date, 'dd/MM/yyyy'): item.weedOut_Date
        }
      })
    })).subscribe({
      next:(res)=>{
        this.mainListLoader = false
        this.sportsScientistListPrevious  = res;
        this.previousDataSource = new MatTableDataSource<SportsScientistHistoryListEntity>(this.sportsScientistListPrevious);
        this.previousDataSource.paginator = this.paginator.toArray()[1];
        this.previousDataSource.sort = this.sort.toArray()[1];
      },
      error:(err)=>{
        this.mainListLoader = false;
        console.error(err)
      }
    })
  }
  searchPreviousFilter(event:any){
    const searchKeywordValue = (event.target as HTMLInputElement).value
    this.previousDataSource.filter = searchKeywordValue.trim().toLowerCase();
  }
}
