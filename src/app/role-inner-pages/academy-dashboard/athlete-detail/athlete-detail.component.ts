import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { AthleteInsuranceComponent } from 'src/app/standalone_components/modal-window/athlete-insurance/athlete-insurance.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { Athelete_insuranceService } from 'src/app/_common/services/innerPagesServices/athelete_insurance.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { AthleteDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/athlete-detail-list.service';
import { AthleteDetailMultipleTagComponent } from '../../modal-window/athlete-detail-multiple-tag/athlete-detail-multiple-tag.component';
import { AthleteEditDetailsWeedoutComponent } from '../../modal-window/athlete-EditDetails-Weedout/athlete-EditDetails-Weedout.component';
import { AthleteInsuranceSuccessComponent } from 'src/app/standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { AthleteService } from 'src/app/_common/services/innerPagesServices/athlete.service';
import { map } from 'rxjs';
import { PopupAthleteProfileComponent } from 'src/app/standalone_components/modal-window/popup-athlete-profile/popup-athlete-profile.component';

export interface sportDiscipline{
  nsrsId:string ;
  ath_Name:string ,
  date_of_joining:string,
  geoLocation: string,
  is_insured:string,
  is_tops:string,
  is_kiaa:string,
  sport_name:string,
  joining_status:string,
  type_of_athelete:string,
  gender:string,
  mobile_number:string,
  state_name:string,
  valid_upto:string
}
export interface AthleteDetailPreviousEntity{
  nsrsId: string
  ath_Name: string
  academy_athelete_detail_id: number
  sport_name: string
  sport_detail_id: number
  player_detail_id: number
  type_of_athelete: string
  date_of_joining: string
  gender: string
  weedOut_Date: string
  weedOut_Remark: string
}

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.component.html',
  styleUrls: ['./athlete-detail.component.css'],
  standalone:true,
  imports:[MaterialModule,FormsModule,CommonModule,LoaderComponent,ReactiveFormsModule,NgbModule],
  providers: [DatePipe]
})
export class AthleteDetailComponent implements OnInit {
  
  displayedColumnsCurrent: string[] = ['nsrsId', 'ath_Name','sport_name','gender','mobile_number','state_name','date_of_joining','is_insured','is_kiaa','is_tops','type_of_athelete','geoLocation','joining_status',];
  currentDataSource:any;
  displayedColumnsPrevious: string[] = ['nsrsId', 'ath_Name','sport_name','gender','date_of_joining','weedOut_Date','weedOut_Remark',];
  previousDataSource = new MatTableDataSource<AthleteDetailPreviousEntity>()
  athleteDetailListCurrent:any=[]
  athleteDetailListPrevious:any=[]
  searchedAthleteList:any
  searchFilter!:FormGroup
  userDetails:any
  sportsDisciplineList:any
  docType: string = 'Export';
  mainListLoader:boolean=false;
  NoInsuracneConfirmPopup:any
  expiredinsuranceModal:any
  submitdetailsConfirmPopUp:any
  deleteInsuranceModal:any;
  
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild('exporter') exporter: any;
  @ViewChild('noInsuranceConfirmModal') noInsurancePopup:any;
  @ViewChild('SubmitInsurancecContent') submitInsuranceConfirm:any;
  @ViewChild('expiredInsurance') expiredInsurancePopup:any;
  @ViewChild('delete') deleteInsurancePop:any;
  @ViewChild('input') searchField!: ElementRef<HTMLInputElement>;

