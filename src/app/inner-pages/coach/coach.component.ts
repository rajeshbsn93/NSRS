import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { CoachService } from 'src/app/_common/services/innerPagesServices/coach.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CoachAcademyComponent } from 'src/app/_common/modal-window/coach-academy/coach-academy.component';
import { AthleteInsuranceComponent } from 'src/app/standalone_components/modal-window/athlete-insurance/athlete-insurance.component';
import { AthleteInsuranceSuccessComponent } from 'src/app/standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { CoachInsuranceService } from 'src/app/_common/services/innerPagesServices/coach-insurance.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AdminCoachMappingComponent } from 'src/app/standalone_components/modal-window/admin-coach-mapping/admin-coach-mapping.component';
import { PopupOfficialProfileComponent } from 'src/app/standalone_components/modal-window/popup-official-profile/popup-official-profile.component';

export interface PeriodicElement {
  id: number;
  ath_Name: string
  gender: string
  is_Insured: boolean
  is_KIAA: number
  is_PDU: boolean
  is_Tops: boolean
  is_kia: number
  nsrsId: string
  insurance_Status:string
  player_detail_id: string
  scholarship_type: string
  sport_id: number
  sport_name: string
  trainingCenter: string;
}

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  innerLoader:boolean = false;
  innerLoadersportList:boolean = false;
  innerLoaderMainData:boolean = false;
  searchFilter!: FormGroup;
  userid: any = "";
  nsrs_id: any = "";
  name: any = "";
  sport_id: any = "";
  scheme_id: any = 0;
  gender: any = "";
  athleteList: any;
  sportListData: any = [];
  coachListData: any = [];
  searchedCoachListData:any=[];
  displayedColumns: string[] = ['nsrsId', 'NAME', 'Discipline', 'academy_name', 'insurance_Status',/* 'pduw',*/ 'kiaa'];
  dataSource: any;
  nsrsidweedout: any;
  docType: string = 'Export';
  popupData:any;
  insuranceModal:any;
  nsrsidInsurancePopup:any;
  selectedPlayerData:any;
  submitDetailInsuranceModal:any;
  coachMenuData:any;
  coachPermissionData:any;
  roleid:any;
  deleteInsuranceData:any;
  deleteInsuranceModalRef:any
  hideRoleID:number=173
  @ViewChild('content') insurancePopup: any;
  @ViewChild('SubmitTagcontent') submitDetailConfirmPopup: any;
  @ViewChild('deleteinsurance') deleteInsuranceModal: any;

  @ViewChild('exporter') exporter: any

  constructor(private coachService: CoachService,
    private sharableService: SharableService,
    private fb: FormBuilder,
    private modal: NgbModal,
    private coachInsuraceService:CoachInsuranceService,
    private _storageService:StorageService,
    private alertService:AlertService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.searchFilter = this.fb.group({
      nsrsid: [''],
      name: [''],
      discipline: [''],
      scheme: [''],
      gender: ['']
    })

    var temp: any = localStorage.getItem('loginUserdata');
    var tempData = JSON.parse(temp);
    this.userid = tempData.user_id;
    this.roleid = tempData.role_id;
    this.getCoachListData();
   
    this.sportList();

    // this.coachMenuData = this._storageService.menuData$
    // console.log("response from sidebar component to coach component", this.coachMenuData.source._value)
    this.coachMenuData = this._storageService.newGetState();
    // console.log("coach menu data",this.coachMenuData);
    
  }

  ngOnDestroy(){
    this.modal.dismissAll()
  }


  getCoachListData() {

    if(this.roleid==67){
        this.getSAICoachList()
    }else{
      this.innerLoaderMainData=true
    this.coachService.coachList(this.userid, this.nsrs_id, this.name,this.sport_id, this.scheme_id, this.gender).subscribe(result => {
        this.innerLoaderMainData=false
        this.coachListData = result;
        // console.log(result);
        const ELEMENT_DATA: PeriodicElement[] = this.coachListData
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (error)=>{
        console.error('error caught in getting coach list')
        // this.errorMessage = error;
        this.innerLoaderMainData = false;
      })
    }

   
  }


    getSAICoachList() {
    this.innerLoaderMainData=true
    this.coachService.saiCoachList(this.userid, this.nsrs_id, this.name,this.sport_id, this.scheme_id, this.gender).subscribe(result => {
        this.innerLoaderMainData=false
        this.coachListData = result;
        const ELEMENT_DATA: PeriodicElement[] = this.coachListData
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (error)=>{
        console.error('error caught in getting coach list')
        // this.errorMessage = error;
        this.innerLoaderMainData = false;
      })
  }

  sportList() {
    this.innerLoadersportList=true
    this.sharableService.sportList().subscribe(res => {
      this.innerLoadersportList=false
      this.sportListData = res
    },
    (error)=>{
      console.error('error caught in sport list')
      // this.errorMessage = error;
      this.innerLoadersportList = false;
    })
  }

  search() {
    this.searchedCoachListData=this.coachListData
    if(this.searchFilter.value.nsrsid!=''){
      this.searchedCoachListData = this.searchedCoachListData.filter((data: any) => {
        if (data.kitd_unique_id.toLowerCase() == this.searchFilter.value.nsrsid.toLowerCase()) {
          return data;
        }
      });
    }
    
    if(this.searchFilter.value.name!=''){
      this.searchedCoachListData = this.searchedCoachListData.filter((data: any) => {
        // if (data.ath_Name == this.searchFilter.value.name) {
        //   // console.log(data);
        //   return data;
        // }
        if(data.full_name.toLowerCase().includes(this.searchFilter.value.name.toLowerCase())){
          return data
        }
      });
    }

    if(this.searchFilter.value.discipline!=''){
      this.searchedCoachListData = this.searchedCoachListData.filter((data: any) => {
        if (data.sport_display_name.toLowerCase() == this.searchFilter.value.discipline.toLowerCase()) {
          return data;
        }
      });
    }
    // if(this.searchFilter.value.scheme!=''){
    //   this.searchedCoachListData = this.searchedCoachListData.filter((data: any) => {
    //     if (data.scholarship_type.toLowerCase() == this.searchFilter.value.scheme.toLowerCase()) {
    //       return data;
    //     }
    //   });
    // }
    if(this.searchFilter.value.gender!=''){
      this.searchedCoachListData = this.searchedCoachListData.filter((data: any) => {
        if(data.gender == this.searchFilter.value.gender) {        
          return data;
        }
    });
    // console.log(this.selectedAtheleteListData)
    }
    
    if(this.searchFilter.value.nsrsid=='' && this.searchFilter.value.name=='' && this.searchFilter.value.discipline=='' && this.searchFilter.value.scheme=='' && this.searchFilter.value.gender==''){
      this.searchedCoachListData=this.coachListData
    }
    
    // console.log(this.selectedAtheleteListData)

    this.dataSource = this.searchedCoachListData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.searchedCoachListData
        );

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectChange(event: any) {
    // console.log(event)
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'Coach', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()

    }
  }
  getPdf() {
    //console.log(this.dataSource)
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#coachTable' });
    // autoTable(temp, { body:this.dataSource.filteredData});
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#coachTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    // autoTable(doc, {body:this.dataSource.filteredData, headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('coach.pdf');
  }

  openCoachAcademyWindow( element:any) {

    if(this.roleid !=173){
    let payload={
      official_detail_id:element?.official_detail_id,
      roleId:2,
    }
    this.innerLoaderMainData = true;
    this.coachService.getTransferPopupDetail(payload).subscribe((result:any) => {
  
      // this.innerLoaderMainData=false
      // this.coachListData = result;
      // console.log(result);
      // const ELEMENT_DATA: PeriodicElement[] = this.coachListData
      // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      let elementData = element
      const modalRef = this.modal.open(CoachAcademyComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false })
      modalRef.componentInstance.coachData = elementData;
      modalRef.componentInstance.menuName='coachAcademy'
      modalRef.componentInstance.coachPermissionData=this.coachPermissionData;
      modalRef.componentInstance.transferPopupDetail = result[0];
      this.innerLoaderMainData = false;
      modalRef.result.then((event) => {
        // this.coachListData();
        this.getCoachListData();
      });

    },
    (error)=>{
      console.error('error caught in getting coach list')
      // this.errorMessage = error;
      this.innerLoaderMainData = false;
    })
    }



  }

  open(elementData:any){
    this.popupData=elementData   
    this.nsrsidInsurancePopup=this.popupData.kitd_unique_id
    this.insuranceModal = this.modal.open(this.insurancePopup, {
      size: 'md',
      centered: true,
    });
  }

  confirm(){
    if (this.nsrsidInsurancePopup) {
      this.insuranceModal.close();
      // console.log("nsrsid "+this.nsrsidInsurancePopup);
      var athleteData = this.coachListData.filter((data: any) => {
        if (data.kitd_unique_id == this.nsrsidInsurancePopup) {
          // console.log(data);
          return data;
        }
      });
      this.selectedPlayerData = athleteData;
      // console.log("this athlete data"+ this.selectedPlayerData[0])
      
      if (this.selectedPlayerData[0].insurance_Status == 'No') {
        this.innerLoader=true
        this.coachInsuraceService.coachInsuranceTagging(this.selectedPlayerData[0].official_detail_id,this.userid).subscribe(res=>{
          // console.log("insurance api response ")
          // console.log(res)
          this.innerLoader=false
          if(res!=-1){
            this.alertService.swalPopSuccessTimer("Coach Tagged Successfully!")
            var data = this.coachListData.filter((data: any) => {
              if (data.kitd_unique_id == this.nsrsidInsurancePopup) {
                data.insurance_Status = 'Pending'
                data.taggedby_id=this.userid 
                data.insurance_tagId=res        
                return data
              }
            });
            // this.selectedPlayerData[0].taggedby_id = this.insurance_id;
            this.submitDetailInsuranceModal = this.modal.open(this.submitDetailConfirmPopup, { size: 'md', centered: true });

          }else{
            this.alertService.swalPopErrorTimer("Can Not Insure the Coach")
          }
        },
        (error)=>{
          console.error('error caught in scheme list')
          // this.errorMessage = error;
          this.innerLoader = false;
        })
      }
    }
  }

  coachNoInsurance(){
    this.submitDetailInsuranceModal.close()
    const modalRef=this.modal.open(AthleteInsuranceComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.coachData=this.selectedPlayerData[0]
    modalRef.componentInstance.menuName='coach'
    modalRef.result.then((event) => {
      this.getCoachListData()
    });
  }

  coachPendingInsurance(elementData:any) {
    // console.log(elementData)
    if(elementData.insurance_Status=="Pending"){
      const modalRef = this.modal.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
      modalRef.componentInstance.coachData=elementData
      modalRef.componentInstance.menuName='coach'
      modalRef.result.then((event) => {
        this.getCoachListData()
      });
    }
  }

  coachInsuredInsurance(elementData:any){
    //console.log(elementData)
    this.innerLoader=true
    this.coachInsuraceService.coachGetData(elementData.official_detail_id,elementData.insurance_tagId).subscribe(res=>{
      if (res) {
        this.innerLoader=false
        // console.log(res)
        var resData:any=res
        // console.log("coach get data")
        // console.log(res)
        const modalRef = this.modal.open(AthleteInsuranceSuccessComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
        modalRef.componentInstance.coachData = elementData
        modalRef.componentInstance.coachGetData=resData
        modalRef.componentInstance.menuName='coach'
        modalRef.result.then((event) => {
          //console.log(event)
          this.getCoachListData()
        });
   
      } else {
        this.alertService.swalPopErrorTimer("Internal Server Error")
      }
    },
    ()=>{
      console.error(`error caught in getting ${elementData.official_detail_id} data`)
      this.innerLoader = false;
    })
  }

  coachExpiredInsurance(elementData:any){
    // console.log(elementData)
    this.innerLoader=true
    this.coachInsuraceService.coachInsuranceTagging(elementData.official_detail_id,this.userid).subscribe(res=>{
      // console.log(res)
      this.innerLoader=false
      if (res != false) {
        const modalRef = this.modal.open(AthleteInsuranceComponent, {
          size: 'xl',
          centered: true,
          backdrop: 'static',
          keyboard: false,
        });
        modalRef.componentInstance.coachData = elementData
        modalRef.componentInstance.menuName='coach'
        modalRef.result.then((event) => {
          this.getCoachListData();
        });
      } else {
        this.alertService.swalPopErrorTimer("Can Not Insure the player")
      }
    },
    ()=>{
      console.error('error caught in insurance tagging list')
      this.innerLoader = false;
    })
    
    
  }

  deleteCoachinsurance(elementData:any){
    // console.log(elementData)
    this.deleteInsuranceData = elementData;
    this.deleteInsuranceModalRef = this.modal.open(this.deleteInsuranceModal,{size: 'md', centered: true,})
  }

  confirmDelete(){
    // console.log('delete')
    this.innerLoader=true
    this.coachInsuraceService.deleteInsurance(this.deleteInsuranceData.insurance_tagId,this.userid).subscribe(res=>{
      // console.log(res)
      this.innerLoader=false
      if(res==true){
        this.alertService.swalPopSuccess("Delete officialInsurance successfully!")
        this.getCoachListData();
      }else{
        this.alertService.swalPopError("OfficialInsurance can't delete!")
      }
    },
    ()=>{
      console.error('error caught in deleting insurance')
      this.innerLoader = false;
    })
    this.deleteInsuranceModalRef.close()

  }

  addOtherCoach(){   
    const modalRef = this.modal.open(AdminCoachMappingComponent,{size:'xl',centered:true})
    modalRef.result.then((thenRes)=>{
      if(thenRes){
        this.getCoachListData();
      }
    })
  }

   openCoachProfile(rowData:any){
    const modalRef = this.modal.open(PopupOfficialProfileComponent,{size:'xl', centered:true, scrollable:true, modalDialogClass:'customModalSizeLarge',
  backdrop:'static',keyboard:false})
  let officialRowData = {official_detail_id:rowData.official_detail_id,role_Id:2}
  modalRef.componentInstance.officialInstanceData = officialRowData
  }
}
