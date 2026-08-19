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
import { CoachDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/coach-detail-list.service';
import { CoachDetailMultipleTagComponent } from '../../modal-window/coach-detail-multiple-tag/coach-detail-multiple-tag.component';
import { CoachEditDetailsWeedoutComponent } from '../../modal-window/coach-EditDetails-Weedout/coach-EditDetails-Weedout.component';
import { PopupOfficialProfileComponent } from 'src/app/standalone_components/modal-window/popup-official-profile/popup-official-profile.component';

export interface sportDiscipline{
  kitd_unique_id:string ;
  full_name:string ,
  date_of_joining:string,
  designation:string,
  mobile_number:string,
  state_name:string,
  is_Insured:string
}

export interface  CoachHistoryListPreviousEntity {
  official_detail_id: number
  kitd_unique_id: string
  full_name: string
  designation: string
  sport_name: string
  sport_detail_id: number
  academy_coach_detail_id: number
  date_of_joining: string
  weedOut_Date: string
  weedOut_Remark: string
}

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule,FormsModule],
  providers: [DatePipe]
})
export class CoachDetailComponent implements OnInit {
  displayedColumns: string[] = ['kitd_unique_id', 'full_name','designation','date_of_joining','employmenttype','mobile_number','state_name','is_Insured'];
  displayedKICColumns: string[] = ['kitd_unique_id', 'full_name','designation','date_of_joining','employmenttype','mobile_number','state_name','is_Insured','pca'];
  displayedColumnsPrevious: string[] = ['kitd_unique_id', 'full_name','date_of_joining','sport_name','weedOut_Date','weedOut_Remark'];
  dataSource:any
  previousDataSource = new MatTableDataSource<CoachHistoryListPreviousEntity>();
  docType: string = 'Export';
  coachDetailList:any=[]
  coachDetailListPrevious:any=[]
  searcedCoachDetilList:any=[]
  userDetails:any
  popupData:any
  sportsDisciplineList:any
  searchFilter!:FormGroup
  mainListLoader:boolean=false
  noCoachInsurancePopup:any
  submitDetailInsuranceModal:any
  deleteInsuranceModalRef:any
  pcaData:any
  
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild('exporter') exporter: any;
  @ViewChild('noInsuranceConfirmModal') noInsurancePopup: any;
  @ViewChild('SubmitInsurancecContent') submitDetailConfirmPopup: any;
  @ViewChild('delete') deleteInsuranceModal: any;

