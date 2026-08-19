import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { AthleteDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/athlete-detail-list.service';
import { AthleteInsuranceSuccessComponent } from 'src/app/standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { AthleteService } from 'src/app/_common/services/innerPagesServices/athlete.service';
import { first, map } from 'rxjs';
import { PopupAthleteProfileComponent } from 'src/app/standalone_components/modal-window/popup-athlete-profile/popup-athlete-profile.component';
import { AthleteEditDetailsWeedoutComponent } from 'src/app/role-inner-pages/modal-window/athlete-EditDetails-Weedout/athlete-EditDetails-Weedout.component';
import { AddCampAthleteComponent } from '../modal-window/add-camp-athlete/add-camp-athlete.component';
import { CampInnerPagesService } from 'src/app/_common/services/camp-services/camp-inner-pages.service';
import { CampAtheleteDetailEntity, CampAthleteService } from 'src/app/_common/services/camp-services/camp-athlete.service';


@Component({
  selector: 'app-camp-athlete',
  templateUrl: './camp-athlete.component.html',
  styleUrls: ['./camp-athlete.component.css'],
  standalone:true,
  imports:[MaterialModule,FormsModule,CommonModule,LoaderComponent,ReactiveFormsModule,NgbModule],
  providers: [DatePipe]
})
export class CampAthleteComponent implements OnInit {
  
  displayedColumns: string[] = ['nsrsId', 'ath_Name','sport_name','gender','mobile_number','state_name','date_of_joining','is_insured','is_kiaa','is_tops','event_category'];
  dataSource:any
  athleteDetailList:any=[]
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
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('exporter') exporter: any;
  @ViewChild('noInsuranceConfirmModal') noInsurancePopup:any;
  @ViewChild('SubmitInsurancecContent') submitInsuranceConfirm:any;
  @ViewChild('expiredInsurance') expiredInsurancePopup:any;
  @ViewChild('delete') deleteInsurancePop:any;
  @ViewChild('input') searchField!: ElementRef<HTMLInputElement>;

  constructor(private athleteDetailService:AthleteDetailListService, private modalService:NgbModal,
    private campInnerPagesService:CampInnerPagesService,private storageService:StorageService,private swalAlert:AlertService,
    private fb:FormBuilder,private atheleteInsuranceService:Athelete_insuranceService,private athleteService:AthleteService,
    private datePipe:DatePipe,private campAthleteService:CampAthleteService) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.getSportsDisciplineList()
    this.getCampAtheleteDetail()
    this.searchReactiveForm()
  }

  searchReactiveForm(){
    this.searchFilter=this.fb.group({
      disciplineToSearch:['']
    })
  }

  getCampAtheleteDetail(){
    this.mainListLoader=true;
    this.campAthleteService.campAtheleteDetail(this.userDetails.user_id).pipe(first(),map((items:any)=>{
    return  items.map((item:any)=>{
      return {...item,gender:item.gender ==='M'?'Male':item.gender ==='F'?'Female':item.gender,
      date_of_joining: item.date_of_joining ? this.datePipe.transform(item.date_of_joining,'dd/MM/yyyy'): item.date_of_joining
    }
    })
    })).subscribe({
      next:(res)=>{
        this.mainListLoader=false
        this.athleteDetailList=res
        this.searchedAthleteList=this.athleteDetailList
        const ELEMENT_DATA: CampAtheleteDetailEntity[] = this.athleteDetailList;
        this.dataSource = new MatTableDataSource<CampAtheleteDetailEntity>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.searchField.nativeElement.value) this.dataSource.filter = this.searchField.nativeElement.value;
      },
      error:()=>{
        console.error('error caught athlete detail list')
        this.mainListLoader=false
      }
    })
  }

  getSportsDisciplineList(){
    this.campInnerPagesService.getCampSportsDiscipline(this.userDetails.user_id).pipe(first()).subscribe({
      next:(res)=>{
        this.sportsDisciplineList=res;
      },
      error:()=>{
        console.error("error caught in getting academy sports list")
      }
    })
  }

  changeDiscipline(){
    if (this.searchFilter.value.disciplineToSearch != '') {
      let sportdata = this.sportsDisciplineList.filter((item:any)=>{
        if(item.sport_detail_id ==this.searchFilter.value.disciplineToSearch) return item
      })
      this.searchedAthleteList = this.athleteDetailList.filter((data: any) => {        
        // console.log(sportdata)
        if (data.sport_display_name== sportdata[0].sport_display_name) {
          return data;
        }
      });
    }else{
      this.searchedAthleteList=this.athleteDetailList
    }
    const ELEMENT_DATA: CampAtheleteDetailEntity[] = this.searchedAthleteList;
    this.dataSource = new MatTableDataSource<CampAtheleteDetailEntity>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openmultiTag(){
    if(this.searchFilter.value.disciplineToSearch == ''){
      this.swalAlert.swalPopWarning('Please Select Discipline')     
    }else{
      const modelRef = this.modalService.open(AddCampAthleteComponent,{size:'xl',centered:true, backdrop: 'static'})
      modelRef.componentInstance.disciplineToAddID=this.searchFilter.value.disciplineToSearch;

      modelRef.result
      .then(() => this.getCampAtheleteDetail())
      .catch(() => {});
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
        const rowData = this.dataSource.data[index];
        
        rowData.geoLocation = record.geoLocation;
        rowData.type_of_athelete = record.type_of_athelete;
        rowData.valid_upto = record.valid_upto;
        rowData.joining_status = record.joining_status;
        rowData.date_of_joining = record.date_of_joining;

        this.dataSource.data.splice(index, 1,rowData);
        this.dataSource._updateChangeSubscription();
      }
      else if(record?.actionType === 'DELETE') {
        
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }
      else if(record?.actionType === 'WEEDOUT')
      {
        //To be commented after changes to API
      }
      this.getCampAtheleteDetail();
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
        this.getCampAtheleteDetail();
      });
    }else{
      const modalRef = this.modalService.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
      modalRef.componentInstance.athleteData = data;
      modalRef.componentInstance.menuName = 'athlete'
      // modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      modalRef.result.then(() => {
        this.getCampAtheleteDetail();
      });
    }
    
  }

  athleteInsuredSuccess(elementRowData:any){
    const modalRef = this.modalService.open(AthleteInsuranceSuccessComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
      modalRef.componentInstance.athleteData = elementRowData;
      modalRef.componentInstance.menuName = 'athlete'
      // modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      modalRef.result.then(() => {
        this.getCampAtheleteDetail();
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
        this.getCampAtheleteDetail();
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
          this.getCampAtheleteDetail()
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



}