  constructor(private athleteDetailService:AthleteDetailListService, private modalService:NgbModal,
    private sharableService:AcademySharableService,private storageService:StorageService,private swalAlert:AlertService,
    private fb:FormBuilder,private atheleteInsuranceService:Athelete_insuranceService,private athleteService:AthleteService,
    private datePipe:DatePipe) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.getSportsDisciplineList()
    this.atheleteDetailsList()
    this.searchReactiveForm()
  }

  searchReactiveForm(){
    this.searchFilter=this.fb.group({
      disciplineToSearch:['']
    })
  }

  atheleteDetailsList(){
    this.mainListLoader=true;
    this.athleteDetailService.academyAthleteDetailList(this.userDetails.user_id).pipe(map((items:any)=>{
    return  items.map((item:any)=>{
      return {...item,gender:item.gender ==='M'?'Male':item.gender ==='F'?'Female':item.gender,
      date_of_joining: item.date_of_joining ? this.datePipe.transform(item.date_of_joining,'dd/MM/yyyy'): item.date_of_joining
    }
    })
    })).subscribe({
      next:(res)=>{
        this.mainListLoader=false
        this.athleteDetailListCurrent=res
        this.searchedAthleteList=this.athleteDetailListCurrent
        const ELEMENT_DATA: sportDiscipline[] = this.athleteDetailListCurrent;
        this.currentDataSource = new MatTableDataSource<sportDiscipline>(ELEMENT_DATA);
        this.currentDataSource.paginator = this.paginator.toArray()[0];
        this.currentDataSource.sort = this.sort.toArray()[0];
        if (this.searchField.nativeElement.value) this.currentDataSource.filter = this.searchField.nativeElement.value;
      },
      error:()=>{
        console.error('error caught athlete detail list')
        this.mainListLoader=false
      }
    })
  }

  getSportsDisciplineList(){
    this.sharableService.getAcademySportsDiscipline(this.userDetails.user_id).subscribe({
      next:(res)=>{
        this.sportsDisciplineList=res
      },
      error:()=>{
        console.error("error caught in getting academy sports list")
      }
    })
  }

  submitDiscipline(){
    if (this.searchFilter.value.disciplineToSearch != '') {
      this.searchedAthleteList = this.athleteDetailListCurrent.filter((data: any) => {
        if (data.sport_detail_id== this.searchFilter.value.disciplineToSearch) {
          return data;
        }
      });
    }else{
      this.searchedAthleteList=this.athleteDetailListCurrent
    }
    const ELEMENT_DATA: sportDiscipline[] = this.searchedAthleteList;
    this.currentDataSource = new MatTableDataSource<sportDiscipline>(ELEMENT_DATA);
    this.currentDataSource.paginator = this.paginator.toArray()[0];
    this.currentDataSource.sort = this.sort.toArray()[0];
  }

  openmultiTag(){
    const modelRef = this.modalService.open(AthleteDetailMultipleTagComponent,{size:'xl',centered:true, backdrop: 'static'})
    modelRef.componentInstance.disciplineToAddID=this.searchFilter.value.disciplineToSearch;

    modelRef.result
    .then(() => this.atheleteDetailsList())
    .catch(() => {});

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currentDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectChange(event: any) {
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'athleteDetail', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()
    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#athleteDetailTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#athleteDetailTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('athleteDetails.pdf');
  }
 
  openEditWeedout(elementRow:any, index: number){
    const modalRef =  this.modalService.open(AthleteEditDetailsWeedoutComponent,{size:'xl',centered:true})
    modalRef.componentInstance.elementRowData = elementRow;
    modalRef.componentInstance.deleteAthlete = false;
    

    modalRef.result.then((record)=>{
      // console.log('delete', record);
      if(record?.actionType === 'EDIT') {
        const rowData = this.currentDataSource.data[index];
        
        rowData.geoLocation = record.geoLocation;
        rowData.type_of_athelete = record.type_of_athelete;
        rowData.valid_upto = record.valid_upto;
        rowData.joining_status = record.joining_status;
        rowData.date_of_joining = record.date_of_joining;

        this.currentDataSource.data.splice(index, 1,rowData);
        this.currentDataSource._updateChangeSubscription();
      }
      else if(record?.actionType === 'DELETE') {
        
        this.currentDataSource.data.splice(index, 1);
        this.currentDataSource._updateChangeSubscription();
      }
      else if(record?.actionType === 'WEEDOUT')
      {
        //To be commented after changes to API
      }
      this.atheleteDetailsList();
    })
  }

  popupData:any
  noInsurance(elementRowData:any){
    this.popupData=elementRowData
    this.NoInsuracneConfirmPopup = this.modalService.open(this.noInsurancePopup, {size: 'md',centered: true,});
  }

  confirmNoInsuranceTag(){
    if (this.popupData) {
      this.NoInsuracneConfirmPopup.close()
      if (this.popupData.is_insured == '0') {
        this.mainListLoader=true
        this.atheleteInsuranceService.athleteInsuranceTagging(this.popupData.player_detail_id,
          this.userDetails.user_id,this.userDetails.role_id,1,"").subscribe({
            next:(res)=>{
              this.mainListLoader=false
              if (res) {
                this.swalAlert.swalPopSuccessTimer("Player Tagged Successfully!")
                // var data = this.atheleteListData.filter((data: any) => {
                //   if (data.nsrsId == this.nsrsidInsurancePopup) {
                //     data.is_Insured = true
                //     data.insurance_status = 'P'
                //     data.insured_by = this.userDetails.user_id
                //     return data
                //   }
                // });
                this.popupData.insurance_status='P'
                this.popupData.is_Insured=true
                this.submitdetailsConfirmPopUp = this.modalService.open(this.submitInsuranceConfirm, { size: 'md', centered: true });

              } else {
                this.swalAlert.swalPopErrorTimer("Can Not Insure the Athlete")
              }
            },
            error:()=>{
              console.error('error caught in insurance tagging')
              this.mainListLoader = false;
            }
          })
      }
    }
  }

  athleteInsuranceDetails(data:any){
    if(data==null){
      this.submitdetailsConfirmPopUp.close()
      const modalRef = this.modalService.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
      modalRef.componentInstance.athleteData = this.popupData;
      modalRef.componentInstance.menuName = 'athlete'
      // modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      modalRef.result.then(() => {
        this.atheleteDetailsList();
      });
    }else{
      const modalRef = this.modalService.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
      modalRef.componentInstance.athleteData = data;
      modalRef.componentInstance.menuName = 'athlete'
      // modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      modalRef.result.then(() => {
        this.atheleteDetailsList();
      });
    }
    
  }

  athleteInsuredSuccess(elementRowData:any){
    const modalRef = this.modalService.open(AthleteInsuranceSuccessComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
      modalRef.componentInstance.athleteData = elementRowData;
      modalRef.componentInstance.menuName = 'athlete'
      // modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      modalRef.result.then(() => {
        this.atheleteDetailsList();
      });
  }

  expiredInsuranceModal(elementRowData:any){
    this.popupData=elementRowData
    this.expiredinsuranceModal = this.modalService.open(this.expiredInsurancePopup, {size: 'md',centered: true});
  }

  confirmExpiredInsuranceTag(){
    this.expiredinsuranceModal.close()
    if (this.popupData.insurance_status == 'E') {
      const modalRef = this.modalService.open(AthleteInsuranceComponent, {size: 'xl',centered: true,backdrop: 'static',keyboard: false});
      modalRef.componentInstance.athleteData = this.popupData;
      modalRef.componentInstance.menuName = 'athlete'
      // modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      // modalRef.componentInstance.insurancePermissionData=false
      modalRef.result.then(() => {
        this.atheleteDetailsList();
      });
    }else {
      this.swalAlert.swalPopError("Internal Server Error occured in geting insurance details")
    }
  }

  deleteInsurance(elementRowData:any){
    this.popupData=elementRowData
    this.deleteInsuranceModal = this.modalService.open(this.deleteInsurancePop, {size: 'md',centered: true});
  }

  confirmDeleteInsurance(){
    this.deleteInsuranceModal.close()
    this.mainListLoader=true;
    this.athleteService.deleteAthleteInsurance(this.popupData.player_detail_id, this.userDetails.user_id)
    .subscribe({
      next:(res)=>{
        this.mainListLoader=false
        if(res){
          this.swalAlert.swalPopSuccess("Athlete insurance deleted successfully!")
          this.atheleteDetailsList()
        }else{
          this.swalAlert.swalPopError("Athlete insurance can't delete!")
        }
      },
      error:()=>{
        console.error('error caught in deleting insurance')
        this.mainListLoader = false;
      }
    })
  }

  openAthleteProfile(rowData:any){

    const modalRef = this.modalService.open(PopupAthleteProfileComponent,{size:'xl', centered:true, scrollable:true, modalDialogClass:'customModalSizeLarge',
  backdrop:'static',keyboard:false})
  modalRef.componentInstance.playerId = rowData.player_detail_id
  }

  getAcademyAthleteHistoryList(){
    this.mainListLoader = true;
    this.athleteDetailService.getAcademyAthleteHistoryList(this.userDetails.user_id).pipe(map((items:any)=>{
      return  items.map((item:any)=>{
        return {...item,gender:item.gender ==='M'?'Male':item.gender ==='F'?'Female':item.gender,
        date_of_joining: item.date_of_joining ? this.datePipe.transform(item.date_of_joining,'dd/MM/yyyy'): item.date_of_joining,
        weedOut_Date: item.weedOut_Date ? this.datePipe.transform(item.weedOut_Date,'dd/MM/yyyy'): item.weedOut_Date,
      }
      })
      })).subscribe({
      next:(res)=>{
        this.mainListLoader = false;
        console.log(res)
        this.athleteDetailListPrevious = res;
        this.previousDataSource = new MatTableDataSource<AthleteDetailPreviousEntity>(this.athleteDetailListPrevious);
        this.previousDataSource.paginator = this.paginator.toArray()[1];
        this.previousDataSource.sort = this.sort.toArray()[1];
      },
      error:(err)=>{
        console.error(err);
        this.mainListLoader = false;
      }
    })    
  }
  searchPreviousFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.previousDataSource.filter = filterValue.trim().toLowerCase();
  }



}