  constructor(private coachDetail:CoachDetailListService,private modalService:NgbModal,
    private storageService:StorageService,private sharableService:AcademySharableService,private fb:FormBuilder,
    private coachInsuraceService:CoachInsuranceService,private alertService:AlertService,
    private datePipe:DatePipe) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.getSportsDisciplineList()
    this.coachDetailsList()
    this.searchReactiveForm()    
  }

  searchReactiveForm(){
    this.searchFilter=this.fb.group({
      disciplineToSearch:['']
    })
  }

  coachDetailsList(){
    this.mainListLoader=true
    this.coachDetail.coachDetailList(this.userDetails.user_id).pipe(map((items:any)=>{
      return items.map((item:any)=>{
        return {...item,date_of_joining:item.date_of_joining? this.datePipe.transform(item.date_of_joining,'dd/MM/yyyy'):item.date_of_joining}
      })
    }))
    .subscribe({
      next:(res)=>{
        this.mainListLoader=false
        this.coachDetailList=res
        // console.log(res)
        for(let i of res){
          if(i.is_pca==1){
            this.pcaData=i
          }
        }
        // console.log(this.pcaData)
        this.searcedCoachDetilList=this.coachDetailList
        const ELEMENT_DATA: sportDiscipline[] = this.coachDetailList;
        this.dataSource = new MatTableDataSource<sportDiscipline>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort.toArray()[0];
      },
      error:()=>{
        console.error("error caught coach detail list")
        this.mainListLoader=false
      }
    })
  }

  getSportsDisciplineList(){
    this.sharableService.getAcademySportsDiscipline(this.userDetails.user_id).subscribe({
      next:(res)=>{
        // console.log(res)
        this.sportsDisciplineList=res
      },
      error:()=>{
        console.error("error caught in getting academy sports list")
      }
    })
  }

  submitDiscipline(){
    // console.log(this.searchFilter.value)
    if (this.searchFilter.value.disciplineToSearch != '') {
      this.searcedCoachDetilList = this.coachDetailList.filter((data: any) => {
        if (data.sport_detail_id== this.searchFilter.value.disciplineToSearch) {
          return data;
        }
      });
    }else{
      this.searcedCoachDetilList=this.coachDetailList
    }
    const ELEMENT_DATA: sportDiscipline[] = this.searcedCoachDetilList;
    this.dataSource = new MatTableDataSource<sportDiscipline>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }

  openmultiTag(){
    const modalRef = this.modalService.open(CoachDetailMultipleTagComponent,{size:'xl', centered:true})
    modalRef.componentInstance.sportDisciplineIdToAdd=this.searchFilter.value;
    modalRef.componentInstance.pcaCoachData=undefined;

    modalRef.result.then(x=>{
      this.coachDetailsList() 
    }).catch(y=>{
      //this.coachDetailsList()        
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectChange(event: any) {
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'coachDetail', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()
    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#coachDetailTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#coachDetailTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('coachDetail.pdf');
  }

  openEditWeedout(element:any){
    const modalRef =  this.modalService.open(CoachEditDetailsWeedoutComponent,{size:'xl',centered:true})
    modalRef.componentInstance.coachRowData = element
    modalRef.componentInstance.pcaCoachData= this.pcaData
    modalRef.result.then((event) => {
      this.coachDetailsList();
    })
    .catch((res)=>{})
  }

  noInsurance(elementRowData:any){
    this.popupData=elementRowData
    console.log(this.popupData)
    this.noCoachInsurancePopup = this.modalService.open(this.noInsurancePopup, {size: 'md',centered: true,});
  }

  confirmNoInsuranceTag(){
    if (this.popupData) {
      if (this.popupData.insurance_Status == '0') {
        this.noCoachInsurancePopup.close();
        this.mainListLoader=true
        this.coachInsuraceService.coachInsuranceTagging(this.popupData.official_detail_id,this.userDetails.user_id).subscribe({
          next:(res:any)=>{
            this.mainListLoader=false
            if(res!=-1){
              this.alertService.swalPopSuccessTimer("Coach Tagged Successfully!")
              this.popupData.insurance_Status = 'P'
              this.popupData.taggedby_id=this.userDetails.user_id
              this.popupData.insurance_tagId=res
              this.submitDetailInsuranceModal = this.modalService.open(this.submitDetailConfirmPopup, { size: 'md', centered: true });

            }else{
              this.alertService.swalPopErrorTimer("Can Not Insure the Coach")
            }
          },
          error:()=>{
            console.error('error caught in scheme list')
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
        this.coachDetailsList()
      });
    }else{
      this.submitDetailInsuranceModal.close()
      const modalRef=this.modalService.open(AthleteInsuranceComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false })
      modalRef.componentInstance.coachData=this.popupData
      modalRef.componentInstance.menuName='coach'
      modalRef.result.then((event) => {
        this.coachDetailsList()
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
            this.coachDetailsList()
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
              this.coachDetailsList();
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
          this.coachDetailsList();
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
  openCoachProfile(rowData:any){
    //console.log(this.userDetails)
    const modalRef = this.modalService.open(PopupOfficialProfileComponent,{size:'xl', centered:true, scrollable:true, modalDialogClass:'customModalSizeLarge',
  backdrop:'static',keyboard:false})
  let officialRowData = {official_detail_id:rowData.official_detail_id,role_Id:2}
  modalRef.componentInstance.officialInstanceData = officialRowData
  }

  getAcademyCoachHistoryList(){
    this.mainListLoader = true
    this.coachDetail.getAcademyCoachHistoryList(this.userDetails.user_id).pipe(map((items:any)=>{
      return items.map((item:any)=>{
        return {...item,date_of_joining:item.date_of_joining? this.datePipe.transform(item.date_of_joining,'dd/MM/yyyy'):item.date_of_joining,
          weedOut_Date:item.weedOut_Date? this.datePipe.transform(item.weedOut_Date,'dd/MM/yyyy'):item.weedOut_Date
        }
      })
    })).subscribe({
      next:(res:any)=>{
        this.mainListLoader = false;
        this.coachDetailListPrevious = res;
        this.previousDataSource = new MatTableDataSource<CoachHistoryListPreviousEntity>(this.coachDetailListPrevious)
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
    this.previousDataSource.filter = searchKeywordValue.trim()
  }
}
