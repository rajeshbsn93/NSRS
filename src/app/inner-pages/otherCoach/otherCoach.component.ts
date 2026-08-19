import { Component, OnInit, ViewChild } from '@angular/core';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OtherCoachService } from 'src/app/_common/services/innerPagesServices/other-coach.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachInsuranceService } from 'src/app/_common/services/innerPagesServices/coach-insurance.service';
import { AthleteInsuranceComponent } from 'src/app/standalone_components/modal-window/athlete-insurance/athlete-insurance.component';
import { AthleteInsuranceSuccessComponent } from 'src/app/standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { CoachAcademyComponent } from 'src/app/_common/modal-window/coach-academy/coach-academy.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';

export interface PeriodicElement {
  academy_detail_id:Number;
  academy_name:string;
  category:string;
  coachName:string;
  date_of_joining:string;
  isweedout:number;
  is_region_verified:number;
  kitd_unique_id:string;
  mobile_number:string;
  official_detail_id:string;
  official_guid:string;
  region_id:number;
  sport_name:string;
  state_id:Number;
  state_name:string;
  weedout_date:Date;
  weedout_remark:string;
}

@Component({
  selector: 'app-otherCoach',
  templateUrl: './otherCoach.component.html',
  styleUrls: ['./otherCoach.component.css']
})
export class OtherCoachComponent implements OnInit {
  innerLoader:boolean = false;
  innerLoaderMainData:boolean = false;
  searchFilter!:FormGroup
  dataSource:any
  userDetails:any
  otherCoachListData: any = [];
  status:any
  searchedotherCoachListData:any=[]
  docType: string = 'Export';
  displayedColumns: string[] = [ 'kitd_unique_id', 'coach_Name', 'date_of_joining','academy_name', 'mobile_no','insurance_Status', 'state'];
  nsrsidInsurancePopup:any
  insuranceModal:any
  popupData:any
  selectedCoachData:any
  submitDetailInsuranceModal:any
  deleteInsuranceData:any
  deleteInsuranceModalRef:any
  distinctAcademy:any=[]
  distinctAcademyLength:any

  @ViewChild('exporter') exporter: any
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('content') insurancePopup: any;
  @ViewChild('deleteinsurance') deleteInsuranceModal: any;
  @ViewChild('SubmitTagcontent') submitDetailConfirmPopup: any;
  
  constructor(private fb:FormBuilder,private coachService:OtherCoachService,
    private modal: NgbModal,private coachInsuraceService:CoachInsuranceService,
    private alertService:AlertService, private storageService:StorageService) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.searchFilterReactiveForm()
    this.otherCoachListFunction()
  }

  searchFilterReactiveForm(){
    this.searchFilter=this.fb.group({
      nsrsid: [''],
      name: [''],
      academyName : [''],
      insurance_status: [''],
    })
  }

  ngOnDestroy(){
    this.modal.dismissAll()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //Exporting data to pdf and excel 
  selectChange(event: any) {
    // console.log(event)
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'otherCoach', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()

    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#kiaaTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#kiaaTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('otherCoach.pdf');
  } 

  rdListChange(event:any){
    // console.log(event.target.value)
    this.status=Number(event.target.value)
    this.otherCoachListFunction()
  }

  otherCoachListFunction(){
    if(!this.status){
      this.status=1
    }
    this.innerLoaderMainData=true
    this.coachService.getOtherCoachList(this.userDetails.user_id,this.userDetails.role_id,this.status)
    .subscribe({
      next:(res)=>{
        this.innerLoaderMainData=false
        this.otherCoachListData = res;
        const ELEMENT_DATA: PeriodicElement[] = this.otherCoachListData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.distinctAcademy = this.otherCoachListData.filter(
          (thing:any, i:any, arr:any) => arr.findIndex((t:any) => t.academy_name === thing.academy_name) === i
        ).sort(function(a:any,b:any){
          return a.academy_name >= b.academy_name ? 1:-1; 
        });
        this.distinctAcademyLength=this.distinctAcademy.length
      },
      error:()=>{

      }
    })
    
  }

  filterSearch(){
    // console.log(this.searchFilter.value)
    this.searchedotherCoachListData = this.otherCoachListData
    if (this.searchFilter.value.nsrsid != '') {
      this.searchedotherCoachListData = this.searchedotherCoachListData.filter((data: any) => {
        if (data.kitd_unique_id.toLowerCase() == this.searchFilter.value.nsrsid.toLowerCase()) {
          return data;
        }
      });
    }

    if (this.searchFilter.value.name != '') {
      this.searchedotherCoachListData = this.searchedotherCoachListData.filter((data: any) => {
        if (data.full_name.toLowerCase().includes(this.searchFilter.value.name.toLowerCase())) {
          return data
        }
      });
    }

    if (this.searchFilter.value.academyName!= '') {
      this.searchedotherCoachListData = this.searchedotherCoachListData.filter((data: any) => {
        if (data.academy_name.toLowerCase() == this.searchFilter.value.academyName.toLowerCase()) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.insurance_status != '') {
      this.searchedotherCoachListData = this.searchedotherCoachListData.filter((data: any) => {
        if (data.insurance_Status.toLowerCase() == this.searchFilter.value.insurance_status.toLowerCase()) {
          return data;
        }
      });
    }
    
  if (this.searchFilter.value.nsrsid == '' && this.searchFilter.value.name == '' && this.searchFilter.value.academyName == '' && this.searchFilter.value.insurance_status == '') {
    this.searchedotherCoachListData = this.otherCoachListData
  }

  // console.log(this.searchedotherCoachListData)

  this.dataSource = this.searchedotherCoachListData;
  this.dataSource = new MatTableDataSource<PeriodicElement>(
    this.searchedotherCoachListData
  );

  this.dataSource.paginator = this.paginator;
  this.dataSource.sort=this.sort

  }


  open(elementData:any){
    // console.log(elementData)
    this.nsrsidInsurancePopup = elementData.kitd_unique_id;
    // console.log(nsrs_id);
    this.popupData = elementData
    // console.log(this.popupData)
    // if (this.insurancePermission) {
      this.insuranceModal = this.modal.open(this.insurancePopup, {
        size: 'md',
        centered: true,
      });

  }

  confirm(){
    if (this.nsrsidInsurancePopup) {
      this.insuranceModal.close();
      // console.log(this.popupData)
      // console.log("nsrsid "+this.nsrsidInsurancePopup);
      this.selectedCoachData = this.popupData;
      // console.log(this.selectedCoachData)

      if (this.selectedCoachData.insurance_Status == 'No') {
        // console.log("userid  "+this.user_id)
        this.innerLoader=true
        this.coachInsuraceService.coachInsuranceTagging(this.selectedCoachData.official_detail_id,this.userDetails.user_id).subscribe(res=>{
          // console.log("insurance api response ")
          // console.log(res)
          this.innerLoader=false
          if(res!=-1){
            this.alertService.swalPopSuccessTimer("Coach Tagged Successfully!")
            var data = this.otherCoachListData.filter((data: any) => {
              if (data.kitd_unique_id == this.nsrsidInsurancePopup) {
                data.insurance_Status = 'Pending'
                data.insuredby_id=this.userDetails.user_id 
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
        ()=>{
          console.error('error caught in coach tagging')
          this.innerLoader = false;
        })
      }
    }
  }

  openCoachAcademyWindow( element:any) {
    // console.log("pop up opened")
    let elementData = element
    // console.log("my event", event)
    // console.log("my elemet data", elementData);
    const modalRef = this.modal.open(CoachAcademyComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.coachData = elementData;
    modalRef.componentInstance.menuName='otherCoach'
    // modalRef.componentInstance.coachPermissionData=this.coachPermissionData;
    modalRef.result.then((event) => {
      // this.coachListData();
      this.otherCoachListFunction();
    });
  }

  otherCoachInsurance(){
    this.submitDetailInsuranceModal.close()
    const modalRef=this.modal.open(AthleteInsuranceComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.coachData=this.selectedCoachData
    modalRef.componentInstance.menuName='coach'
    modalRef.result.then((event) => {
      this.otherCoachListFunction()
    });

  }

  coachPendingInsurance(elementData:any){
    // console.log(elementData)
    if(elementData.insurance_Status=="Pending"){
      const modalRef = this.modal.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
      modalRef.componentInstance.coachData=elementData
      modalRef.componentInstance.menuName='coach'
      modalRef.result.then((event) => {
        this.otherCoachListFunction()
      });
    }

  }

  athleteSuccessInsurace(elementData:any){
    this.innerLoader=true
    this.coachInsuraceService.coachGetData(elementData.official_detail_id,elementData.insurance_tagId).subscribe(res=>{
      this.innerLoader=false
      if (res) {
        // console.log(res)
        var resData:any=res
        // console.log("coach get data")
        // console.log(res)
        const modalRef = this.modal.open(AthleteInsuranceSuccessComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
        modalRef.componentInstance.coachData = elementData
        modalRef.componentInstance.coachGetData=resData
        modalRef.componentInstance.menuName='coach'
        modalRef.result.then((event) => {
          this.otherCoachListFunction()
        });
   
      } else {
        this.alertService.swalPopErrorTimer("Internal Server Error")
      }
    },()=>{
      console.error('error caught in scheme list')
      this.innerLoader = false;
    })
  }

  athleteExpiredInsurance(elementData:any){
    // console.log(elementData)
    this.innerLoader=true
    this.coachInsuraceService.coachInsuranceTagging(elementData.official_detail_id,this.userDetails.user_id).subscribe(res=>{
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
          this.otherCoachListFunction();
        });
      } else {
        this.alertService.swalPopErrorTimer("Can Not Insure the player")
      }
    },
    ()=>{
      console.error('error caught in scheme list')
      this.innerLoader = false;
    })
    
    
  }

  deleteInsurance(elementData:any){
    this.deleteInsuranceData=elementData
    this.deleteInsuranceModalRef = this.modal.open(this.deleteInsuranceModal,{size: 'md', centered: true,})
  }

  confirmDelete(){
    // console.log('delete')
    this.innerLoader=true
    this.coachInsuraceService.deleteInsurance(this.deleteInsuranceData.insurance_tagId,this.userDetails.user_id).subscribe(res=>{
      // console.log(res)
      this.innerLoader=false
      if(res==true){
        this.alertService.swalPopSuccess("Delete officialInsurance successfully!")
        this.otherCoachListFunction();
      }else{
        this.alertService.swalPopError("OfficialInsurance can't delete!")
      }
    },()=>{
      console.error('error caught in scheme list')
      this.innerLoader = false;
    })
    this.deleteInsuranceModalRef.close()

  }

}
